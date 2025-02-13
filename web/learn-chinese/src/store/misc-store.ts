// Miscellaneous app state
// Includes state used for app control flow or state without an obvious category
import { LocalStoragePlugin, useModule } from '@samatech/vue-store'

export interface IMiscState {
  cookiesAccepted: boolean
  locale: string
  voiceName: string | null
  playAudio: boolean
}

const getters = (state: IMiscState) => ({
  cookiesAccepted: () => state.cookiesAccepted,
})

const mutations = (state: IMiscState) => ({
  setCookiesAccepted(accepted: boolean) {
    state.cookiesAccepted = accepted
  },
  setLocale: (locale: string) => {
    state.locale = locale
  },
  setVoice: (voice: string | undefined) => {
    state.voiceName = voice || null
  },
  setPlayAudio(play: boolean) {
    state.playAudio = play
  },
})

export const miscModule = useModule<
  IMiscState,
  ReturnType<typeof getters>,
  ReturnType<typeof mutations>
>({
  name: 'misc-store',
  version: 6,
  stateInit: () => ({
    cookiesAccepted: false,
    locale: 'en',
    voiceName: null,
    playAudio: true,
  }),
  getters,
  mutations,
  plugins: [LocalStoragePlugin],
})
