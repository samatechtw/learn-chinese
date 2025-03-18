import { ref } from 'vue'

export const voices = ref<SpeechSynthesisVoice[]>([])

export const populateVoices = async () => {
  if (!voices.value.length) {
    voices.value = await getVoices()
  }
  return voices.value
}

export const getVoices = (): Promise<SpeechSynthesisVoice[]> => {
  const synth = window.speechSynthesis
  const filtered = (): SpeechSynthesisVoice[] => {
    return synth.getVoices().filter((v) => v.lang === 'zh-CN' || v.lang === 'zh-TW')
  }
  const voices = filtered()
  return new Promise((resolve) => {
    if (voices.length) {
      return resolve(voices)
    } else {
      let timeout: ReturnType<typeof setTimeout> | undefined = setTimeout(() => {
        timeout = undefined
        resolve(filtered())
      }, 2000)
      synth.onvoiceschanged = () => {
        if (timeout) {
          clearTimeout(timeout)
        }
        resolve(filtered())
      }
    }
  })
}
