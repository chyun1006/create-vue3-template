import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import { generateRoutes } from '@/config/router.config'

const routes = [
  {
    path: '/',
    component: MainLayout,
    redirect: '/',
    children: generateRoutes()
  },
  // 异常页面路由(不使用 MainLayout)
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
  },
  // 404 通配符路由,必须放在最后
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
