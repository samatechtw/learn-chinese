<template>
  <div key="init" class="card init-card">
    <div class="big-icon">{{ unit.icon }}</div>
    <div class="card-title">{{ unit.title }}</div>
    <div class="card-subtitle">{{ unit.titleChinese }}</div>
    <div class="card-desc">{{ unit.description }}</div>

    <div class="type-config">
      <div class="type-config-label">Question Types</div>
      <div class="type-config-sublabel">(click to toggle)</div>
      <div class="type-toggles">
        <button
          v-for="t in allTypes"
          :key="t.value"
          :class="['type-toggle', { active: selectedTypes.includes(t.value) }]"
          @click.stop="toggleType(t.value)"
        >
          {{ t.label }}
        </button>
      </div>
    </div>

    <button
      class="start-btn"
      :disabled="selectedTypes.length === 0"
      @click="emit('startLesson', selectedTypes)"
    >
      Start Lesson
    </button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { IUnit, UnitQuestionType } from '@learn-chinese/types'

defineProps<{
  unit: IUnit
}>()

const emit = defineEmits<{
  (e: 'startLesson', types: UnitQuestionType[]): void
}>()

const allTypes: { value: UnitQuestionType; label: string }[] = [
  { value: 'TranslatePhrase', label: 'Translate' },
  { value: 'FillInBlank', label: 'Fill Blank' },
  { value: 'OrderCharacters', label: 'Order Words' },
  { value: 'ListenSelect', label: 'Listen' },
]

const selectedTypes = ref<UnitQuestionType[]>(allTypes.map((t) => t.value))

const toggleType = (type: UnitQuestionType) => {
  const idx = selectedTypes.value.indexOf(type)
  if (idx === -1) {
    selectedTypes.value.push(type)
  } else {
    selectedTypes.value.splice(idx, 1)
  }
}
</script>

<style lang="postcss" scoped>
@import './unit-style.postcss';
</style>
