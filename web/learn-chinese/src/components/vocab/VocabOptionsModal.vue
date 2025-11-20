<template>
  <Modal :show="show" cls="vocab-options-modal" @cancel="emit('cancel')">
    <div class="modal-title">
      {{ ts('quiz_options') }}
    </div>
    <div class="modal-text">
      {{ ts('vocab.quiz_options_text') }}
    </div>
    <div class="hsk-option option-wrap">
      <div class="option-text">
        {{ ts('vocab.hsk_level') }}
      </div>
      <STMultiselect
        :value="store.vocab.quizOptions.value.hskLevel"
        class="table-select"
        :options="hskLevelOptions"
        :clearable="false"
        @select="setOption({ hskLevel: $event })"
        @click.stop
      />
    </div>
    <div class="count-option option-wrap">
      <div class="option-text">
        {{ ts('vocab.quiz_count') }}
      </div>
      <STMultiselect
        :value="store.vocab.quizOptions.value.count"
        class="table-select"
        :options="countOptions"
        :clearable="false"
        @select="setOption({ count: $event })"
        @click.stop
      />
    </div>
    <div class="order-option option-wrap">
      <div class="option-text">
        {{ ts(`vocab.${store.vocab.quizOptions.value.order}`) }}
      </div>
      <STMultiselect
        :value="store.vocab.quizOptions.value.order"
        class="table-select"
        :options="orderOptions"
        :clearable="false"
        @select="setOption({ order: $event })"
        @click.stop
      />
    </div>
    <div class="buttons">
      <AppButton :text="ts('start')" @click="emit('start')" class="start" />
      <AppButton
        v-if="store.vocab.quiz.value"
        :text="ts('resume')"
        @click="emit('resume')"
        class="resume"
      />
    </div>
  </Modal>
</template>

<script lang="ts" setup>
import { STMultiselect } from '@samatech/vue-components'
import { AppButton, Modal } from '@frontend/components/widgets'
import { store } from '@frontend/store'
import { IVocabQuizOptions, QuizOrder, VocabHSKLevel, VocabQuizCount } from '@frontend/types'
import { ts } from '../../i18n'

defineProps<{
  show: boolean
}>()
const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'start'): void
  (e: 'resume'): void
}>()

const hskLevelOptions: VocabHSKLevel[] = ['hsk1', 'all']

const orderOptions: QuizOrder[] = ['random', 'difficult']

const countOptions: VocabQuizCount[] = ['all', '5', '10', '15', '20', '30']

const setOption = (options: Partial<IVocabQuizOptions>) => {
  store.vocab.setQuizOptions(options)
}
</script>

<style lang="postcss">
@import '@theme/css/defines.postcss';

.vocab-options-modal {
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
.hsk-option,
.order-option {
  margin-top: 16px;
}
.option-text {
  max-width: 300px;
  padding-right: 24px;
  color: $text2;
}
.buttons {
  text-align: center;
  margin-top: 24px;
}
.resume {
  margin-left: 16px;
}
</style>
