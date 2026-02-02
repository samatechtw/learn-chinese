import { QuestionState } from '@frontend/types'

export type VietnameseQuizCount = 'all' | '5' | '10' | '15' | '20' | '30'

export type VietnameseQuizOrder = 'random' | 'difficult'

export type VietnameseQuestionType = 'EnglishToVietnamese' | 'VietnameseToEnglish'

export type VietnameseQuizMode = VietnameseQuestionType | 'Mixed'

export interface IVietnameseQuizOptions {
  count: VietnameseQuizCount
  order: VietnameseQuizOrder
  cheating: boolean
}

export interface IVietnameseQuizQuestion {
  wordId: string
  questionType: VietnameseQuestionType
  correctAnswer: string
  wrongGuess?: string
}

export interface IVietnameseQuizState {
  index: number
  wordIds: string[]
  questions: IVietnameseQuizQuestion[]
  score: number
  quizStart: number
  quizEnd: number
  questionStart: number
  questionTime: number
  questionState: QuestionState
  cheated: boolean
  reviewing: boolean
}

export type IVietnameseQuizDifficulty = Partial<Record<string, number>>
export type IVietnameseQuizHighScore = Partial<Record<VietnameseQuizCount, number>>

export interface IVietnameseQuizRecord {
  highScore: IVietnameseQuizHighScore
  difficulty: IVietnameseQuizDifficulty
  plays: number
}
