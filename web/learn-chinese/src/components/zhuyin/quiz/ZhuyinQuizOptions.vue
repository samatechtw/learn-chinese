<template>
  <div class="options">
    <Checkbox
      :item="{
        label: ts('hide_keyboard'),
        checked: store.zhuyin.quizOptions.value.hideKeyboard,
      }"
      class="keyboard-toggle"
      @checked="store.zhuyin.setQuizOptions({ hideKeyboard: $event })"
    />
    <Checkbox
      :item="{
        label: ts('cheat'),
        checked: store.zhuyin.quizOptions.value.cheating,
      }"
      class="cheat"
      @checked="setCheating"
    />
  </div>
</template>

<script lang="ts" setup>
import { store } from '@learn-chinese/store'
import { Checkbox } from '@frontend/components/widgets'
import { ts } from '@frontend/i18n'

const setCheating = (on: boolean) => {
  store.zhuyin.setQuizOptions({ cheating: on })
  if (on) {
    store.zhuyin.setQuiz({ cheated: true })
  }
}
</script>

<style lang="postcss" scoped>
@import '@theme/css/defines.postcss';

.options {
  display: flex;
  align-items: center;
  padding: 16px 0 24px;
  .keyboard-toggle,
  :deep(.checkbox) {
    margin: 0;
  }
  .keyboard-toggle {
    margin-right: 12px;
  }
}
</style>
