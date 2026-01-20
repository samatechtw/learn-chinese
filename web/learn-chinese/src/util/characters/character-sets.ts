import { ICharacterSet } from '@learn-chinese/types'
import { hsk1 } from './hsk1'

export type ICharacterSetName = 'hsk1'

export const characterSets: Record<ICharacterSetName, ICharacterSet> = {
  hsk1,
}
