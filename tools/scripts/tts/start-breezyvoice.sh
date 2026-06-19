#!/usr/bin/env bash
# Start the BreezyVoice (OpenAI-compatible) Chinese TTS server.
# Binds 127.0.0.1:$BREEZYVOICE_PORT; learn-api reaches it via OPENAI_TTS_BASE_URL.
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib.sh"

BREEZYVOICE_DIR="${BREEZYVOICE_DIR:-$HOME/git/libs/BreezyVoice}"
if [[ ! -x "$BREEZYVOICE_DIR/server.sh" ]]; then
  echo "ERROR: $BREEZYVOICE_DIR/server.sh not found (set BREEZYVOICE_DIR in config.env)" >&2
  exit 1
fi

echo "Starting BreezyVoice on 127.0.0.1:${BREEZYVOICE_PORT} ..."
cd "$BREEZYVOICE_DIR"
exec bash server.sh "$BREEZYVOICE_PORT"
