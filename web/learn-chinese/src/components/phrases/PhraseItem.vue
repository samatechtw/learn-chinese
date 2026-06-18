<template>
  <div class="phrase-item">
    <div class="phrase-top">
      <div class="hanzi" lang="zh-Hant">
        <template v-for="(char, i) in chars" :key="i">
          <button
            v-if="char.lookup"
            type="button"
            class="char"
            :title="`Look up ${char.value}`"
            @click="openDictionary?.(char.value)"
          >
            {{ char.value }}
          </button>
          <span v-else class="punct">{{ char.value }}</span>
        </template>
      </div>
      <button
        type="button"
        class="audio-btn"
        :class="{ playing: isPlaying }"
        :title="`Play ${phrase.zh}`"
        :disabled="isPlaying"
        @click="play"
      >
        <Spinner v-if="isPlaying" :size="14" color="#3282b8" />
        <Sound v-else class="audio-icon" />
      </button>
    </div>
    <div class="pinyin">{{ phrase.pinyin }}</div>
    <div class="english">{{ phrase.en }}</div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, ref } from 'vue'
import { Spinner } from '@frontend/components/widgets'
import { Sound } from '@frontend/components/svg'
import { IPhrase } from '@learn-chinese/types'
import { isLookupChar } from '@learn-chinese/util/phrases'
import { playChineseAudio } from '@learn-chinese/util/speech'
import { DictionaryKey } from './dictionary-key'

const props = defineProps<{
  phrase: IPhrase
}>()

const openDictionary = inject(DictionaryKey, undefined)

const isPlaying = ref(false)

const chars = computed(() =>
  Array.from(props.phrase.zh).map((value) => ({
    value,
    lookup: isLookupChar(value),
  })),
)

const play = async () => {
  if (isPlaying.value) {
    return
  }
  isPlaying.value = true
  try {
    await playChineseAudio(props.phrase.zh)
  } finally {
    isPlaying.value = false
  }
}
</script>

<style lang="postcss" scoped>
@import '@theme/css/defines.postcss';

.phrase-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px 16px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(50, 130, 184, 0.16);
  box-shadow: 0 6px 18px rgba(15, 76, 117, 0.06);
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    border-color 0.18s ease;
}
.phrase-item:hover {
  transform: translateY(-2px);
  border-color: rgba(50, 130, 184, 0.32);
  box-shadow: 0 12px 26px rgba(15, 76, 117, 0.12);
}
.phrase-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}
.hanzi {
  @mixin title 27px;
  color: $color1;
  line-height: 1.25;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
.char {
  font: inherit;
  color: inherit;
  background: none;
  border: none;
  padding: 0 1px;
  margin: 0;
  cursor: pointer;
  border-radius: 4px;
  transition:
    color 0.12s ease,
    background-color 0.12s ease;
}
.char:hover {
  color: $color3;
  background: rgba(50, 130, 184, 0.12);
}
.punct {
  padding: 0 1px;
  color: $color1;
}
.audio-btn {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1px solid rgba(50, 130, 184, 0.18);
  background: rgba(238, 247, 255, 0.7);
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    transform 0.15s ease,
    box-shadow 0.15s ease;
}
.audio-btn:disabled {
  cursor: default;
}
.audio-btn:hover:not(:disabled) {
  background: #ffffff;
  transform: translateY(-1px);
  box-shadow: 0 6px 14px rgba(50, 130, 184, 0.22);
}
.audio-btn.playing {
  background: #ffffff;
}
.audio-icon {
  width: 18px;
  height: 18px;
  display: block;
}
.pinyin {
  @mixin text 14px;
  color: $color3;
}
.english {
  @mixin text 15px;
  color: $text1;
}
</style>
