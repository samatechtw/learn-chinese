import { authModule } from './auth-store'
import { miscModule } from './misc-store'
import { userModule } from './user-store'
import { zhuyinModule } from './zhuyin-store'
import { zhuyinTypingModule } from './zhuyin-typing-store'

declare global {
  interface Window {
    store: WebStore
  }
}

export interface WebStore {
  misc: typeof miscModule
  auth: typeof authModule
  user: typeof userModule
  zhuyin: typeof zhuyinModule
  typing: typeof zhuyinTypingModule
}

export const store: WebStore = {
  misc: miscModule,
  auth: authModule,
  user: userModule,
  zhuyin: zhuyinModule,
  typing: zhuyinTypingModule,
}

// Attach to window for debugging purposes
window.store = store
