import type { RouteRecordRaw } from 'vue-router'

export const vietnameseRoutes: RouteRecordRaw[] = [
  {
    path: '/vietnamese',
    name: 'VietnameseHome',
    component: () => import('./views/HomePage.vue'),
    meta: { title: 'Learn Vietnamese' },
  },
]
