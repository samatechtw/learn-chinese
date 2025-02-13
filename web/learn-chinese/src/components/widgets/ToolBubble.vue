<template>
  <component
    :is="tool.to ? 'router-link' : 'div'"
    class="tool-bubble f-col"
    :key="tool.title"
    :to="tool.to ? { name: tool.to } : undefined"
    :class="{ isDisabled: tool.disabled }"
    @click="click"
  >
    <div class="tool-title">
      {{ ts(tool.title) }}
    </div>
    <div class="tool-text">
      {{ ts(tool.text) }}
    </div>
    <div v-if="tool.disabled" class="coming-soon">
      {{ ts('home.coming_soon') }}
    </div>
  </component>
</template>

<script lang="ts" setup>
import { IToolBubble } from '@frontend/types'
import { ts } from '../../i18n'

const { tool } = defineProps<{
  tool: IToolBubble
}>()

const emit = defineEmits<{
  (e: 'click', tool: IToolBubble): void
}>()

const click = () => {
  emit('click', tool)
}
</script>

<style lang="postcss" scoped>
@import '@theme/css/defines.postcss';

.tool-bubble {
  align-items: center;
  text-align: center;
  position: relative;
  width: 220px;
  border: 1px solid black;
  border-radius: 16px;
  padding: 28px 24px;
  transition: all 0.25s ease;
  transform: scale(1);
  &.isDisabled {
    pointer-events: none;
    color: rgba($color2, 0.4);
    border-color: rgba(0, 0, 0, 0.4);
  }
  &:hover:not(.isDisabled) {
    border-color: $color3;
    background: rgba(255, 255, 255, 0.15);
  }
}
.coming-soon {
  @mixin title-regular 14px;
  color: $color2;
  position: absolute;
  right: 12px;
  bottom: 4px;
}
.tool-title {
  @mixin title 20px;
}
.tool-text {
  @mixin text 17px;
  margin-top: 12px;
}
</style>
