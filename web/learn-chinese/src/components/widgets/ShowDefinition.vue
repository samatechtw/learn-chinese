<template>
  <div class="show-definition">
    <Definition class="definition-icon" @click="showDefinition" />
    <DefinitionModal :show="show" :loading="true" @cancel="show = false" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Definition } from '../svg'
import DefinitionModal from './DefinitionModal.vue'
import { ICharacterInfo } from '@frontend/types'

const { info } = defineProps<{
  info: ICharacterInfo
}>()

const show = ref(false)
const loading = ref(false)

const showDefinition = () => {
  show.value = true
  loading.value = true
}
</script>

<style lang="postcss" scoped>
@import '@theme/css/defines.postcss';

.show-definition {
  @mixin size 28px;
}
.definition-icon {
  @mixin size 30px;
  cursor: pointer;

  :deep(path) {
    transition: fill 0.2s ease;
  }
  &:hover :deep(path) {
    fill: #333;
  }
}
</style>
