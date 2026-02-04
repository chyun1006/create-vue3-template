export default [
  {
    path: '/',
    name: 'home-layout',
    component: () => import('@/layouts/MainLayout.vue'),
    meta: {
      title: '首页',
      icon: 'House',
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
          icon: 'House',
          requiresAuth: false
        }
      }
    ]
  }
]
