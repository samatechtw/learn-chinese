export type QuestionState = 'init' | 'correct' | 'incorrect' | 'active' | 'complete'

export interface ITypingEntry {
  s: string
  correct: boolean
}

// View of current active question
export interface ICardQuestion {
  question: string
  answer: string
  audio: string | undefined
}
