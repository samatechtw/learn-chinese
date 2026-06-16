<template>
  <div class="learn-wrap">
    <div class="zhuyin-learn container f-col">
      <PageNav
        :nav="
          getLanguageBreadcrumbs('chinese', { name: 'ZhuyinLearn', label: ts('learn') })
        "
      />
      <h1 class="hero-title">
        {{ ts('zhuyin.symbols') }}
      </h1>
      <div class="options f-col">
        <Checkbox
          :item="{ label: ts('zhuyin.pinyin'), checked: store.misc.showPinyin.value }"
          @checked="store.misc.setShowPinyin($event)"
        />
        <AudioOptions />
      </div>
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
      <ZhuyinKeyboard
        class="zh-keyboard"
        :showPinyin="store.misc.showPinyin.value"
        @press="selectKey"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { Checkbox, PageNav } from '@frontend/components/widgets'
import { KeyType } from '@frontend/types'
import { ts } from '@frontend/i18n'
import { getLanguageBreadcrumbs } from '@frontend/util/misc'
import { store } from '@learn-chinese/store'
import { AudioOptions, ZhuyinKeyboard } from '@learn-chinese/components/widgets'
import { zhuyinSymbols } from '@learn-chinese/util/zhuyin'
import { populateVoices, saySymbol } from '@learn-chinese/util/speech'

const selected = ref()

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
})
</script>

<style lang="postcss" scoped>
@import '@theme/css/defines.postcss';

.learn-wrap {
  background: $color4;
}
.hero-title {
  @mixin title 32px;
  margin: 8px 0 0 0;
}
.zhuyin-learn {
  min-height: calc(100vh - $header-height);
  padding: 140px 0 160px;
  align-items: center;
}
.options {
  margin-top: 16px;
  align-items: center;
}
.zh-keyboard {
  margin-top: 24px;
}
.preview {
  @mixin title 48px;
  margin-top: 16px;
  min-height: 120px;
}
.pinyin {
  font-size: 28px;
}
.preview-placeholder {
  @mixin title-regular 20px;
  color: #a7a9a8;
}
</style>
