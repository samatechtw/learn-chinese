<template>
  <div class="phrases-wrap">
    <div class="phrases container f-col">
      <div class="header">
        <div class="title-block">
          <PageNav
            :nav="
              getLanguageBreadcrumbs('chinese', {
                name: 'ChinesePhrases',
                label: ts('phrases.title'),
              })
            "
          />
          <h1 class="hero-title">{{ ts('phrases.title') }}</h1>
          <p class="subtitle">{{ ts('phrases.subtitle') }}</p>
        </div>
        <div class="actions">
          <button type="button" class="action-btn" @click="setAll(false)">
            {{ ts('phrases.expand_all') }}
          </button>
          <button type="button" class="action-btn" @click="setAll(true)">
            {{ ts('phrases.collapse_all') }}
          </button>
        </div>
      </div>

      <div class="hint">{{ ts('phrases.hint') }}</div>

      <div class="sections">
        <PhraseSection
          v-for="section in phraseSections"
          :key="section.id"
          :section="section"
          :collapsed="!!collapsed[section.id]"
          @toggle="toggle(section.id)"
        />
      </div>
    </div>

    <MoeDictionaryModal ref="dictRef" hide-trigger />
  </div>
</template>

<script lang="ts" setup>
import { provide, reactive, ref } from 'vue'
import { PageNav } from '@frontend/components/widgets'
import { ts } from '@frontend/i18n'
import { getLanguageBreadcrumbs } from '@frontend/util/misc'
import { phraseSections } from '@learn-chinese/util/phrases'
import MoeDictionaryModal from '../vocab/MoeDictionaryModal.vue'
import PhraseSection from './PhraseSection.vue'
import { DictionaryKey } from './dictionary-key'

const collapsed = reactive<Record<string, boolean>>({})

const dictRef = ref<InstanceType<typeof MoeDictionaryModal> | null>(null)

const toggle = (id: string) => {
  collapsed[id] = !collapsed[id]
}

const setAll = (value: boolean) => {
  for (const section of phraseSections) {
    collapsed[section.id] = value
  }
}

provide(DictionaryKey, (word: string) => dictRef.value?.open(word))
</script>

<style lang="postcss" scoped>
@import '@theme/css/defines.postcss';

.phrases-wrap {
  background: linear-gradient(130deg, #bbe1fa 0%, #e6f1ff 45%, #f7fbff 100%);
  color: $text1;
  min-height: calc(100vh - $header-height);
}
.phrases {
  padding: 96px 0 140px;
}
.header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
}
.title-block {
  flex: 1;
  min-width: 260px;
}
.hero-title {
  @mixin title 36px;
  margin: 12px 0 6px 0;
  color: $color2;
}
.subtitle {
  @mixin text 16px;
  color: $text2;
  max-width: 560px;
}
.actions {
  display: flex;
  gap: 10px;
}
.action-btn {
  @mixin title-regular 13px;
  color: $color2;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(50, 130, 184, 0.22);
  border-radius: 999px;
  padding: 8px 14px;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    box-shadow 0.15s ease;
}
.action-btn:hover {
  background: #ffffff;
  box-shadow: 0 6px 14px rgba(50, 130, 184, 0.16);
}
.hint {
  @mixin text 14px;
  color: $text2;
  margin-top: 18px;
}
.sections {
  display: flex;
  flex-direction: column;
  gap: 36px;
  margin-top: 24px;
}
@media (max-width: 720px) {
  .phrases {
    padding: 88px 0 120px;
  }
  .hero-title {
    font-size: 30px;
  }
  .subtitle {
    font-size: 15px;
  }
}
</style>
