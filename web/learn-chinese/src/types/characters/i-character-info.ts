export interface ICharacterInfo {
  p: string
  z: string
  e?: string
  audio?: string
}

export type ICharacterSet = Record<string, ICharacterInfo>
