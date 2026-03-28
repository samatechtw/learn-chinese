export { restaurantUnit } from './restaurant'
export { travelUnit } from './travel'
export { buildUnitQuestions } from './build-questions'

import { restaurantUnit } from './restaurant'
import { travelUnit } from './travel'
import { IUnit } from '@learn-chinese/types'

export const allUnits: IUnit[] = [restaurantUnit, travelUnit]

export const getUnit = (id: string): IUnit | undefined => allUnits.find((u) => u.id === id)
