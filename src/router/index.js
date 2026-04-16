import { createRouter, createWebHashHistory } from 'vue-router'
import { flatAsyncRoutes } from './router.config'
import localRoutes from './moduels/local'

export const defaultRoutes = localRoutes

export const asyncRoutes = [...flatAsyncRoutes]

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
    history: createWebHashHistory(),
    routes: [...staticRoutes]
})

export default router
