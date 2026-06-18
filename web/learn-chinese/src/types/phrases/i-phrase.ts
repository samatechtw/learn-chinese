export interface IPhrase {
  // Traditional (Taiwanese) Mandarin text
  zh: string
  // English translation / meaning
  en: string
  // Pinyin with tone marks
  pinyin: string
}

export interface IPhraseSection {
  // Stable id, used for collapse state
  id: string
  // Section heading (English)
  title: string
  phrases: IPhrase[]
}
