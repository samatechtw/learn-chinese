<template>
  <div>
    <div class="question-wrap">
      <div class="question">
        {{ card.question }}
      </div>
      <Sound class="sound" @click="emit('sayCurrentChar')" />
    </div>
    <div class="hint-wrap f-col">
      <Transition name="fade" mode="out-in">
        <div v-if="store.typing.state.value?.showPinyin" class="pinyin">
          {{ card.pinyin }}
          <span class="pinyin-hide" @click="store.typing.showPinyin(false)">
            {{ ts('hide') }}
          </span>
        </div>
        <div v-else class="hint-buttons">
          <AppButton
            :text="ts('zhuyin.pinyin')"
            class="pinyin-button"
            @click="store.typing.showPinyin(true)"
          />
          <AppButton
            :text="ts('hint')"
            class="hint-button"
            @click="emit('showHint', !hint)"
          />
        </div>
      </Transition>
    </div>
    <div class="input-wrap">
      <STInput modelValue="" class="entry" @keydown.prevent />
      <div class="input-view overlay f-center">
        <div v-for="item in entry" class="char" :class="{ correct: item.correct }">
          {{ item.s }}
        </div>
        <div v-if="hint" class="char char-hint">
          {{ hint }}
        </div>
        <div v-if="!hint && entry.length === 0" class="placeholder">
          {{ ts('answer') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { STInput } from '@samatech/vue-components'
import { Sound } from '@frontend/components/svg'
import { ITypingQuestion, ITypingEntry } from '@frontend/types'
import { ts } from '../../../i18n'
import { AppButton } from '@frontend/components/widgets'
import { store } from '@frontend/store'

const { hint } = defineProps<{
  entry: ITypingEntry[]
  card: ITypingQuestion
  hint: string | undefined
}>()
const emit = defineEmits<{
  (e: 'sayCurrentChar'): void
  (e: 'keyPress', char: string): void
  (e: 'showHint', show: boolean): void
}>()

const showHint = ref(false)

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === ']') {
    emit('showHint', !hint)
  }
  emit('keyPress', event.key)
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
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
.input-wrap {
  position: relative;
  .entry {
    max-width: 280px;
    :deep(input) {
      caret-color: transparent;
      &:focus {
        background: rgba(255, 255, 255, 0.302);
      }
    }
  }
}
.placeholder {
  @mixin title-regular 32px;
  color: #6c7792;
}
.char {
  @mixin title-regular 30px;
  color: $incorrect;
  &.correct {
    color: $correct;
  }
}
.char-hint {
  color: $text3;
}
.input-view {
  pointer-events: none;
}
.input-wrap:focus-within .placeholder {
  display: none;
}
.hint-wrap {
  height: 54px;
  justify-content: center;
}
.pinyin-button {
  font-size: 13px;
  padding: 6px 16px 7px;
}
.hint-button {
  margin-left: 12px;
  font-size: 13px;
  padding: 6px 16px 7px;
}
.pinyin {
  @mixin title-regular 18px;
}
.pinyin-hide {
  @mixin title-regular 14px;
  color: $color2;
  margin-left: 12px;
  cursor: pointer;
}
</style>
