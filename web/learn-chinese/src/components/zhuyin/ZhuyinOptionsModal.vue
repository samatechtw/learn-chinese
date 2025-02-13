<template>
  <Modal :show="show" cls="zhuyin-options-modal" @cancel="emit('cancel')">
    <div class="modal-title">
      {{ ts('quiz_options') }}
    </div>
    <div class="modal-text">
      {{ ts('zhuyin.quiz_text') }}
    </div>
    <div
      class="reverse-option option-wrap"
      @click="setOption({ reverse: !store.zhuyin.quizOptions.value.reverse })"
    >
      <div class="option-text">
        {{ ts('zhuyin.quiz_reverse') }}
      </div>
      <Checkbox :item="{ label: '', checked: store.zhuyin.quizOptions.value.reverse }" />
    </div>
    <div class="reverse-option option-wrap">
      <div class="option-text">
        {{ ts(`zhuyin.${store.zhuyin.quizOptions.value.order}`) }}
      </div>
      <STMultiselect
        :value="store.zhuyin.quizOptions.value.order"
        class="table-select"
        :options="orderOptions"
        :clearable="false"
        @select="setOption({ order: $event })"
        @click.stop
      />
    </div>
    <div class="buttons">
      <AppButton :text="ts('start')" @click="emit('start')" />
    </div>
  </Modal>
</template>

<script lang="ts" setup>
import { STMultiselect } from '@samatech/vue-components'
import { AppButton, Checkbox, Modal } from '@frontend/components/widgets'
import { ts } from '../../i18n'
import { store } from '@frontend/store'
import { IZhuyinQuizOptions, QuizOrder } from '@frontend/types'

defineProps<{
  show: boolean
}>()
const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'start'): void
}>()

const orderOptions: QuizOrder[] = ['random', 'difficult']

const setOption = (options: Partial<IZhuyinQuizOptions>) => {
  store.zhuyin.setOptions(options)
  console.log(store.zhuyin.quizOptions.value)
}
</script>

<style lang="postcss">
@import '@theme/css/defines.postcss';

.zhuyin-options-modal {
  .modal-inner {
    width: 460px;
  }
}
.option-wrap {
  @mixin title-regular 14px;
  align-items: center;
  margin-top: 16px;
  display: flex;
  justify-content: space-between;
  .checkbox {
    margin: 0;
  }
}
.reverse-option {
  margin-top: 16px;
  cursor: pointer;
}
.option-text {
  max-width: 300px;
  padding-right: 24px;
  color: $text3;
}
.buttons {
  text-align: center;
  margin-top: 24px;
}
</style>
