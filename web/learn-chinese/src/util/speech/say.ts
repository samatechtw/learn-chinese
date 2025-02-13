export const say = (voices: SpeechSynthesisVoice[], voiceName: string, text: string) => {
  const synth = window.speechSynthesis
  const speech = new SpeechSynthesisUtterance(text)
  speech.voice = voices.find((v) => v.name === voiceName) || null
  synth.speak(speech)
}
