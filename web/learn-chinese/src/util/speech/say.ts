import { store } from '@frontend/store'
import { populateVoices } from './get-voices'
import { playChineseTts } from './tts'

export const say = (
  voices: SpeechSynthesisVoice[],
  voiceName: string,
  text: string,
): Promise<void> => {
  const synth = window.speechSynthesis
  const speech = new SpeechSynthesisUtterance(text)
  speech.lang = 'zh-TW'
  speech.voice = voices.find((v) => v.name === voiceName) || null
  synth.cancel()

  return new Promise((resolve) => {
    speech.onend = () => resolve()
    speech.onerror = () => resolve()
    synth.speak(speech)
  })
}

const sayWithBrowserSpeech = async (text: string) => {
  const voices = await populateVoices()
  if (!voices?.[0]) {
    return
  }
  const voice = store.misc.voiceName.value
  await say(voices, voice ?? voices[0].name, text)
}

export const sayChineseText = async (text: string) => {
  if (!store.misc.playAudio.value || !text.trim()) {
    return
  }

  try {
    await playChineseTts(text)
  } catch {
    await sayWithBrowserSpeech(text)
  }
}

export const saySymbol = async (s: string) => {
  if (!store.misc.playAudio.value) {
    return
  }
  await sayWithBrowserSpeech(s)
}
