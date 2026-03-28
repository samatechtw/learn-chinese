<template>
  <div key="complete" class="card complete-card">
    <div class="big-icon">🎉</div>
    <div class="card-title">Lesson Complete!</div>
    <div class="score-display">
      <span class="score-num">{{ score }}</span>
      <span class="score-denom">/ {{ totalQuestions }}</span>
    </div>
    <div class="score-label">{{ scoreLabel }}</div>
    <button class="start-btn" @click="emit('restartLesson')">Restart Lesson</button>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  score: number
  totalQuestions: number
  scoreLabel: string
}>()

const emit = defineEmits<{
  (e: 'restartLesson'): void
}>()
</script>

<style lang="postcss" scoped>
@import './unit-style.postcss';
</style>
