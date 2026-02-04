export default [
  {
    path: '/demo',
    name: 'demo-layout',
    component: () => import('@/layouts/MainLayout.vue'),
    meta: {
      title: 'demo',
      icon: 'House',
      requiresAuth: false
    },
    redirect: '/all',
    children: [
      {
        path: '/all',
        name: 'all',
        component: () => import('@/views/demo/index.vue'),
        meta: {
          title: '示例页面',
          icon: 'User',
          requiresAuth: true
          // permission: ['123']
        }
      },
      {
        path: '/modal',
        name: 'modal',
        component: () => import('@/views/demo/modal.vue'),
        meta: {
          title: '弹窗示例',
          icon: 'UserFilled',
          requiresAuth: true
        }
      },
      {
        path: '/table',
        name: 'table',
        component: () => import('@/views/demo/table.vue'),
        meta: {
          title: '表格示例',
          icon: 'Grid',
          requiresAuth: true
        }
      }
    ]
  }
]
