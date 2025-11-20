import { QuestionState } from '../zhuyin/i-shared'

export type VocabHSKLevel = 'hsk1' | 'all'

export type VocabQuizCount = 'all' | '5' | '10' | '15' | '20' | '30'

export type QuizOrder = 'random' | 'difficult'

export interface IVocabQuizOptions {
  hskLevel: VocabHSKLevel
  count: VocabQuizCount
  order: QuizOrder
  cheating: boolean
}

export interface IVocabQuizState {
  index: number
  characterIds: string[]
  incorrect: string[]
  score: number
  quizStart: number
  quizEnd: number
  questionStart: number
  questionTime: number
  questionState: QuestionState
  cheated: boolean
  reviewing: boolean
}

export type IVocabQuizDifficulty = Partial<Record<string, number>>
export type IVocabQuizHighScore = Partial<Record<VocabQuizCount, number>>

export interface IVocabQuizRecord {
  highScore: IVocabQuizHighScore
  difficulty: IVocabQuizDifficulty
  plays: number
}
