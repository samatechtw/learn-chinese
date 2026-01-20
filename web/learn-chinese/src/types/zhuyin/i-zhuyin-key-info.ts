import { IZhuyinSymbol } from './i-zhuyin-symbols'

export interface IZhuyinKeyInfo {
  s: IZhuyinSymbol
  p: string // Pinyin
  audio?: string
}
