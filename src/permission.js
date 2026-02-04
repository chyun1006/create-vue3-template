import router from './router'
import sso from './utils/sso'
import { asyncRoutes } from './router'
import { useUserStore } from './stores/user'

router.beforeEach(async (to) => {
  console.log('路由守卫:', to.path)

  const userStore = useUserStore()

  if (to.query.token) {
    sso.setToken(to.query.token)
    console.log('Token 已存储:', to.query.token)
    const query = { ...to.query }
    delete query.token
    delete query.token_name
    delete query.sso_tenant_code
    delete query.sso_business_code
    return { path: to.path, query }
  }

  // 不需要鉴权
  if (to.meta.requiresAuth === false) {
    return true
  }

  const isAuth = await sso.auth(to)
  if (isAuth) {
    // 已登录但未加载动态路由
    const token = sso.getToken()
    if (token) {
      // 根据权限过滤路由
      const filteredRoutes = sso.filterRoutesByPermission(asyncRoutes)
      userStore.setMenus(filteredRoutes)
      userStore.setToken(token)
      userStore.setUserInfo(sso.getUserInfo())
      // 动态添加路由
      filteredRoutes.forEach((route) => router.addRoute(route))
      // 重新导航
      // return { ...to, replace: true };
    }
    return true
  }
  return false
})
