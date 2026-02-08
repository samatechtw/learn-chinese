<template>
  <div class="audio-control">
    <div class="audio-actions">
      <button
        class="play-button"
        type="button"
        :disabled="loading || !audioText"
        :aria-label="loading ? 'Loading audio' : 'Play audio'"
        @click="playAudio"
      >
        <span class="audio-icon">🔊</span>
        <span v-if="showLabel">{{ label }}</span>
      </button>
      <button
        class="download-button"
        type="button"
        :disabled="loading || !audioText"
        aria-label="Download audio"
        @click="downloadAudio"
      >
        <span class="download-icon">⬇</span>
      </button>
    </div>
    <div v-if="error" class="audio-error">
      {{ error }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { getVietnameseTtsAudio } from '@learn-vietnamese/util/tts'

interface Props {
  audioText?: string
  label?: string
  showLabel?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  audioText: '',
  label: 'Play Audio',
  showLabel: true,
})

const loading = ref(false)
const error = ref<string | null>(null)
const audioPlayer = ref<HTMLAudioElement | null>(null)

const safeFilenameBase = computed(() => {
  const raw = props.audioText.trim().toLowerCase()
  if (!raw) return 'vietnamese-audio'
  return raw.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'vietnamese-audio'
})

const getAudioPayload = async () => {
  const text = props.audioText.trim()
  if (!text) return null
  return getVietnameseTtsAudio(text)
}

const playAudio = async () => {
  loading.value = true
  error.value = null

  try {
    const payload = await getAudioPayload()
    if (!payload) return

    if (!audioPlayer.value) {
      audioPlayer.value = new Audio()
    }
    audioPlayer.value.src = payload.audioUrl
    await audioPlayer.value.play()
  } catch (err) {
    error.value = 'Audio unavailable. Try again.'
  } finally {
    loading.value = false
  }
}

const downloadAudio = async () => {
  loading.value = true
  error.value = null

  try {
    const payload = await getAudioPayload()
    if (!payload) return

    const filename = `${safeFilenameBase.value}.${payload.extension}`
    const link = document.createElement('a')
    link.download = filename

    if (payload.downloadUrl.startsWith('data:')) {
      link.href = payload.downloadUrl
      link.click()
      return
    }

    const response = await fetch(payload.downloadUrl)
    if (!response.ok) {
      throw new Error('Failed to download audio file')
    }
    const blob = await response.blob()
    const objectUrl = URL.createObjectURL(blob)
    try {
      link.href = objectUrl
      link.click()
    } finally {
      URL.revokeObjectURL(objectUrl)
    }
  } catch (err) {
    error.value = 'Download unavailable. Try again.'
  } finally {
    loading.value = false
  }
}

watch(
  () => props.audioText,
  () => {
    error.value = null
    loading.value = false
  },
)
</script>

<style lang="postcss" scoped>
@import '@theme/css/defines.postcss';

.audio-control {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.audio-actions {
  display: inline-flex;
  align-items: stretch;
  border-radius: 12px;
  border: 1px solid rgba(194, 65, 12, 0.2);
  background: rgba(255, 247, 237, 0.9);
  box-shadow: 0 8px 16px rgba(194, 65, 12, 0.12);
  overflow: hidden;
}

.play-button,
.download-button {
  @mixin title-regular 14px;
  border: none;
  background: transparent;
  color: #9a3412;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.play-button {
  gap: 8px;
  padding: 10px 14px;
}

.download-button {
  width: 36px;
  border-left: 1px solid rgba(194, 65, 12, 0.22);
}

.play-button:disabled,
.download-button:disabled {
  cursor: default;
  opacity: 0.6;
}

.play-button:hover:not(:disabled),
.download-button:hover:not(:disabled) {
  background: rgba(194, 65, 12, 0.1);
}

.audio-icon {
  font-size: 18px;
}

.download-icon {
  font-size: 14px;
}

.audio-error {
  @mixin text 13px;
  color: $incorrect;
}
</style>
