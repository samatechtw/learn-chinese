import {
  IBasicCardStats,
  IVocabQuizDifficulty,
  IVocabQuizHighScore,
  IVocabQuizOptions,
  IVocabQuizRecord,
  IVocabQuizState,
} from '@frontend/types'
import { LocalStoragePlugin, useModule } from '@samatech/vue-store'

export interface IVocabState {
  cardStats: Record<string, IBasicCardStats>
  quizOptions: IVocabQuizOptions
  quiz: IVocabQuizState | null
  quizHighScore: IVocabQuizHighScore
  quizDifficulty: IVocabQuizDifficulty
  quizPlays: number
}

const defaultQuiz = (): IVocabQuizState => {
  return {
    index: 0,
    characterIds: [],
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

const getters = (state: IVocabState) => ({
  quizRecord: (): IVocabQuizRecord => ({
    highScore: state.quizHighScore,
    difficulty: state.quizDifficulty,
    plays: state.quizPlays,
  }),
})

const mutations = (state: IVocabState) => ({
  setStats(id: string, stats: IBasicCardStats) {
    state.cardStats[id] = stats
  },
  setQuizOptions(options: Partial<IVocabQuizOptions>) {
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
  setQuiz(quiz: Partial<IVocabQuizState>) {
    const prev = state.quiz ?? defaultQuiz()
    state.quiz = { ...prev, ...quiz }
  },
})

export const vocabModule = useModule<
  IVocabState,
  ReturnType<typeof getters>,
  ReturnType<typeof mutations>
>({
  name: 'vocab-store',
  version: 1,
  stateInit: () => ({
    cardStats: {},
    quizOptions: {
      hskLevel: 'hsk1',
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
