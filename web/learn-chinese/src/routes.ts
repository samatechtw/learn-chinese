import type { RouteRecordRaw } from 'vue-router'

export const chineseRoutes: RouteRecordRaw[] = [
  {
    path: '/chinese',
    name: 'ChineseHome',
    component: () => import('./views/HomePage.vue'),
    meta: { title: 'Learn Chinese' },
  },
  {
    path: '/zhuyin/learn',
    name: 'ZhuyinLearn',
    meta: { title: 'Zhuyin Learn' },
    component: () => import('./views/ZhuyinLearnPage.vue'),
  },
  {
    path: '/zhuyin/quiz',
    name: 'ZhuyinQuiz',
    meta: { title: 'Zhuyin Quiz' },
    component: () => import('./views/ZhuyinQuizPage.vue'),
  },
  {
    path: '/zhuyin/typing',
    name: 'ZhuyinTyping',
    meta: { title: 'Zhuyin Typing' },
    component: () => import('./views/ZhuyinTypingPage.vue'),
  },
  {
    path: '/vocab/quiz',
    name: 'VocabQuiz',
    meta: { title: 'Vocabulary Quiz' },
    component: () => import('./views/VocabQuizPage.vue'),
  },
]
