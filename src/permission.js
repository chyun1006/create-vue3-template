import router from './router'
import sso from './utils/sso'
import { asyncRoutes } from './router'
import { useUserStore } from './stores/user'

router.beforeEach(async (to) => {
    console.log('路由守卫:', to.path)

    const userStore = useUserStore()

    if (to.query.token) {
        sso.setToken(to.query.token)
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
        const token = sso.getToken()
        // 如果没有加载过动态路由（通常可以通过判断 store 里的菜单是否为空来决定）
        if (token && userStore.menus.length === 0) {
            // 根据权限过滤路由
            const filteredRoutes = sso.filterRoutesByPermission(asyncRoutes)
            userStore.setMenus(filteredRoutes)
            userStore.setToken(token)
            userStore.setUserInfo(sso.getUserInfo())

            // 动态添加路由
            filteredRoutes.forEach((route) => {
                router.addRoute(route)
            })

            // 重要：最后添加 404 通配符路由
            router.addRoute({
                path: '/:pathMatch(.*)*',
                redirect: '/404'
            })

            // 重新导航，确保能匹配到新添加的路由
            return { ...to, replace: true }
        }
        return true
    }
    return false
})
