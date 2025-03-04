<template>
  <div class="zhuyin-keyboard f-col">
    <div v-for="(row, index) in keyLayout" :class="`row row${index}`">
      <div
        v-for="key in row"
        :key="key"
        class="key-w"
        :class="{ pressed: keysDown.has(key), [`k${key}`]: true }"
        @mousedown="pressKey(key)"
        @mouseup="keysDown.delete(key)"
        @mouseleave="keysDown.delete(key)"
      >
        <div class="key">
          <div class="z">
            {{ key }}
          </div>
          <div v-if="zhuyinSymbols[key]" class="s">
            {{ zhuyinSymbols[key].s }}
          </div>
          <div v-if="showPinyin && zhuyinSymbols[key]" class="p">
            {{ zhuyinSymbols[key].p }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { KeyType } from '@frontend/types'
import { zhuyinSymbols } from '@frontend/util/zhuyin'
import { onMounted, onUnmounted, reactive, ref } from 'vue'

const emit = defineEmits<{
  (e: 'press', key: KeyType, event: KeyboardEvent | undefined): void
}>()
defineProps<{
  showPinyin?: boolean
}>()

const keyLayout: KeyType[][] = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-'],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
]

const keysDown = reactive(new Set())

const pressKey = (key: KeyType, event?: KeyboardEvent) => {
  keysDown.add(key)
  emit('press', key, event)
}

const handleKeydown = (event: KeyboardEvent) => {
  pressKey(event.key as KeyType, event)
}

const handleKeyup = (event: KeyboardEvent) => {
  keysDown.delete(event.key)
}

onMounted(() => {
  document.addEventListener('keyup', handleKeyup)
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keyup', handleKeyup)
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style lang="postcss" scoped>
@import '@theme/css/defines.postcss';

$keysize: 60px;
$marginH: 8px;

.zhuyin-keyboard {
  width: 100%;
  align-items: center;
}
.row {
  display: flex;
  position: relative;
}
.row0 {
  padding-left: $marginH;
}
.row1 {
  padding-left: calc($keysize * 0.5);
}
.row2 {
  padding-left: calc($keysize * 0.7);
}
.row3 {
  padding-left: calc($keysize * 1.2);
}
.key-w {
  @mixin size $keysize;
  border: 1px solid black;
  border-radius: 7px;
  box-shadow: -2px 2px 2px black;
  margin: 0 $marginH 8px 0;
  position: relative;
  background-color: #2d2d2d;
  user-select: none;
  cursor: pointer;
  &.pressed {
    background-color: #3d3d3d;
    box-shadow: -2px 2px 2px black;
    top: 1px;
    left: -1px;
  }
  &:hover {
    background-color: #353535;
  }
}
.key {
  @mixin size 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 7px;
  position: relative;
}
.s {
  @mixin title-regular 28px;
  color: #eeeae7;
}
.p {
  @mixin title-regular 16px;
  color: #fffdfa;
  position: absolute;
  left: 2px;
  bottom: -1px;
}
.z {
  @mixin text 16px;
  position: absolute;
  right: 4px;
  top: -1px;
  color: #c6def1;
}
$smallHeight: 68px;

@media (max-width: 760px) {
  .row {
    width: 100%;
  }
  .key-w {
    height: 68px;
    width: 10%;
  }
  .s {
    font-size: 24px;
  }
  .row0 {
    padding-left: $marginH;
  }
  .row1 {
    padding-left: $marginH;
  }
  .row2 {
    padding-left: $marginH;
  }
  .row3 {
    padding-left: $marginH;
  }
  .k- {
    position: absolute;
    top: calc(($smallHeight + 8px) * 4);
    right: 24%;
    width: 9%;
  }
}
@media (max-width: 500px) {
  .s {
    font-size: 20px;
  }
  .key-w {
    margin-right: 6px;
  }
}
</style>
