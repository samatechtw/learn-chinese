import { IBasicCardStats } from '@frontend/types'
import {
  IVietnameseQuizDifficulty,
  IVietnameseQuizHighScore,
  IVietnameseQuizOptions,
  IVietnameseQuizRecord,
  IVietnameseQuizState,
} from '@learn-vietnamese/types'
import { LocalStoragePlugin, useModule } from '@samatech/vue-store'

export interface IVietnameseVocabState {
  cardStats: Record<string, IBasicCardStats>
  quizOptions: IVietnameseQuizOptions
  quiz: IVietnameseQuizState | null
  quizHighScore: IVietnameseQuizHighScore
  quizDifficulty: IVietnameseQuizDifficulty
  quizPlays: number
}

const defaultQuiz = (): IVietnameseQuizState => {
  return {
    index: 0,
    wordIds: [],
    questions: [],
    score: 0,
    quizStart: Date.now(),
    quizEnd: 0,
    questionStart: Date.now(),
    questionTime: 0,
    questionState: 'init',
    cheated: false,
    reviewing: false,
  }
}

const getters = (state: IVietnameseVocabState) => ({
  quizRecord: (): IVietnameseQuizRecord => ({
    highScore: state.quizHighScore,
    difficulty: state.quizDifficulty,
    plays: state.quizPlays,
  }),
})

const mutations = (state: IVietnameseVocabState) => ({
  setStats(id: string, stats: IBasicCardStats) {
    state.cardStats[id] = stats
  },
  setQuizOptions(options: Partial<IVietnameseQuizOptions>) {
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
  setQuiz(quiz: Partial<IVietnameseQuizState>) {
    const prev = state.quiz ?? defaultQuiz()
    state.quiz = { ...prev, ...quiz }
  },
})

export const vietnameseVocabModule = useModule<
  IVietnameseVocabState,
  ReturnType<typeof getters>,
  ReturnType<typeof mutations>
>({
  name: 'vietnamese-vocab-store',
  version: 1,
  stateInit: () => ({
    cardStats: {},
    quizOptions: {
      order: 'random',
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
