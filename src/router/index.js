import { createRouter, createWebHistory } from 'vue-router'
import homeRoutes from './moduels/home'
import demoRoutes from './moduels/demo'

export const asyncRoutes = [...homeRoutes, ...demoRoutes]

const staticRoutes = [
  {
    path: '/401',
    name: 'Error401',
    component: () => import('@/views/exception/401.vue'),
    meta: {
      title: '无权限'
    }
  },
  {
    path: '/404',
    name: 'Error404',
    component: () => import('@/views/exception/404.vue'),
    meta: {
      title: '页面不存在'
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...staticRoutes]
})

export default router
