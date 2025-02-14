import { IBasicCardStats, IZhuyinQuizOptions } from '@frontend/types'
import { LocalStoragePlugin, useModule } from '@samatech/vue-store'

export interface IZhuyinState {
  cardStats: Record<string, IBasicCardStats>
  quizOptions: IZhuyinQuizOptions
  showPinyin: boolean
}

const getters = (_state: IZhuyinState) => ({})

const mutations = (state: IZhuyinState) => ({
  setStats(id: string, stats: IBasicCardStats) {
    state.cardStats[id] = stats
  },
  setOptions(options: Partial<IZhuyinQuizOptions>) {
    state.quizOptions = { ...state.quizOptions, ...options }
  },
  setPinyin(show: boolean) {
    state.showPinyin = show
  },
})

export const zhuyinModule = useModule<
  IZhuyinState,
  ReturnType<typeof getters>,
  ReturnType<typeof mutations>
>({
  name: 'zhuyin-store',
  version: 4,
  stateInit: () => ({
    cardStats: {},
    quizOptions: {
      reverse: false,
      order: 'random',
    },
    showPinyin: false,
  }),
  getters,
  mutations,
  plugins: [LocalStoragePlugin],
})
