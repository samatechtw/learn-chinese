import { ref, onUnmounted } from 'vue'

export function useScoreAnimate() {
  const prevScore = ref<number>(0)
  const scoreAdd = ref<number>(0)

  let timeoutId: number | null = null
  let intervalId: number | null = null

  function animate(add: number, current: number, stepMs = 100) {
    prevScore.value = current
    scoreAdd.value = add

    let remaining = add

    // clear old interval just in case
    if (intervalId !== null) {
      clearInterval(intervalId)
    }

    timeoutId = window.setTimeout(() => {
      timeoutId = null

      intervalId = window.setInterval(() => {
        if (remaining <= 0) {
          cancel()
        } else {
          prevScore.value++
          remaining--
        }
      }, stepMs)
    }, 1000)
  }

  function cancel() {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
    if (intervalId !== null) {
      clearInterval(intervalId)
      intervalId = null
    }
    scoreAdd.value = 0
  }

  onUnmounted(cancel)

  return {
    prevScore,
    scoreAdd,
    animate,
    cancel,
  }
}
