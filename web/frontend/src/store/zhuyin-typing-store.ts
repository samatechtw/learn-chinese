import {
  IBasicCardStats,
  IZhuyinTypingRecord,
  IZhuyinTypingState,
  IZhuyinTypingDifficulty,
  IZhuyinTypingHighScore,
  IZhuyinTypingOptions,
  KeyType,
} from '@frontend/types'
import { hsk1, ICharacterSetName } from '@frontend/util/characters'
import { LocalStoragePlugin, useModule } from '@samatech/vue-store'

export interface IZhuyinTypingStoreState {
  cardStats: Record<string, IBasicCardStats>
  typingOptions: IZhuyinTypingOptions
  state: IZhuyinTypingState | null
  typingHighScore: IZhuyinTypingHighScore
  typingDifficulty: IZhuyinTypingDifficulty
  typingPlays: number
}

const defaultTyping = (): IZhuyinTypingState => {
  return {
    index: 0,
    characters: Object.keys(hsk1) as KeyType[],
    incorrect: [],
    questionMistakes: 0,
    score: 0,
    start: Date.now(),
    end: 0,
    questionStart: Date.now(),
    questionTime: 0,
    questionState: 'init',
    showPinyin: false,
    cheated: 0,
    reviewing: true,
  }
}

const getters = (state: IZhuyinTypingStoreState) => ({
  typingRecord: (): IZhuyinTypingRecord => ({
    highScore: state.typingHighScore,
    difficulty: state.typingDifficulty,
    plays: state.typingPlays,
  }),
  sets: (): ICharacterSetName[] => {
    return state.typingOptions.sets || ['hsk1']
  },
})

const mutations = (state: IZhuyinTypingStoreState) => ({
  setStats(id: string, stats: IBasicCardStats) {
    state.cardStats[id] = stats
  },
  setTypingOptions(options: Partial<IZhuyinTypingOptions>) {
    state.typingOptions = { ...state.typingOptions, ...options }
  },
  clearTyping() {
    state.state = null
  },
  typingComplete() {
    const cheated = state.state?.cheated
    const count = state.typingOptions.count
    const highScore = state.typingHighScore[count] ?? 0
    const score = state.state?.score ?? 0
    const prev = state.state ?? defaultTyping()
    state.state = { ...prev, questionState: 'complete', end: Date.now() }
    if (!cheated && score > highScore) {
      state.typingHighScore[count] = score
    }
    state.typingPlays = state.typingPlays + 1
  },
  setTyping(typing: Partial<IZhuyinTypingState>) {
    const prev = state.state ?? defaultTyping()
    state.state = { ...prev, ...typing }
  },
  startQuestion(typing: Partial<IZhuyinTypingState>) {
    const prev = state.state ?? defaultTyping()
    state.state = { ...prev, ...typing, showPinyin: false, cheated: 0 }
  },
  incrementCheated(amount: number) {
    const prev = state.state ?? defaultTyping()
    const cheated = amount + prev.cheated
    state.state = { ...prev, cheated }
  },
  showPinyin(showPinyin: boolean) {
    const prev = state.state ?? defaultTyping()
    const cheated = (showPinyin ? 5 : -3) + prev.cheated
    state.state = { ...prev, showPinyin, cheated }
  },
  recordMistake() {
    const prev = state.state ?? defaultTyping()
    const prevCount = prev.questionMistakes ?? 0
    state.state = { ...prev, questionMistakes: prevCount + 1 }
  },
})

export const zhuyinTypingModule = useModule<
  IZhuyinTypingStoreState,
  ReturnType<typeof getters>,
  ReturnType<typeof mutations>
>({
  name: 'zhuyin-typing-store',
  version: 11,
  stateInit: () => ({
    cardStats: {},
    state: null,
    typingHighScore: {},
    typingDifficulty: {},
    typingPlays: 0,
    typingOptions: {
      hideKeyboard: false,
      sets: ['hsk1'],
      order: 'random',
      count: 'all',
      hint: 5,
      cheating: false,
      showPinyin: false,
    },
  }),
  getters,
  mutations,
  plugins: [LocalStoragePlugin],
})
