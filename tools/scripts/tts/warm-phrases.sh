#!/usr/bin/env bash
# Warm the TTS cache for every phrase on the Chinese phrases page.
#
# Unlike restore-cache.sh (which rebuilds rows for whatever audio already exists
# in R2), this guarantees the *phrases page* is fully cached: it knows each
# phrase's text, so it can synthesize anything genuinely missing. For each phrase
# the desired state is an R2 object AND a tts_cache row keyed by the backend's
# cache key. Idempotent and self-healing:
#
#   * row present                 -> skip (already warm)
#   * object present, row missing -> INSERT the row from R2 (fast; no synthesis)
#   * object missing              -> call the API to synthesize -> R2 + row
#                                    (needs learn-api + a TTS provider running)
#
# Phrase rows inserted here carry the real text_content (restore-cache.sh leaves
# it blank). The phrase list is read live from the phrases page via
# dump-phrases.mjs, so the cache always tracks exactly what the UI shows.
#
# Usage:
#   ./warm-phrases.sh                 # restore from R2, synthesize anything missing
#   ./warm-phrases.sh --restore-only  # only re-insert rows for existing R2 objects (no provider needed)
#   ./warm-phrases.sh --dry-run       # report what each phrase needs, change nothing
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib.sh"

RESTORE_ONLY=0
DRY_RUN=0
for arg in "$@"; do
  case "$arg" in
    --restore-only) RESTORE_ONLY=1 ;;
    --dry-run) DRY_RUN=1 ;;
    -h|--help) grep '^#' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "Unknown arg: $arg" >&2; exit 2 ;;
  esac
done

echo "==> Loading canonical phrase list"
mapfile -t PHRASES < <("$REPO_ROOT/node_modules/.bin/tsx" "$TTS_DIR/dump-phrases.mjs" | jq -r '.[]')
echo "    ${#PHRASES[@]} phrases"

echo "==> Reading existing tts_cache keys"
declare -A HAVE_ROW=()
while IFS= read -r k; do [[ -n "$k" ]] && HAVE_ROW["$k"]=1; done < <(
  pg -t -A -c "SELECT cache_key FROM tts_cache WHERE language='${TTS_LANGUAGE}';" 2>/dev/null
)
echo "    ${#HAVE_ROW[@]} rows currently in DB"

ok=0; restored=0; synthesized=0; failed=0
INSERT_SQL=""

for zh in "${PHRASES[@]}"; do
  key="$(tts_cache_key "$zh")"
  s3key="$(tts_s3_key "$key")"

  if [[ -n "${HAVE_ROW[$key]:-}" ]]; then
    ok=$((ok+1)); continue
  fi

  size="$(s3_object_size "$s3key")"
  if [[ -n "$size" && "$size" != "None" ]]; then
    # Restore path: object exists, row is missing -> rebuild the row (with text).
    echo "    restore: $zh"
    if [[ "$DRY_RUN" == 0 ]]; then
      INSERT_SQL+="INSERT INTO tts_cache (cache_key, text_content, language, voice_name, speech_rate, s3_key, audio_format, audio_size_bytes) VALUES ($(sql_quote "$key"), $(sql_quote "$zh"), $(sql_quote "$TTS_LANGUAGE"), $(sql_quote "$TTS_VOICE"), $(sql_quote "$TTS_RATE"), $(sql_quote "$s3key"), $(sql_quote "$TTS_AUDIO_FORMAT"), ${size}) ON CONFLICT (cache_key) DO NOTHING;"$'\n'
    fi
    restored=$((restored+1))
    continue
  fi

  # Synthesize path: nothing in R2 yet.
  if [[ "$RESTORE_ONLY" == 1 ]]; then
    echo "    MISSING (skipped, --restore-only): $zh"
    failed=$((failed+1)); continue
  fi
  echo "    synth:   $zh"
  if [[ "$DRY_RUN" == 0 ]]; then
    enc="$(jq -rn --arg s "$zh" '$s|@uri')"
    if curl -fsS --max-time 120 "${API_BASE}/api/tts/${TTS_LANGUAGE}?query=${enc}" >/dev/null 2>&1; then
      synthesized=$((synthesized+1))
    else
      echo "      ERROR synthesizing: $zh" >&2
      failed=$((failed+1))
    fi
  else
    synthesized=$((synthesized+1))
  fi
done

if [[ -n "$INSERT_SQL" && "$DRY_RUN" == 0 ]]; then
  echo "==> Inserting ${restored} restored row(s)"
  printf '%s' "$INSERT_SQL" | pg -q -f - >/dev/null
fi

echo ""
label=""; [[ "$DRY_RUN" == 1 ]] && label=" (dry run)"
echo "==> Summary${label}"
echo "    already warm : $ok"
echo "    restored     : $restored"
echo "    synthesized  : $synthesized"
echo "    failed       : $failed"
total=$(( ok + restored + synthesized ))
echo "    cached / total: ${total} / ${#PHRASES[@]}"
[[ "$failed" -eq 0 ]]
