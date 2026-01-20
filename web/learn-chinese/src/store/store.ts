import { store as baseStore, WebStore } from '@frontend/store'
import { zhuyinModule } from './zhuyin-store'
import { zhuyinTypingModule } from './zhuyin-typing-store'
import { vocabModule } from './vocab-store'

export interface ChineseStore extends WebStore {
  zhuyin: typeof zhuyinModule
  typing: typeof zhuyinTypingModule
  vocab: typeof vocabModule
}

export const store: ChineseStore = {
  ...baseStore,
  zhuyin: zhuyinModule,
  typing: zhuyinTypingModule,
  vocab: vocabModule,
}
