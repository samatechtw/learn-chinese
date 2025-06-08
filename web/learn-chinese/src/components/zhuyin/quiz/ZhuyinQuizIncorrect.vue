<template>
  <div class="incorrect">
    <div class="card-title">
      {{ ts('incorrect') }}
    </div>
    <div class="card-text">
      {{ ts('continue_correct') }}
    </div>
    <div class="incorrect-inputs">
      <div class="entry-item guess">
        <div>{{ entry?.p }}</div>
        <div>{{ entry?.s }}</div>
      </div>
      <div
        class="entry-item correct"
        :class="{ reverse: store.zhuyin.quizOptions.value.reverse }"
      >
        <div>{{ card.answer }}</div>
        <div>{{ card.question }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { IZhuyinKeyInfo, ICardQuestion } from '@frontend/types'
import { ts } from '../../../i18n'
import { store } from '@frontend/store'

defineProps<{
  entry: IZhuyinKeyInfo | undefined
  card: ICardQuestion
}>()
</script>

<style lang="postcss" scoped>
@import '@theme/css/defines.postcss';

.incorrect .entry {
  max-width: 60px;
}
.correct {
  width: 100px;
  margin-left: 16px;
  background-color: $green1;
  border: 1px solid $green2;
  flex-direction: column-reverse;
  &.reverse {
    flex-direction: column;
  }
}
.guess {
  width: 60px;
  background-color: $color-error-bg;
  border: 1px solid $color-error;
}
.incorrect-inputs {
  display: flex;
}
</style>
