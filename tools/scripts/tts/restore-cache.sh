#!/usr/bin/env bash
# Rebuild tts_cache rows from the audio already in R2 (S3).
#
# R2 objects are durable; clearing the DB only loses the tts_cache index rows.
# This recovers the audio references for EVERY cached clip — phrases, unit
# lessons, vocab-quiz audio, any language — by reading the object keys. It needs
# only Postgres + S3 (no learn-api / BreezyVoice / synthesis).
#
# Why this works for all clips: the backend looks up audio purely by cache_key,
# and the cache_key is the object name (tts/<language>/<cache_key>.<ext>). So a
# row rebuilds exactly from the object. text_content / voice / rate are not
# stored in R2, so restored rows leave those blank — cosmetic only, cache hits
# never read them. (Run warm-phrases.sh to give phrase-page rows their real text.)
#
# Usage:
#   ./restore-cache.sh                       # restore TTS_LANGUAGE (default: chinese)
#   ./restore-cache.sh --language vietnamese # restore one specific language
#   ./restore-cache.sh --all                 # every language present under tts/
#   ./restore-cache.sh --dry-run             # report what would be inserted, change nothing
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib.sh"

DRY_RUN=0
ALL=0
ONE_LANGUAGE=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --all) ALL=1 ;;
    --language) ONE_LANGUAGE="${2:?--language needs a value}"; shift ;;
    --language=*) ONE_LANGUAGE="${1#*=}" ;;
    --dry-run) DRY_RUN=1 ;;
    -h|--help) grep '^#' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "Unknown arg: $1" >&2; exit 2 ;;
  esac
  shift
done

# Decide which languages to restore.
LANGUAGES=()
if [[ "$ALL" == 1 ]]; then
  mapfile -t LANGUAGES < <(s3_list_languages)
  [[ ${#LANGUAGES[@]} -eq 0 ]] && { echo "No language prefixes found under tts/ in R2."; exit 0; }
else
  LANGUAGES=("${ONE_LANGUAGE:-$TTS_LANGUAGE}")
fi

grand_ok=0; grand_restored=0; grand_objs=0

for language in "${LANGUAGES[@]}"; do
  echo "==> ${language}: reading R2 objects + existing tts_cache rows"

  unset HAVE_ROW; declare -A HAVE_ROW=()
  while IFS= read -r k; do [[ -n "$k" ]] && HAVE_ROW["$k"]=1; done < <(
    pg -t -A -c "SELECT cache_key FROM tts_cache WHERE language=$(sql_quote "$language");" 2>/dev/null
  )

  ok=0; restored=0; objs=0
  INSERT_SQL=""
  while IFS=$'\t' read -r key size; do
    [[ -z "$key" ]] && continue
    base="${key##*/}"           # <cache_key>.<ext>
    if [[ "$base" != *.* ]]; then
      echo "    skip (no extension): $key" >&2; continue
    fi
    cache_key="${base%.*}"
    ext="${base##*.}"
    objs=$((objs+1))

    if [[ -n "${HAVE_ROW[$cache_key]:-}" ]]; then
      ok=$((ok+1)); continue
    fi

    echo "    restore: $key (${size} bytes)"
    if [[ "$DRY_RUN" == 0 ]]; then
      fmt="$(audio_format_for_ext "$ext")"
      INSERT_SQL+="INSERT INTO tts_cache (cache_key, text_content, language, voice_name, speech_rate, s3_key, audio_format, audio_size_bytes) VALUES ($(sql_quote "$cache_key"), '', $(sql_quote "$language"), '', '', $(sql_quote "$key"), $(sql_quote "$fmt"), ${size}) ON CONFLICT (cache_key) DO NOTHING;"$'\n'
    fi
    restored=$((restored+1))
  done < <(s3_list_objects "$language")

  if [[ -n "$INSERT_SQL" && "$DRY_RUN" == 0 ]]; then
    echo "    inserting ${restored} row(s)"
    printf '%s' "$INSERT_SQL" | pg -q -f - >/dev/null
  fi

  echo "    objects: ${objs}  already indexed: ${ok}  restored: ${restored}"
  grand_ok=$((grand_ok+ok)); grand_restored=$((grand_restored+restored)); grand_objs=$((grand_objs+objs))
done

echo ""
label=""; [[ "$DRY_RUN" == 1 ]] && label=" (dry run)"
echo "==> Summary${label}"
echo "    languages       : ${LANGUAGES[*]}"
echo "    R2 objects       : ${grand_objs}"
echo "    already indexed  : ${grand_ok}"
echo "    rows restored    : ${grand_restored}"
