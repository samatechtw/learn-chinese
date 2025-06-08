export interface ICharacterInfo {
  p: string
  z: string
  audio?: string
}

export type ICharacterSet = Record<string, ICharacterInfo>
