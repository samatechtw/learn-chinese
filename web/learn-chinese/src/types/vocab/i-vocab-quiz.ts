import { QuestionState } from '@frontend/types'

export type VocabHSKLevel = 'hsk1' | 'all'

export type VocabQuizCount = 'all' | '5' | '10' | '15' | '20' | '30'

export type VocabQuizOrder = 'random' | 'difficult'

export type VocabQuestionType =
  | 'EnglishToChinese'
  | 'ChineseToPinyin'
  | 'ChineseToEnglish'

export interface IVocabQuizOptions {
  hskLevel: VocabHSKLevel
  count: VocabQuizCount
  order: VocabQuizOrder
  cheating: boolean
}

export interface IVocabQuizQuestion {
  characterId: string
  questionType: VocabQuestionType
  correctAnswer: string
  wrongGuess?: string
}

export interface IVocabQuizState {
  index: number
  characterIds: string[]
  questions: IVocabQuizQuestion[]
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
