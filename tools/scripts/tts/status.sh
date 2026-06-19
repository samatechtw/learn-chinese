#!/usr/bin/env bash
# Health + cache-consistency check for the local TTS stack.
#
#   * services      : BreezyVoice + learn-api (needed only for synthesis/warming)
#   * cache by lang  : tts_cache rows vs R2 objects for each language present
#   * phrases page   : how many Chinese phrases are cached (run warm-phrases.sh)
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib.sh"

ok() { printf '  \033[32m✓\033[0m %s\n' "$1"; }
bad() { printf '  \033[31m✗\033[0m %s\n' "$1"; }

echo "== Services (for synthesis) =="
if curl -fsS --max-time 5 "http://127.0.0.1:${BREEZYVOICE_PORT}/v1/models" >/dev/null 2>&1; then
  ok "BreezyVoice  http://127.0.0.1:${BREEZYVOICE_PORT}"
else
  bad "BreezyVoice  http://127.0.0.1:${BREEZYVOICE_PORT} (down)"
fi
if curl -fsS --max-time 5 "${API_BASE}/api/healthz" >/dev/null 2>&1; then
  ok "learn-api    ${API_BASE}"
else
  bad "learn-api    ${API_BASE} (down)"
fi

echo "== TTS cache (rows vs R2 objects) =="
mapfile -t LANGS < <(s3_list_languages)
[[ ${#LANGS[@]} -eq 0 ]] && echo "  (no audio in R2 yet)"
for language in "${LANGS[@]}"; do
  db_count="$(pg -t -A -c "SELECT count(*) FROM tts_cache WHERE language=$(sql_quote "$language");" 2>/dev/null | tr -d '[:space:]')"
  s3_count="$(s3_count "$language" | tr -d '[:space:]')"
  printf '  %-11s DB rows %s / R2 objects %s\n' "$language" "${db_count:-?}" "${s3_count:-?}"
  if [[ "$db_count" == "$s3_count" ]]; then
    ok "every object indexed"
  else
    bad "index out of sync — run ./restore-cache.sh --language $language"
  fi
done

echo "== Chinese phrases page =="
mapfile -t PHRASES < <("$REPO_ROOT/node_modules/.bin/tsx" "$TTS_DIR/dump-phrases.mjs" 2>/dev/null | jq -r '.[]')
declare -A HAVE_ROW=()
while IFS= read -r k; do [[ -n "$k" ]] && HAVE_ROW["$k"]=1; done < <(
  pg -t -A -c "SELECT cache_key FROM tts_cache WHERE language='${TTS_LANGUAGE}';" 2>/dev/null
)
cached=0
for zh in "${PHRASES[@]}"; do
  [[ -n "${HAVE_ROW[$(tts_cache_key "$zh")]:-}" ]] && cached=$((cached+1))
done
echo "  ${cached} / ${#PHRASES[@]} phrases cached"
if [[ "$cached" == "${#PHRASES[@]}" ]]; then
  ok "phrases page fully warm"
else
  bad "missing phrases — run ./warm-phrases.sh"
fi
