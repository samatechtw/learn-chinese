# TTS audio cache — restore & warm tooling

`learn-api` serves text-to-speech audio from a cache: every clip is stored once
as an object in a **Cloudflare R2** bucket (`tts-assets`) and indexed in the
**`tts_cache`** Postgres table. The frontend asks the API for a clip; on a cache
**hit** it gets a presigned R2 URL, on a **miss** the API synthesizes →
uploads to R2 → inserts a `tts_cache` row → returns the audio inline.

```
browser ──/api/tts/<language>?query=…──▶ learn-api ──hit──▶ presigned R2 URL ──▶ plays
                                            │
                                          miss ──▶ synthesize ──▶ upload R2 ──▶ insert tts_cache ──▶ inline audio
```

This applies to **every clip and language** — the Chinese phrases page, unit
lessons, the vocab quiz, Vietnamese audio, etc. Chinese is synthesized by
**BreezyVoice** (an OpenAI-compatible server in `~/git/libs/BreezyVoice`, with
Azure as a fallback); other languages use the provider learn-api is configured
for. The objects live at `tts/<language>/<cache_key>.<ext>`.

The key fact the tooling relies on: **the backend looks up audio purely by
`cache_key`, and that key is the object's name.** So R2 is the durable source of
truth and the `tts_cache` rows are fully rebuildable from it.

## Two jobs

| Script             | Job                                                                 | Needs                |
|--------------------|---------------------------------------------------------------------|----------------------|
| `restore-cache.sh` | Rebuild `tts_cache` rows from audio already in R2 — **all clips**    | Postgres + R2 only   |
| `warm-phrases.sh`  | Make sure every Chinese **phrases-page** clip is cached (synth gaps) | learn-api + provider |

`restore-cache.sh` is the general recovery path: a DB clear loses only the index
rows, and this re-derives them from R2 for any clip in any language. It never
synthesizes. `warm-phrases.sh` is the only piece that's phrase-specific — it
knows the phrase *text* (from the phrases page), so it can synthesize anything
that has no audio yet.

## Setup (once)

```bash
cp config.env.example config.env   # then fill in R2 secrets + Postgres access
```
`config.env` holds the secrets/ports and is gitignored (`*.env`).

## Restore the cache after a DB clear

```bash
./restore-cache.sh                       # restore the default language (TTS_LANGUAGE)
./restore-cache.sh --language vietnamese  # a specific language
./restore-cache.sh --all                  # every language present under tts/
./restore-cache.sh --dry-run              # report what would be inserted, change nothing
```

Per object: if a row already exists it's skipped; otherwise the row is rebuilt
from the object name + size. `text_content`/voice/rate aren't stored in R2, so
restored rows leave those blank — cosmetic only, since cache hits look up by
`cache_key`.

## Warm the Chinese phrases page

Guarantees the phrases page is fully cached, synthesizing anything missing.
Needs `learn-api` running with a Chinese TTS provider reachable — start
BreezyVoice with `./start-breezyvoice.sh` (it loads the model, ~15s, then serves
on `:4051`); run learn-api and the frontend the normal way (`cargo run`,
`pnpm dev:web:run`).

```bash
./warm-phrases.sh                # restore phrase rows from R2, synthesize any gaps
./warm-phrases.sh --restore-only # only rebuild phrase rows from existing R2 audio (no provider needed)
./warm-phrases.sh --dry-run      # report what each phrase needs, change nothing
```

The phrase list is read live from
`web/learn-chinese/src/util/phrases/phrases.ts` via `dump-phrases.mjs`, so the
cache always tracks exactly what the page shows. Add a phrase there, re-run, done.

> Unit lessons and the vocab quiz synthesize on demand rather than being
> pre-warmed; their audio still lands in R2 + `tts_cache` the first time it
> plays, and `restore-cache.sh` recovers those rows like any other.

## Status

```bash
./status.sh   # BreezyVoice/learn-api health, rows-vs-objects per language, phrase coverage
```

## Files

| File                  | Purpose                                                  |
|-----------------------|----------------------------------------------------------|
| `config.env(.example)`| Runtime config + secrets (real file gitignored)          |
| `lib.sh`              | Shared helpers (cache key, R2, Postgres)                 |
| `dump-phrases.mjs`    | Canonical phrases-page text list (input to warming)      |
| `restore-cache.sh`    | Rebuild rows from R2 for all clips (general restore)     |
| `warm-phrases.sh`     | Warm/synthesize the Chinese phrases page                 |
| `status.sh`           | Health + cache consistency                               |
| `start-breezyvoice.sh`| Launch the BreezyVoice Chinese TTS server                |
