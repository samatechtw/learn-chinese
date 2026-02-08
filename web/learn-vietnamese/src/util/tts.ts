import { apiGetVietnameseTts } from '@learn-vietnamese/api/tts'

export interface IVietnameseTtsAudio {
  audioUrl: string
  downloadUrl: string
  mimeType: string
  extension: string
}

const ttsCache = new Map<string, IVietnameseTtsAudio>()

const getAudioExtension = (mimeType: string): string => {
  if (mimeType.includes('wav')) return 'wav'
  if (mimeType.includes('mpeg') || mimeType.includes('mp3')) return 'mp3'
  return 'wav'
}

const parseDataUrlMimeType = (dataUrl: string): string => {
  const match = dataUrl.match(/^data:([^;,]+)[;,]/i)
  return match?.[1]?.toLowerCase() ?? 'audio/wav'
}

export const getVietnameseTtsAudio = async (query: string): Promise<IVietnameseTtsAudio> => {
  const key = query.trim()
  if (!key) {
    throw new Error('TTS query is empty')
  }

  const cached = ttsCache.get(key)
  if (cached) {
    return cached
  }

  const response = await apiGetVietnameseTts(key)
  const audioPayload = response.url
    ? {
        audioUrl: response.url,
        downloadUrl: response.url,
        mimeType: 'audio/wav',
        extension: 'wav',
      }
    : response.audio_base64
      ? response.audio_base64.startsWith('data:')
        ? {
            audioUrl: response.audio_base64,
            downloadUrl: response.audio_base64,
            mimeType: parseDataUrlMimeType(response.audio_base64),
            extension: getAudioExtension(parseDataUrlMimeType(response.audio_base64)),
          }
        : {
            audioUrl: `data:audio/wav;base64,${response.audio_base64}`,
            downloadUrl: `data:audio/wav;base64,${response.audio_base64}`,
            mimeType: 'audio/wav',
            extension: 'wav',
          }
      : null

  if (!audioPayload) {
    throw new Error('No audio payload returned from TTS')
  }

  ttsCache.set(key, audioPayload)
  return audioPayload
}

export const getVietnameseTtsAudioUrl = async (query: string): Promise<string> => {
  const payload = await getVietnameseTtsAudio(query)
  return payload.audioUrl
}
