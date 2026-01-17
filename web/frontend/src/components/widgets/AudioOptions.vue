<template>
  <div class="audio-options">
    <Checkbox
      :item="{ label: ts('play'), checked: store.misc.playAudio.value }"
      @checked="store.misc.setPlayAudio($event)"
    />
    <STMultiselect
      v-if="!hideVoice"
      :value="store.misc.voiceName.value"
      class="voice-selsect"
      :placeholder="ts('select_voice')"
      :options="voices.map((v) => v.name)"
      :clearable="false"
      @select="store.misc.setVoice($event)"
      @click.stop
    />
  </div>
</template>

<script lang="ts" setup>
import { STMultiselect } from '@samatech/vue-components'
import { voices } from '@frontend/util/speech'
import { store } from '@frontend/store'
import { ts } from '../../i18n'
import Checkbox from './Checkbox.vue'

defineProps<{
  hideVoice?: boolean
}>()
</script>

<style lang="postcss" scoped>
@import '@theme/css/defines.postcss';

.audio-options {
  display: flex;
}
.voice-select {
  margin-left: 16px;
}
</style>
