import { store } from '@frontend/store'
import { populateVoices } from './get-voices'

export const say = (voices: SpeechSynthesisVoice[], voiceName: string, text: string) => {
  const synth = window.speechSynthesis
  const speech = new SpeechSynthesisUtterance(text)
  speech.voice = voices.find((v) => v.name === voiceName) || null
  synth.speak(speech)
}

export const saySymbol = (s: string) => {
  if (!store.misc.playAudio.value) {
    return
  }
  const voices = populateVoices()
  if (!voices) {
    return
  }
  const voice = store.misc.voiceName.value
  say(voices, voice ?? voices[0].name, s)
}
