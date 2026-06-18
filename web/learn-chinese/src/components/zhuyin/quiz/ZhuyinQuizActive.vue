<template>
  <div>
    <div class="question-wrap">
      <div class="question">
        {{ card.question }}
      </div>
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
import { ICardQuestion } from '@frontend/types'
import { IZhuyinSymbol } from '@learn-chinese/types'
import { ts } from '@frontend/i18n'

defineProps<{
  symbol: IZhuyinSymbol | undefined
  card: ICardQuestion
}>()
const emit = defineEmits<{
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
.entry {
  margin-top: 24px;
}
</style>
