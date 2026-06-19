#!/usr/bin/env bash
# Shared helpers for the local TTS cache tooling.
#
# Loads tools/scripts/tts/config.env (gitignored, holds real secrets + the
# box-specific ports/URLs) and provides cache-key, S3/R2, and Postgres helpers
# used by restore-cache.sh / warm-phrases.sh / status.sh.
#
# Source this; do not execute it directly.
set -euo pipefail

TTS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$TTS_DIR/../../.." && pwd)"

# ---- Config -----------------------------------------------------------------
CONFIG_FILE="${TTS_CONFIG_FILE:-$TTS_DIR/config.env}"
if [[ ! -f "$CONFIG_FILE" ]]; then
  echo "ERROR: $CONFIG_FILE not found." >&2
  echo "Copy config.env.example to config.env and fill in the secrets." >&2
  exit 1
fi
# shellcheck disable=SC1090
set -a; source "$CONFIG_FILE"; set +a

# Defaults for anything the config omits.
: "${S3_BUCKET:=tts-assets}"
: "${TTS_LANGUAGE:=chinese}"          # default language for restore/status/warm
: "${TTS_VOICE:=default}"             # phrase-warm cache-key parts (Chinese + BreezyVoice)
: "${TTS_RATE:=n/a}"
: "${TTS_PROVIDER:=openai-compatible}"
: "${TTS_AUDIO_FORMAT:=audio/wav}"
: "${LEARN_API_HOST:=127.0.0.1}"
: "${LEARN_API_PORT:=4010}"
: "${BREEZYVOICE_PORT:=4051}"
: "${K8S_CONTEXT:=k3d-learn-dev}"
: "${PG_POD:=postgresql-0}"
: "${DB_NAME:=db_app}"
: "${PGPASSWORD:=password}"

API_BASE="http://${LEARN_API_HOST}:${LEARN_API_PORT}"

# ---- Cache key (must match backend generate_cache_key + resolve_provider) ----
# Rust hashes: sha256("{text}|{language}|{provider}|{voice}|{rate}") over the
# trimmed text. For Chinese with no explicit voice/rate the server resolves to
# the openai-compatible provider, voice "default", rate "n/a" — the TTS_* values
# above. This key is only needed to pre-warm known text (warm-phrases.sh); the
# restore path reads the key straight out of the object name instead.
tts_cache_key() {
  local text="$1"
  printf '%s' "${text}|${TTS_LANGUAGE}|${TTS_PROVIDER}|${TTS_VOICE}|${TTS_RATE}" \
    | sha256sum | awk '{print $1}'
}

# Object layout is tts/<language>/<cache_key>.<ext>. The cache_key is the whole
# identity the backend looks up by, so it round-trips through the object name.
tts_s3_key() { printf 'tts/%s/%s.%s' "$TTS_LANGUAGE" "$1" "${2:-wav}"; }

# content-type for the audio_format column, inferred from the object extension.
audio_format_for_ext() {
  case "$1" in
    wav) echo 'audio/wav' ;;
    mp3) echo 'audio/mpeg' ;;
    *)   echo "audio/$1" ;;
  esac
}

# ---- S3 (Cloudflare R2, S3-compatible) --------------------------------------
_aws() {
  AWS_ACCESS_KEY_ID="$S3_ACCESS_KEY_ID" \
  AWS_SECRET_ACCESS_KEY="$S3_SECRET_ACCESS_KEY" \
  AWS_DEFAULT_REGION=auto \
  AWS_EC2_METADATA_DISABLED=true \
    aws "$@" --endpoint-url "$S3_URL"
}

# Echo the object size in bytes, or empty string if the object is absent.
s3_object_size() {
  local key="$1"
  _aws s3api head-object --bucket "$S3_BUCKET" --key "$key" \
    --query ContentLength --output text 2>/dev/null || true
}

# Echo "<key><TAB><size>" for every object under tts/<language>/ (auto-paginated).
s3_list_objects() {
  local language="$1"
  _aws s3api list-objects-v2 --bucket "$S3_BUCKET" --prefix "tts/${language}/" \
    --query 'Contents[].[Key,Size]' --output text 2>/dev/null \
    | grep -v '^None$' || true
}

# Echo every language prefix present under tts/ (one per line).
s3_list_languages() {
  _aws s3api list-objects-v2 --bucket "$S3_BUCKET" --prefix 'tts/' --delimiter '/' \
    --query 'CommonPrefixes[].Prefix' --output text 2>/dev/null \
    | tr '\t' '\n' | sed -n 's#^tts/\(.*\)/$#\1#p' || true
}

# Number of objects under tts/<language>/.
s3_count() { s3_list_objects "$1" | grep -c . || true; }

# ---- Postgres (via the k3d pod; no local psql client on this box) ------------
pg() { kubectl --context "$K8S_CONTEXT" exec -i "pod/$PG_POD" -- \
         env PGPASSWORD="$PGPASSWORD" psql -U postgres -d "$DB_NAME" "$@"; }

# Single-quote-escape a value for inline SQL.
sql_quote() { local s="${1//\'/\'\'}"; printf "'%s'" "$s"; }
