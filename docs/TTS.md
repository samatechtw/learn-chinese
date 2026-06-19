# TTS audio cache (R2 + `tts_cache`)

`learn-api` serves text-to-speech audio from a cache shared by every clip and
language (the Chinese phrases page, unit lessons, the vocab quiz, Vietnamese,
…). Each clip is stored once as an object in the `tts-assets` R2 bucket
(`tts/<language>/<cache_key>.<ext>`) and indexed in the `tts_cache` Postgres
table. On a cache hit the API returns a presigned R2 URL; on a miss it
synthesizes (Chinese via **BreezyVoice**, with Azure fallback; other languages
via the configured provider), uploads, inserts the row, and returns the audio.

The backend looks up audio purely by `cache_key`, and that key is the object's
name — so **R2 is the durable source of truth and the `tts_cache` rows are
rebuildable from it.** Clearing the DB loses only the index rows; the audio
survives and the rows can be re-derived without re-synthesizing.

## Tooling & runbook

The local scripts live in `tools/scripts/tts/`. Copy `config.env.example` to
`config.env` (gitignored; holds R2 secrets + Postgres access), then:

```bash
cd tools/scripts/tts

# General: rebuild tts_cache rows from audio already in R2 — works for ALL clips.
./restore-cache.sh            # default language; --all for every language; --dry-run to preview

# Phrases page: synthesize anything missing (needs learn-api + a TTS provider).
./start-breezyvoice.sh        # BreezyVoice (Chinese) on 127.0.0.1:4051
./warm-phrases.sh             # warm the Chinese phrases page

./status.sh                   # health + rows-vs-objects + phrase coverage
```

learn-api and the frontend are started the normal way (`cargo run`,
`pnpm dev:web:run`) — these scripts only handle the TTS cache and BreezyVoice.

See **`tools/scripts/tts/README.md`** for the cache-key contract, the
restore-vs-warm split, and all flags.
