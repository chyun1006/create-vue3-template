import { Home, LayoutDashboard, Users, MessageSquare, Table2, Form, Search, Upload } from 'lucide-vue-next'
// 本地路由，用于调试，测试环境会显示，上环境不会显示
export default [
    {
        path: '/',
        name: 'home-layout',
        component: () => import('@/layouts/MainLayout.vue'),
        meta: {
            title: '首页-本地',
            icon: Home,
            requiresAuth: false
        },
        redirect: '/home',
        children: [
            {
                path: '/home',
                name: 'home',
                component: () => import('@/views/Home.vue'),
                meta: {
                    title: '首页',
                    icon: Home,
                    requiresAuth: false,
                    keepAlive: true
                }
            }
        ]
    },
    {
        path: '/demo',
        name: 'demo-layout',
        component: () => import('@/layouts/MainLayout.vue'),
        meta: {
            title: 'demo-本地',
            icon: LayoutDashboard,
            requiresAuth: false
        },
        redirect: '/all',
        children: [
            {
                path: '/search',
                name: 'search',
                component: () => import('@/views/Demo/Search.vue'),
                meta: {
                    title: '搜索示例',
                    icon: Search,
                    requiresAuth: true
                }
            },
            {
                path: '/all',
                name: 'all',
                component: () => import('@/views/Demo/Index.vue'),
                meta: {
                    title: '示例页面',
                    icon: Users,
                    requiresAuth: true
                    // permission: ['123']
                }
            },
            {
                path: '/modal',
                name: 'modal',
                component: () => import('@/views/Demo/Modal.vue'),
                meta: {
                    title: '弹窗示例',
                    icon: MessageSquare,
                    requiresAuth: true
                }
            },
            {
                path: '/table',
                name: 'table',
                component: () => import('@/views/Demo/Table.vue'),
                meta: {
                    title: '表格示例',
                    icon: Table2,
                    requiresAuth: true
                }
            },
            {
                path: '/form',
                name: 'form',
                component: () => import('@/views/Demo/Form.vue'),
                meta: {
                    title: '表单示例',
                    icon: Form,
                    requiresAuth: true
                }
            },
            {
                path: '/upload',
                name: 'upload',
                component: () => import('@/views/Demo/Upload.vue'),
                meta: {
                    title: '上传示例',
                    icon: Upload,
                    requiresAuth: true
                }
            }
        ]
    }
]
