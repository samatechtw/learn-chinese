import { apiGetVietnameseTts } from '@learn-vietnamese/api/tts'

const ttsCache = new Map<string, string>()

export const getVietnameseTtsAudioUrl = async (query: string): Promise<string> => {
  const key = query.trim()
  if (!key) {
    throw new Error('TTS query is empty')
  }

  const cached = ttsCache.get(key)
  if (cached) {
    return cached
  }

  const response = await apiGetVietnameseTts(key)
  const audioUrl = response.url
    ? response.url
    : response.audio_base64
      ? response.audio_base64.startsWith('data:')
        ? response.audio_base64
        : `data:audio/mpeg;base64,${response.audio_base64}`
      : null

  if (!audioUrl) {
    throw new Error('No audio payload returned from TTS')
  }

  ttsCache.set(key, audioUrl)
  return audioUrl
}
