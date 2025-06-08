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
      <STMultiselect
        :value="store.typing.typingOptions.value.count"
        class="table-select"
        :options="hskCounts"
        :clearable="false"
        @select="setOption({ count: $event })"
        @click.stop
      />
    </div>
    <div class="character-sets option-wrap">
      <div class="option-text">
        {{ ts('char.sets') }}
      </div>
      <STMultiselect
        :value="store.typing.sets.value[0]"
        class="table-select"
        :options="Object.keys(characterSets)"
        :clearable="false"
        @select="setOption({ sets: [($event ?? 'hsk1') as ICharacterSetName] })"
        @click.stop
      />
    </div>
    <div class="reverse-option option-wrap">
      <div class="option-text">
        {{ ts(`zhuyin.${store.typing.typingOptions.value.order}`) }}
      </div>
      <STMultiselect
        :value="store.typing.typingOptions.value.order"
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
        v-if="store.zhuyin.quiz.value"
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
import { IZhuyinTypingOptions, QuizOrder, ZhuyinTypingCount } from '@frontend/types'
import { ts } from '../../i18n'
import { characterSets, ICharacterSetName } from '@frontend/util/characters'

defineProps<{
  show: boolean
}>()
const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'start'): void
  (e: 'resume'): void
}>()

const orderOptions: QuizOrder[] = ['random', 'difficult']

const hskCounts: ZhuyinTypingCount[] = ['all', '10', '25', '50', '100']

const setOption = (options: Partial<IZhuyinTypingOptions>) => {
  store.typing.setTypingOptions(options)
}
</script>

<style lang="postcss">
@import '@theme/css/defines.postcss';

.zhuyin-typing-modal {
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
