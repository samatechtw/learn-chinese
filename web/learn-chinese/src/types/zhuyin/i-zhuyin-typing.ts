export type TypingOrder = 'random' | 'difficult'

export type ZhuyinTypingCount = 'all' | '10' | '25' | '50' | '100'

export interface IZhuyinTypingOptions {
  hideKeyboard: boolean
  order: TypingOrder
  count: ZhuyinTypingCount
  cheating: boolean
}
