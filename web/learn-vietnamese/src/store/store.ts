import { store as baseStore, WebStore } from '@frontend/store'
import { vietnameseVocabModule } from './vocab-store'

export interface VietnameseStore extends WebStore {
  vocab: typeof vietnameseVocabModule
}

export const store: VietnameseStore = {
  ...baseStore,
  vocab: vietnameseVocabModule,
}
