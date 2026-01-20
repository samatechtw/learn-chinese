import { store } from '@frontend/store'
import { populateVoices } from './get-voices'

export const say = (voices: SpeechSynthesisVoice[], voiceName: string, text: string) => {
  const synth = window.speechSynthesis
  const speech = new SpeechSynthesisUtterance(text)
  speech.lang = 'zh-TW'
  speech.voice = voices.find((v) => v.name === voiceName) || null
  synth.speak(speech)
}

export const saySymbol = async (s: string) => {
  if (!store.misc.playAudio.value) {
    return
  }
  const voices = await populateVoices()
  if (!voices?.[0]) {
    return
  }
  const voice = store.misc.voiceName.value
  say(voices, voice ?? voices[0].name, s)
}
