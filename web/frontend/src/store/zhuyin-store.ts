import {
  IBasicCardStats,
  IZhuyinQuizDifficulty,
  IZhuyinQuizHighScore,
  IZhuyinQuizOptions,
  IZhuyinQuizRecord,
  IZhuyinQuizState,
  KeyType,
} from '@frontend/types'
import { zhuyinSymbols } from '@frontend/util/zhuyin'
import { LocalStoragePlugin, useModule } from '@samatech/vue-store'

export interface IZhuyinState {
  cardStats: Record<string, IBasicCardStats>
  quizOptions: IZhuyinQuizOptions
  quiz: IZhuyinQuizState | null
  quizHighScore: IZhuyinQuizHighScore
  quizDifficulty: IZhuyinQuizDifficulty
  quizPlays: number
}

const defaultQuiz = (): IZhuyinQuizState => {
  return {
    index: 0,
    symbolKeys: Object.keys(zhuyinSymbols) as KeyType[],
    incorrect: [],
    score: 0,
    quizStart: Date.now(),
    quizEnd: 0,
    questionStart: Date.now(),
    questionTime: 0,
    questionState: 'init',
    cheated: false,
    reviewing: true,
  }
}

const getters = (state: IZhuyinState) => ({
  quizRecord: (): IZhuyinQuizRecord => ({
    highScore: state.quizHighScore,
    difficulty: state.quizDifficulty,
    plays: state.quizPlays,
  }),
})

const mutations = (state: IZhuyinState) => ({
  setStats(id: string, stats: IBasicCardStats) {
    state.cardStats[id] = stats
  },
  setQuizOptions(options: Partial<IZhuyinQuizOptions>) {
    state.quizOptions = { ...state.quizOptions, ...options }
  },
  clearQuiz() {
    state.quiz = null
  },
  quizComplete() {
    const cheated = state.quiz?.cheated
    const count = state.quizOptions.count
    const highScore = state.quizHighScore[count] ?? 0
    const score = state.quiz?.score ?? 0
    const prev = state.quiz ?? defaultQuiz()
    state.quiz = { ...prev, questionState: 'complete', quizEnd: Date.now() }
    if (!cheated && score > highScore) {
      state.quizHighScore[count] = score
    }
    state.quizPlays = state.quizPlays + 1
  },
  setQuiz(quiz: Partial<IZhuyinQuizState>) {
    const prev = state.quiz ?? defaultQuiz()
    state.quiz = { ...prev, ...quiz }
  },
})

export const zhuyinModule = useModule<
  IZhuyinState,
  ReturnType<typeof getters>,
  ReturnType<typeof mutations>
>({
  name: 'zhuyin-store',
  version: 11,
  stateInit: () => ({
    cardStats: {},
    quizOptions: {
      reverse: false,
      order: 'random',
      hideKeyboard: false,
      count: 'all',
      cheating: false,
    },
    quiz: null,
    quizHighScore: {},
    quizDifficulty: {},
    quizPlays: 0,
  }),
  getters,
  mutations,
  plugins: [LocalStoragePlugin],
})
