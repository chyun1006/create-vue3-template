/**
 * 路由配置文件
 * 统一管理路由和菜单配置
 */

/**
 * 路由配置数组
 * @property {string} path - 路由路径
 * @property {string} name - 路由名称
 * @property {Function} component - 组件导入函数
 * @property {Object} meta - 路由元信息
 * @property {string} meta.title - 页面标题
 * @property {string} meta.icon - 菜单图标 (Element Plus Icon 名称)
 * @property {boolean} meta.menu - 是否在菜单中显示
 * @property {boolean} meta.requiresAuth - 是否需要登录
 * @property {Array} children - 子路由
 */
export const routerConfig = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: {
      title: '首页',
      icon: 'House',
      menu: true,
      requiresAuth: false
    }
  },
  {
    // 子菜单示例
    path: '/demo',
    name: 'demo',
    redirect: '/all',
    meta: {
      title: 'demo',
      icon: 'Setting',
      menu: true,
      requiresAuth: true
    },
    children: [
      {
        path: '/all',
        name: 'all',
        component: () => import('@/views/demo/index.vue'),
        meta: {
          title: '示例页面',
          icon: 'User',
          menu: true,
          requiresAuth: true
        }
      },
      {
        path: '/modal',
        name: 'modal',
        component: () => import('@/views/demo/modal.vue'),
        meta: {
          title: '弹窗示例',
          icon: 'UserFilled',
          menu: true,
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
          menu: true,
          requiresAuth: true
        }
      }
    ]
  }
]

/**
 * 从路由配置中提取菜单配置
 * @param {Array} routes - 路由配置数组
 * @returns {Array} 菜单配置数组
 */
export function getMenuConfig(routes = routerConfig) {
  return routes
    .filter(route => route.meta?.menu === true)
    .map(route => {
      const menuItem = {
        path: route.path,
        name: route.name,
        title: route.meta.title,
        icon: route.meta.icon,
        meta: route.meta
      }

      // 递归处理子路由
      if (route.children && route.children.length > 0) {
        menuItem.children = getMenuConfig(route.children)
      }

      return menuItem
    })
}

/**
 * 生成 Vue Router 路由配置
 * @param {Array} routes - 路由配置数组
 * @returns {Array} Vue Router 格式的路由配置
 */
export function generateRoutes(routes = routerConfig) {
  return routes.map(route => {
    const routeItem = {
      path: route.path,
      name: route.name,
      meta: route.meta
    }

    // 只有当路由有 component 时才添加
    if (route.component) {
      routeItem.component = route.component
    }

    // 递归处理子路由
    if (route.children && route.children.length > 0) {
      routeItem.children = generateRoutes(route.children)
    }

    return routeItem
  })
}
