<template>
  <div class="options">
    <Checkbox
      :item="{
        label: ts('hide_keyboard'),
        checked: store.typing.typingOptions.value.hideKeyboard,
      }"
      class="keyboard-toggle"
      @checked="store.typing.setTypingOptions({ hideKeyboard: $event })"
    />
    <Checkbox
      :item="{
        label: ts('cheat'),
        checked: store.typing.typingOptions.value.cheating,
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
  store.typing.setTypingOptions({ cheating: on })
  if (on) {
    store.typing.setTyping({ cheated: 100 })
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
