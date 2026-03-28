export type UnitQuestionType = 'FillInBlank' | 'TranslatePhrase' | 'OrderCharacters' | 'ListenSelect'

export interface IUnitPhrase {
  id: string
  chinese: string
  pinyin: string
  english: string
}

export interface IUnitSentence {
  id: string
  template: string // sentence with ___ as blank marker
  answer: string // the correct word for the blank
  english: string // full English translation
  distractors: string[] // wrong fill-in options
}

export interface IUnitOrderPhrase {
  id: string
  words: string[] // correct order
  english: string
  distractors: string[] // extra decoy words in bank
}

export interface IUnitQuestion {
  id: string
  type: UnitQuestionType
  phraseId: string
  // display
  displayText?: string // text to show (Chinese or English depending on type)
  // answer
  correctAnswer: string
  options?: string[] // for TranslatePhrase, FillInBlank, ListenSelect
  // FillInBlank
  template?: string // sentence with ___ placeholder
  // OrderCharacters
  wordBank?: string[] // all words (correct + distractors), shuffled
  // audio
  audioText?: string
  skippable?: boolean
}

export interface IUnit {
  id: string
  title: string
  titleChinese: string
  description: string
  icon: string
  color: string
  phrases: IUnitPhrase[]
  sentences: IUnitSentence[]
  orderPhrases: IUnitOrderPhrase[]
}
