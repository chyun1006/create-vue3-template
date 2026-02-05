import { LayoutDashboard, Users, MessageSquare, Table2, Form } from 'lucide-vue-next'

export default [
    {
        path: '/demo',
        name: 'demo-layout',
        component: () => import('@/layouts/MainLayout.vue'),
        meta: {
            title: 'demo',
            icon: LayoutDashboard,
            requiresAuth: false
        },
        redirect: '/all',
        children: [
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
            }
        ]
    }
]
