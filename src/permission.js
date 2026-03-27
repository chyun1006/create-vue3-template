import router from './router'
import sso from './utils/sso'
import { asyncRoutes } from './router'
import { useUserStore } from './stores/user'
import { buildAuthTree, generateFinalRoutes } from '@/utils/routeHelper'

// 以下三行代码是测试用，不要可删除
import homeRoutes from '@/router/moduels/home'
import demoRoutes from '@/router/moduels/demo'
const defaultRoutes = [...homeRoutes, ...demoRoutes]

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
            const userInfo = sso.getUserInfo()
            // SSO 返回的扁平权限数组
            const rawPermissions = userInfo?.roles?.[0]?.permissions || []
            // 1. 将扁平数组转为带 order 排序的权限树
            const authTree = buildAuthTree(rawPermissions)
            // 2. 将本地 asyncRoutes 砸平并以 authTree 为模版进行重装
            const finalRoutesTree = generateFinalRoutes(authTree, asyncRoutes)
            console.log('生成的全新层级路由树:', finalRoutesTree)
            const allRoutes = []
            if (defaultRoutes?.length) {
                allRoutes.push(...defaultRoutes)
            }
            if (finalRoutesTree?.length) {
                allRoutes.push(...finalRoutesTree)
            }
            // 3. 将新树派发给 Store
            userStore.setMenus(allRoutes)
            userStore.setToken(token)
            userStore.setUserInfo(userInfo)
            // 4. 动态注册全部路由
            allRoutes.forEach((route) => {
                router.addRoute(route)
            })

            // 重要：最后添加 404 通配符路由
            router.addRoute({
                path: '/:pathMatch(.*)*',
                redirect: (to) => {
                    return { path: '/404', query: { redirect: to.fullPath }, replace: true }
                }
            })

            // 重新导航，确保能匹配到新添加的路由
            return { ...to, replace: true }
        }
        return true
    }
    return false
})
