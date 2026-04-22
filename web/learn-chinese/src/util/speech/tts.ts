import { apiGetChineseTts } from '@learn-chinese/api/tts'

const ttsCache = new Map<string, string>()

const toAudioUrl = async (query: string): Promise<string> => {
  const trimmed = query.trim()
  if (!trimmed) {
    throw new Error('TTS query is empty')
  }

  const cached = ttsCache.get(trimmed)
  if (cached) {
    return cached
  }

  const response = await apiGetChineseTts(trimmed)
  const audioUrl = response.url ?? response.audio_base64 ?? null

  if (!audioUrl) {
    throw new Error('No audio payload returned from TTS')
  }

  ttsCache.set(trimmed, audioUrl)
  return audioUrl
}

export const playChineseTts = async (query: string): Promise<void> => {
  const audioUrl = await toAudioUrl(query)
  const audio = new Audio(audioUrl)
  audio.preload = 'auto'

  await new Promise<void>((resolve, reject) => {
    audio.onended = () => resolve()
    audio.onerror = () => reject(new Error('Chinese TTS audio playback failed'))
    audio.play().catch(reject)
  })
}
