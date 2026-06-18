import { InjectionKey } from 'vue'

// Provided by the Phrases tool so any nested phrase character can open the
// shared dictionary modal for itself without prop drilling.
export const DictionaryKey: InjectionKey<(word: string) => void> =
  Symbol('phrase-dictionary')
