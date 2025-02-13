import { IBasicCardStats, IZhuyinQuizOptions } from '@frontend/types'
import { LocalStoragePlugin, useModule } from '@samatech/vue-store'

export interface IZhuyinState {
  cardStats: Record<string, IBasicCardStats>
  quizOptions: IZhuyinQuizOptions
}

const getters = (_state: IZhuyinState) => ({})

const mutations = (state: IZhuyinState) => ({
  setStats(id: string, stats: IBasicCardStats) {
    state.cardStats[id] = stats
  },
  setOptions(options: Partial<IZhuyinQuizOptions>) {
    state.quizOptions = { ...state.quizOptions, ...options }
  },
})

export const zhuyinModule = useModule<
  IZhuyinState,
  ReturnType<typeof getters>,
  ReturnType<typeof mutations>
>({
  name: 'zhuyin-store',
  version: 3,
  stateInit: () => ({
    cardStats: {},
    quizOptions: {
      reverse: false,
      order: 'random',
    },
  }),
  getters,
  mutations,
  plugins: [LocalStoragePlugin],
})
