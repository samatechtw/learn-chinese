<template>
  <div class="correct">
    <div class="card-title">
      {{ `${ts('correct')} (${questionTime}s)` }}
    </div>
    <div class="card-text">
      {{ ts('continue') }}
    </div>
    <STInput :modelValue="symbol" class="entry" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { STInput } from '@samatech/vue-components'
import { store } from '@frontend/store'
import { roundTime } from '@frontend/util/misc'
import { IZhuyinSymbol } from '@frontend/types'
import { ts } from '../../../i18n'

defineProps<{
  symbol: IZhuyinSymbol
}>()

const questionTime = computed(() => {
  const count = store.zhuyin.quiz.value?.questionTime ?? 0
  return roundTime(count)
})
</script>

<style lang="postcss" scoped>
@import '@theme/css/defines.postcss';

.correct .entry {
  :deep(input) {
    background-color: $green1;
    border-color: $green2;
  }
}
</style>
