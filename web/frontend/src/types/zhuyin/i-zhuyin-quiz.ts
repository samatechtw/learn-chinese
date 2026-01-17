import { KeyType } from '../ui'
import { QuestionState } from './i-shared'

export type QuizOrder = 'random' | 'difficult'

export type ZhuyinQuizCount = 'all' | '5' | '10' | '15' | '20' | '30'

export interface IZhuyinQuizOptions {
  // If true, show zhuyin and type pinyin
  reverse: boolean
  hideKeyboard: boolean
  order: QuizOrder
  count: ZhuyinQuizCount
  cheating: boolean
}

export interface IZhuyinQuizState {
  index: number
  symbolKeys: KeyType[]
  incorrect: KeyType[]
  score: number
  quizStart: number
  quizEnd: number
  questionStart: number
  questionTime: number
  questionState: QuestionState
  cheated: boolean
  reviewing: boolean
}

export type IZhuyinQuizDifficulty = Partial<Record<KeyType, number>>
export type IZhuyinQuizHighScore = Partial<Record<ZhuyinQuizCount, number>>

export interface IZhuyinQuizRecord {
  highScore: IZhuyinQuizHighScore
  difficulty: IZhuyinQuizDifficulty
  plays: number
}
