import { store } from '@frontend/store'
import { playChineseTts } from './tts'

export const sayChineseText = async (text: string) => {
  if (!store.misc.playAudio.value || !text.trim()) {
    return
  }
  try {
    await playChineseTts(text)
  } catch (e) {
    console.warn('Chinese TTS failed', e)
  }
}

export const playChineseAudio = async (text: string) => {
  if (!text.trim()) {
    return
  }
  try {
    await playChineseTts(text)
  } catch (e) {
    console.warn('Chinese TTS failed', e)
  }
}
