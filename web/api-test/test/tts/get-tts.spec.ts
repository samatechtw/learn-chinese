import { testagent, TestAgent, userAuthHeader } from '../helpers'
import { testConfig } from '../test.config'
import { describe, test, beforeAll, expect } from 'vitest'

describe('TTS endpoint', () => {
  let api: TestAgent
  let userAuth: string
  const userId = '2213d9fc-3693-47ed-a495-cd5e7fc6dd0e'

  beforeAll(() => {
    api = testagent(testConfig.get('apiUrl'))
    userAuth = userAuthHeader(userId)
  })

  test('returns 400 for invalid language', async () => {
    const response = await api
      .get('/api/tts/invalid?query=hello')
      .set('Authorization', userAuth)
    expect(response.status).toBe(400)
  })

  test('returns 400 for empty query', async () => {
    const response = await api
      .get('/api/tts/chinese?query=')
      .set('Authorization', userAuth)
    expect(response.status).toBe(400)
  })

  test('returns 400 for missing query', async () => {
    const response = await api.get('/api/tts/chinese').set('Authorization', userAuth)
    expect(response.status).toBe(400)
  })

  test('returns TTS response for chinese language', async () => {
    const response = await api
      .get('/api/tts/chinese?query=你好')
      .set('Authorization', userAuth)
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('cached')
    expect(response.body).toHaveProperty('cache_key')
    // Response will have either 'url' (cache hit) or 'audio_base64' (cache miss/dev mode)
    expect(
      response.body.url !== undefined || response.body.audio_base64 !== undefined,
    ).toBe(true)
  })

  test('returns TTS response for vietnamese language', async () => {
    const response = await api
      .get('/api/tts/vietnamese?query=xin chào')
      .set('Authorization', userAuth)
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('cached')
    expect(response.body).toHaveProperty('cache_key')
  })

  test('accepts optional voice parameter', async () => {
    const response = await api
      .get('/api/tts/chinese?query=你好&voice=zh-CN-YunxiNeural')
      .set('Authorization', userAuth)
    expect(response.status).toBe(200)
  })

  test('returns 400 for invalid voice', async () => {
    const response = await api
      .get('/api/tts/chinese?query=你好&voice=vi-VN-HoaiMyNeural')
      .set('Authorization', userAuth)
    expect(response.status).toBe(400)
  })

  test('accepts optional rate parameter', async () => {
    const response = await api
      .get('/api/tts/chinese?query=你好&rate=0.8')
      .set('Authorization', userAuth)
    expect(response.status).toBe(200)
  })

  test('returns 400 for invalid rate', async () => {
    const response = await api
      .get('/api/tts/chinese?query=你好&rate=fastest')
      .set('Authorization', userAuth)
    expect(response.status).toBe(400)
  })
})
