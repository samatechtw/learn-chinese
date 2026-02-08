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
    props: { questionMode: 'EnglishToVietnamese' },
    meta: { title: 'Vietnamese Vocabulary Quiz' },
  },
  {
    path: '/vietnamese/vocab-quiz-reverse',
    name: 'VietnameseVocabQuizReverse',
    component: () => import('./views/VocabQuizPage.vue'),
    props: { questionMode: 'VietnameseToEnglish' },
    meta: { title: 'Vietnamese Reverse Vocabulary Quiz' },
  },
  {
    path: '/vietnamese/segments/:segmentId',
    name: 'VietnameseSegmentLesson',
    component: () => import('./views/SegmentLessonPage.vue'),
    props: (route) => ({
      segmentId: String(route.params.segmentId ?? ''),
    }),
    meta: { title: 'Vietnamese Segment Lesson' },
  },
]
