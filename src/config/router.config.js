/**
 * 从路由配置中提取菜单配置
 * @param {Array} routes - 路由配置数组
 * @returns {Array} 菜单配置数组
 */
export function getMenuConfig(routes = []) {
    return routes
        .filter((route) => !route.meta?.hidden)
        .map((route) => {
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
