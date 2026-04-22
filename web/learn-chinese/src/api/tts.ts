import { rootApi } from '@frontend/api'

export interface IChineseTtsResponse {
  cached: boolean
  cache_key: string
  url?: string
  audio_base64?: string
}

export const apiGetChineseTts = async (query: string): Promise<IChineseTtsResponse> => {
  const trimmed = query.trim()
  if (!trimmed) {
    throw new Error('TTS query is empty')
  }

  const { data } = await rootApi.authOptRequest<IChineseTtsResponse>({
    url: `tts/chinese?query=${encodeURIComponent(trimmed)}`,
    method: 'GET',
  })

  return data as IChineseTtsResponse
}
