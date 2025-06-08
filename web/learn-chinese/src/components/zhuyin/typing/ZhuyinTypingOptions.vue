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
    <AudioOptions :hideVoice="true" class="audio" />
  </div>
</template>

<script lang="ts" setup>
import { store } from '@frontend/store'
import { AudioOptions, Checkbox } from '@frontend/components/widgets'
import { ts } from '../../../i18n'

const setCheating = (on: boolean) => {
  store.typing.setTypingOptions({ cheating: on })
  if (on) {
    store.typing.setTyping({ cheated: 100 })
  }
}
</script>

<style lang="postcss" scoped>
@import '@theme/css/defines.postcss';

.audio {
  margin-left: 16px;
}
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
