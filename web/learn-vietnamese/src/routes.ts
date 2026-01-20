import type { RouteRecordRaw } from 'vue-router'

export const vietnameseRoutes: RouteRecordRaw[] = [
  {
    path: '/vietnamese',
    name: 'VietnameseHome',
    component: () => import('./views/HomePage.vue'),
    meta: { title: 'Learn Vietnamese' },
  },
  {
    path: '/vietnamese/vocab-quiz',
    name: 'VietnameseVocabQuiz',
    component: () => import('./views/VocabQuizPage.vue'),
    meta: { title: 'Vietnamese Vocabulary Quiz' },
  },
]
