<template>
  <div class="moe-dictionary-modal">
    <button
      type="button"
      class="dictionary-trigger"
      :title="word ? `Look up ${word}` : 'Open dictionary'"
      @click="openModal"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" class="dictionary-icon">
        <path
          d="M10.5 3a7.5 7.5 0 1 1-4.95 13.05l-2.4 2.4a1 1 0 0 1-1.4-1.43l2.36-2.36A7.5 7.5 0 0 1 10.5 3zm0 2a5.5 5.5 0 1 0 0 11a5.5 5.5 0 0 0 0-11z"
        />
      </svg>
    </button>
    <Modal :show="showModal" cls="dictionary-modal" @cancel="closeModal">
      <div class="modal-header">
        <div class="title">Dictionary</div>
        <div class="subtitle">Powered by MoeDict /a endpoint</div>
      </div>
      <form class="lookup-form" @submit.prevent="lookup(searchQuery)">
        <label class="input-label" for="dictionary-word">Word</label>
        <div class="input-row">
          <input
            id="dictionary-word"
            v-model="searchQuery"
            type="text"
            class="text-input"
            placeholder="Enter a Chinese word (e.g. 愛)"
            autocomplete="off"
          />
          <button class="lookup-button" type="submit" :disabled="loading || !searchQuery.trim()">
            <Spinner v-if="loading" :size="12" color="#fff" />
            <span v-else>Lookup</span>
          </button>
        </div>
        <button
          v-if="word && searchQuery !== word"
          type="button"
          class="prefill"
          @click="prefillFromCard"
        >
          Use current card: <strong>{{ word }}</strong>
        </button>
      </form>
      <div v-if="loading" class="status loading">
        <Spinner :size="14" color="#3282b8" />
        <span>Loading definition...</span>
      </div>
      <div v-else-if="error" class="status error">
        {{ error }}
      </div>
      <div v-else-if="!entry" class="status hint">
        Enter a word to see its dictionary entry.
      </div>
      <div v-else class="results">
        <div class="entry-head">
          <div class="headword">{{ entry.t }}</div>
          <div class="meta">
            <span v-if="entry.r">Radical: {{ cleanText(entry.r) }}</span>
            <span v-if="entry.c">Strokes: {{ entry.c }}</span>
          </div>
          <div v-if="englishTranslations.length" class="translations">
            <div class="label">English</div>
            <div class="values">
              <div v-for="(t, idx) in englishTranslations" :key="idx" class="translation-line">
                {{ t }}
              </div>
            </div>
          </div>
        </div>
        <div
          v-for="(heteronym, idx) in entry.h ?? []"
          :key="idx"
          class="heteronym"
        >
          <div class="pronunciation">
            <span v-if="heteronym.b" class="bopomofo">{{ cleanText(heteronym.b) }}</span>
            <span v-if="heteronym.p" class="pinyin">{{ heteronym.p }}</span>
          </div>
          <div
            v-for="(definition, defIdx) in visibleDefinitions(heteronym, idx)"
            :key="defIdx"
            class="definition"
          >
            <div class="definition-head">
              <span v-if="definition.type" class="type">{{ cleanText(definition.type) }}</span>
            </div>
            <div v-if="definition.f" class="definition-text">
              {{ cleanText(definition.f) }}
            </div>
            <div v-if="definition.e?.length" class="supporting">
              <span class="label">Examples</span>
              <ul>
                <li v-for="(example, i) in definition.e" :key="i">
                  {{ cleanText(example) }}
                </li>
              </ul>
            </div>
            <div v-if="definition.q?.length" class="supporting">
              <span class="label">Quotes</span>
              <ul>
                <li v-for="(quote, i) in definition.q" :key="i">
                  {{ cleanText(quote) }}
                </li>
              </ul>
            </div>
            <div v-if="definition.l?.length" class="supporting">
              <span class="label">Related</span>
              <ul>
                <li v-for="(link, i) in definition.l" :key="i">
                  {{ cleanText(link) }}
                </li>
              </ul>
            </div>
          </div>
          <button
            v-if="(heteronym.d?.length ?? 0) > maxDefinitions"
            type="button"
            class="show-more"
            @click="toggleHeteronym(idx)"
          >
            {{ heteronymExpanded[idx] ? 'Show less' : 'Show more' }}
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, watch } from 'vue'
import { Modal, Spinner } from '@frontend/components/widgets'
import { IMoeDictEntry, IMoeDictHeteronym } from '@frontend/types/api'

const props = defineProps<{
  word?: string
}>()

const showModal = ref(false)
const searchQuery = ref('')
const loading = ref(false)
const error = ref('')
const entry = ref<IMoeDictEntry | null>(null)
const heteronymExpanded = reactive<Record<number, boolean>>({})

const maxDefinitions = 2

const englishTranslations = computed(() => {
  const translations = entry.value?.translation
  if (!translations) return []
  return translations.English || translations.english || []
})

const cleanText = (text?: string): string => {
  if (!text) return ''
  return text.replace(/[`~￹￺￻]/g, '')
}

const visibleDefinitions = (heteronym: IMoeDictHeteronym, index: number) => {
  const defs = heteronym.d ?? []
  if (heteronymExpanded[index]) return defs
  return defs.slice(0, maxDefinitions)
}

const toggleHeteronym = (index: number) => {
  heteronymExpanded[index] = !heteronymExpanded[index]
}

const lookup = async (query: string) => {
  const trimmed = query.trim()
  if (!trimmed) {
    error.value = 'Please enter a word to look up.'
    return
  }
  loading.value = true
  error.value = ''
  try {
    const res = await fetch(`https://www.moedict.tw/a/${encodeURIComponent(trimmed)}.json`)
    if (!res.ok) {
      throw new Error('No entry found for that word.')
    }
    const data = (await res.json()) as IMoeDictEntry
    entry.value = data
    Object.keys(heteronymExpanded).forEach((key) => delete heteronymExpanded[Number(key)])
  } catch (err) {
    console.error(err)
    error.value = err instanceof Error ? err.message : 'Unable to load the definition.'
    entry.value = null
  } finally {
    loading.value = false
  }
}

const openModal = () => {
  showModal.value = true
  error.value = ''
  if (props.word) {
    searchQuery.value = props.word
    lookup(props.word)
  }
}

const closeModal = () => {
  showModal.value = false
}

const prefillFromCard = () => {
  if (!props.word) return
  searchQuery.value = props.word
  lookup(props.word)
}

watch(
  () => props.word,
  (newWord) => {
    if (!showModal.value && newWord && !searchQuery.value) {
      searchQuery.value = newWord
    }
  },
)
</script>

<style lang="postcss" scoped>
@import '@theme/css/defines.postcss';

.moe-dictionary-modal {
  position: relative;
}

.dictionary-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #3282b8, #5db8ff);
  color: white;
  box-shadow: 0 10px 18px rgba(50, 130, 184, 0.28);
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.dictionary-trigger:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 22px rgba(50, 130, 184, 0.32);
}

.dictionary-trigger:active {
  transform: translateY(0);
}

.dictionary-icon {
  width: 20px;
  height: 20px;
  fill: currentColor;
}

:deep(.dictionary-modal .modal-inner) {
  width: 640px;
  max-width: calc(100vw - 40px);
  max-height: 75vh;
  overflow-y: auto;
  overflow-x: hidden;
  border-radius: 16px;
  background: linear-gradient(180deg, #f4f9ff 0%, #ffffff 100%);
  border: 1px solid rgba(50, 130, 184, 0.15);
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.12);
}

.modal-header {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
}

.title {
  @mixin title 20px;
  color: $text1;
}

.subtitle {
  @mixin text 14px;
  color: $text2;
}

.lookup-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.input-label {
  @mixin title-regular 13px;
  color: $text2;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.input-row {
  display: flex;
  gap: 10px;
  align-items: center;
}

.text-input {
  flex: 1;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid rgba(50, 130, 184, 0.18);
  background: white;
  font-size: 15px;
  color: $text1;
}

.lookup-button {
  @mixin title-regular 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 14px;
  background: linear-gradient(135deg, #3282b8, #5db8ff);
  border: none;
  color: white;
  border-radius: 10px;
  cursor: pointer;
  min-width: 92px;
  box-shadow: 0 10px 18px rgba(50, 130, 184, 0.26);
}

.lookup-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
}

.prefill {
  @mixin text 13px;
  align-self: flex-start;
  color: $color2;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.status {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-top: 8px;
  color: $text2;
}

.status.error {
  color: $incorrect;
}

.status.hint {
  color: $text2;
}

.results {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.entry-head {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(50, 130, 184, 0.16);
  border-radius: 12px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.headword {
  @mixin title 26px;
  color: $text1;
}

.meta {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  color: $text2;
  @mixin text 13px;
}

.translations {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.translations .label {
  @mixin title-regular 12px;
  color: $text2;
  letter-spacing: 0.4px;
  text-transform: uppercase;
}

.translations .values {
  display: flex;
  flex-direction: column;
  gap: 4px;
  color: $text1;
}

.translation-line {
  @mixin text 14px;
}

.heteronym {
  padding: 12px 14px;
  border-radius: 12px;
  background: rgba(238, 247, 255, 0.6);
  border: 1px solid rgba(50, 130, 184, 0.12);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.pronunciation {
  display: flex;
  gap: 10px;
  align-items: baseline;
  flex-wrap: wrap;
}

.bopomofo {
  @mixin title 18px;
}

.pinyin {
  @mixin text 14px;
  color: $text2;
}

.definition {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-left: 4px;
}

.definition-head .type {
  @mixin title-regular 12px;
  color: $color2;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.definition-text {
  @mixin text 15px;
  color: $text1;
}

.supporting {
  display: flex;
  flex-direction: column;
  gap: 4px;
  color: $text2;
  @mixin text 13px;
}

.supporting .label {
  font-weight: 600;
}

.supporting ul {
  padding-left: 18px;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.show-more {
  align-self: flex-start;
  @mixin title-regular 13px;
  color: $color2;
  border: none;
  background: none;
  cursor: pointer;
  padding: 4px 0;
}

@media (max-width: 640px) {
  :deep(.dictionary-modal .modal-inner) {
    width: calc(100vw - 24px);
    padding: 18px 16px;
  }
  .headword {
    font-size: 22px;
  }
}
</style>

<style lang="postcss">
.dictionary-modal .modal-inner {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  max-height: 75vh;
}
</style>
