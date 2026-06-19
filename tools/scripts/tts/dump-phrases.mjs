// Emit the canonical Chinese phrase list (one JSON array of `zh` strings) used
// by the phrases page. This is the single source of truth consumed by the
// warm/restore tooling, so the cache always tracks exactly what the UI shows.
//
// Run with the repo's tsx (it imports a .ts module):
//   ./node_modules/.bin/tsx tools/scripts/tts/dump-phrases.mjs
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(here, '../../..')
const phrasesPath = resolve(repoRoot, 'web/learn-chinese/src/util/phrases/phrases.ts')

const mod = await import(phrasesPath)
const sections = mod.phraseSections ?? []

const out = []
const seen = new Set()
for (const section of sections) {
  for (const phrase of section.phrases ?? []) {
    const zh = (phrase.zh ?? '').trim()
    if (zh && !seen.has(zh)) {
      seen.add(zh)
      out.push(zh)
    }
  }
}

process.stdout.write(JSON.stringify(out))
