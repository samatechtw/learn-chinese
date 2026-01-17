import { ICharacterSetName } from '@frontend/util/characters'
import { ICardQuestion, QuestionState } from './i-shared'

export type TypingOrder = 'random' | 'difficult'

export type ZhuyinTypingCount = 'all' | '10' | '25' | '50' | '100'

export type ZhuyinTypingHint = 'never' | 'always' | number

export interface ITypingQuestion extends ICardQuestion {
  pinyin: string
}

export interface IZhuyinTypingOptions {
  hideKeyboard: boolean
  sets: ICharacterSetName[]
  order: TypingOrder
  count: ZhuyinTypingCount
  hint: ZhuyinTypingHint
  showPinyin: boolean
  cheating: boolean
}

export interface IZhuyinTypingState {
  index: number
  characters: string[]
  incorrect: string[]
  score: number
  start: number
  end: number
  questionStart: number
  questionTime: number
  questionState: QuestionState
  questionMistakes: number
  showPinyin: boolean
  cheated: number
  reviewing: boolean
}

export type IZhuyinTypingDifficulty = Partial<Record<string, number>>
export type IZhuyinTypingHighScore = Partial<Record<ZhuyinTypingCount, number>>

export interface IZhuyinTypingRecord {
  highScore: IZhuyinTypingHighScore
  difficulty: IZhuyinTypingDifficulty
  plays: number
}
