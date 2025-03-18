<template>
  <div>
    <div class="question-wrap">
      <div class="question">
        {{ card.question }}
      </div>
      <Sound class="sound" @click="emit('sayCurrentSymbol')" />
    </div>
    <STInput
      :modelValue="symbol"
      :placeholder="ts('answer')"
      class="entry"
      @update:modelValue="emit('setAnswer', $event)"
    />
  </div>
</template>

<script lang="ts" setup>
import { STInput } from '@samatech/vue-components'
import { Sound } from '@frontend/components/svg'
import { IZhuyinQuizQuestion, IZhuyinSymbol } from '@frontend/types'
import { ts } from '../../../i18n'

defineProps<{
  symbol: IZhuyinSymbol | undefined
  card: IZhuyinQuizQuestion
}>()
const emit = defineEmits<{
  (e: 'sayCurrentSymbol'): void
  (e: 'setAnswer', char: string): void
}>()
</script>

<style lang="postcss" scoped>
@import '@theme/css/defines.postcss';

.question-wrap {
  display: flex;
  align-items: center;
}
.question {
  @mixin title 48px;
}
.sound {
  @mixin size 26px;
  margin-left: 24px;
  cursor: pointer;
  margin-top: 8px;
}
</style>
