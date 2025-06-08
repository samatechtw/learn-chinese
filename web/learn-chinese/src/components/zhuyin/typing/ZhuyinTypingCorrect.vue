<template>
  <div class="correct">
    <div class="card-title">
      {{ `${ts('correct')} (${questionTime}s)` }}
    </div>
    <div class="card-text">
      {{ ts('continue') }}
    </div>
    <div class="question">
      {{ card.question }}
    </div>
    <div class="entry">
      <div class="text">
        {{ entry }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { store } from '@frontend/store'
import { roundTime } from '@frontend/util/misc'
import { ITypingQuestion } from '@frontend/types'
import { ts } from '../../../i18n'

defineProps<{
  entry: string
  card: ITypingQuestion
}>()

const questionTime = computed(() => {
  const count = store.typing.state.value?.questionTime ?? 0
  return roundTime(count)
})
</script>

<style lang="postcss" scoped>
@import '@theme/css/defines.postcss';

.question {
  @mixin title 30px;
  margin-top: 12px;
}
.entry {
  margin-top: 8px;
  max-width: unset;
}

.text {
  background-color: $green1;
  border-color: $green2;
  height: 48px;
  font-size: 26px;
}
</style>
