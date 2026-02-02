import { rootApi } from '@frontend/api'

export interface ITtsResponse {
  cached: boolean
  cache_key: string
  url?: string
  audio_base64?: string
}

export const apiGetVietnameseTts = async (query: string): Promise<ITtsResponse> => {
  if (!query.trim()) {
    throw new Error('TTS query is empty')
  }

  const { data } = await rootApi.authOptRequest<ITtsResponse>({
    url: `tts/vietnamese?query=${encodeURIComponent(query)}`,
    method: 'GET',
  })

  return data as ITtsResponse
}
