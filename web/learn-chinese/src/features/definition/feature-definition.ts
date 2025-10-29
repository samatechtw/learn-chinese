import { externalApi } from '@frontend/api'
import { ICharacterDefinition } from '@frontend/types'
import { ref } from 'vue'

const chars = ref<Record<string, ICharacterDefinition>>()

export const useDefinition = () => {
  const loading = ref(false)
  const error = ref()

  const lookup = async (char: string) => {
    try {
      const result = await externalApi.request({ url: '' })
    } catch (e) {
      console.log('lookup', e)
      error.value = 'Lookup failed'
    }
  }

  return {
    loading,
    error,
    lookup,
  }
}
