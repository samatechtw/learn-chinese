import { ref } from 'vue'

export const voices = ref<SpeechSynthesisVoice[]>([])

export const populateVoices = () => {
  if (!voices.value.length) {
    voices.value = getVoices()
  }
  return voices.value
}

export const getVoices = (): SpeechSynthesisVoice[] => {
  const synth = window.speechSynthesis
  return synth.getVoices().filter((v) => v.lang === 'zh-CN' || v.lang === 'zh-TW')
}
