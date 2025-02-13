<template>
  <div class="learn-wrap">
    <div class="zhuyin-learn container f-col">
      <h1 class="hero-title">
        {{ ts('zhuyin.learn') }}
      </h1>
      <AudioOptions />
      <div class="preview f-center-col">
        <div class="symbol">
          {{ selected?.s }}
        </div>
        <div class="pinyin">
          {{ selected?.p }}
        </div>
        <div v-if="!selected" class="preview-placeholder">
          {{ ts('zhuyin.preview') }}
        </div>
      </div>
      <ZhuyinKeyboard class="zh-keyboard" @press="selectKey" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { AudioOptions, ZhuyinKeyboard } from '@frontend/components/widgets'
import { zhuyinSymbols } from '@frontend/util/zhuyin'
import { KeyType } from '@frontend/types'
import { populateVoices, say } from '@frontend/util/speech'
import { store } from '@frontend/store'
import { ts } from '../../i18n'

const selected = ref()

const saySymbol = (s: string) => {
  if (!store.misc.playAudio.value) {
    return
  }
  const voices = populateVoices()
  if (!voices) {
    return
  }
  const voice = store.misc.voiceName.value
  say(voices, voice ?? voices[0].name, s)
}

const selectKey = (key: KeyType, event?: KeyboardEvent) => {
  if (event?.ctrlKey || event?.metaKey) {
    return
  }
  if (key === 'Escape') {
    selected.value = undefined
  }
  const symbol = zhuyinSymbols[key]
  if (symbol) {
    selected.value = symbol
    saySymbol(symbol.s)
  }
}

onMounted(() => {
  populateVoices()
  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoices
  }
})
</script>

<style lang="postcss" scoped>
@import '@theme/css/defines.postcss';

.learn-wrap {
  background: $color4;
}
.hero-title {
  @mixin title 32px;
  margin: 0;
}
.zhuyin-learn {
  min-height: calc(100vh - $header-height);
  padding: 140px 0 160px;
  align-items: center;
}
.zh-keyboard {
  margin-top: 40px;
}
.preview {
  @mixin title 44px;
  margin-top: 24px;
  min-height: 90px;
}
.pinyin {
  font-size: 28px;
}
.preview-placeholder {
  @mixin title-regular 20px;
  color: #a7a9a8;
}
</style>
