<template>
  <Modal :show="show" cls="zhuyin-typing-modal" @cancel="emit('cancel')">
    <div class="modal-title">
      {{ ts('typing_options') }}
    </div>
    <div class="modal-text">
      {{ ts('zhuyin.typing_options_text') }}
    </div>
    <div class="count-option option-wrap">
      <div class="option-text">
        {{ ts('zhuyin.typing_count') }}
      </div>
    </div>
  </Modal>
</template>

<script lang="ts" setup>
import { Modal } from '@frontend/components/widgets'
import { ts } from '../../i18n'

defineProps<{
  show: boolean
  loading: boolean
}>()
const emit = defineEmits<{
  (e: 'cancel'): void
}>()
</script>

<style lang="postcss">
@import '@theme/css/defines.postcss';

.definition-modal {
  .modal-inner {
    width: 460px;
  }
}
</style>
