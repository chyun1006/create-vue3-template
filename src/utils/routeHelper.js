import MainLayout from '@/layouts/MainLayout.vue'
import { RouterView } from 'vue-router'

/**
 * 将后端的扁平权限数组转换为带有层级、根据 order 排序的树结构
 * @param {Array} permissions - 后端返回的扁平权限数组
 * @returns {Array} 树形结构的权限数据
 */
export function buildAuthTree(permissions) {
    if (!permissions || !permissions.length) return []

    // 过滤出页面资源 (permissionType === 0)
    const pagePermissions = permissions.filter(p => p.permissionType === 0)

    // 1. 深拷贝并补充 children 容器
    const nodes = pagePermissions.map(p => ({ ...p, children: [] }))
    const nodeMap = new Map()
    nodes.forEach(node => nodeMap.set(node.permissionId, node))

    const tree = []
    nodes.forEach(node => {
        // null 或者 空字符串视作没有父级，属于外层树根
        if (!node.parentId || node.parentId === 0) {
            tree.push(node)
        } else {
            const parent = nodeMap.get(node.parentId)
            if (parent) {
                parent.children.push(node)
            } else {
                // 如果指明了 parentId 但没找到实体，作为保底也推入根节点
                tree.push(node)
            }
        }
    })

    // 2. 递归排序子级 (按照 order 升序)
    const sortNodes = (nodeList) => {
        nodeList.sort((a, b) => (a.order || 0) - (b.order || 0))
        nodeList.forEach(node => {
            if (node.children.length > 0) {
                sortNodes(node.children)
            }
        })
    }
    sortNodes(tree)

    return tree
}

/**
 * 从已扁平化的本地实体路由配置中提取映射字典
 * @param {Array} routes - 本地定义的一维路由数组 (flatAsyncRoutes)
 * @returns {Map} permissionId -> route对象的映射
 */
export function createLocalRouteMap(routes) {
    const routeMap = new Map()

    routes.forEach(route => {
        const permCode = route.meta?.permission?.[0]
        if (permCode) {
            // 本地路由已经扁平，直接存入字典 (为保纯净，依然防御性移除可能存在的 children)
            routeMap.set(permCode, { ...route, children: [] })
        }
    })

    return routeMap
}

/**
 * 根据后端产生的权限树，拼接本地路由实体，产生最终 VueRouter 结构
 * @param {Array} authTree - buildAuthTree 生成的有序权限树
 * @param {Array} localRoutes - 本地所有的 asyncRoutes 配置
 * @returns {Array} 最终可用于 router.addRoute() 的路由树
 */
export function generateFinalRoutes(authTree, localRoutes) {
    const routeMap = createLocalRouteMap(localRoutes)

    const traverse = (nodes) => {
        const result = []

        for (const node of nodes) {
            const localConfig = routeMap.get(node.permissionId)

            // 组装单个路由节点
            const routeNode = {
                // 没找到本地配置（或者它是咱们加的空壳），则虚拟一个 path，防止报错
                path: localConfig?.path ? localConfig.path : `/_v_${node.permissionId}`,
                name: localConfig?.name ? localConfig.name : node.permissionId,
                // !关键：如果是仅作目录作用的父节点且本地没有对应实体，默认先留空，下方判断后会补充 MainLayout 或者 RouterView
                component: localConfig?.component ? localConfig.component : undefined,
                meta: {
                    // 合并 localConfig 上的基础信息
                    ...(localConfig?.meta || {}),
                    title: node.permissionName || localConfig?.meta?.title || node.permissionId,
                    // 若后端提供了 hidden 就用后端的，否则沿用本地路由的 hidden，都没有则默认 false
                    hidden: node.hidden ?? localConfig?.meta?.hidden ?? false,
                    // 重写 permission，确保持卡
                    permission: [node.permissionId]
                }
            }

            // 递归子级
            if (node.children && node.children.length > 0) {
                routeNode.children = traverse(node.children)
                
                // 存在子节点但是本地没配页面实体组件（说明它是一个父节点目录）
                // 必须补充外壳供子视图渲染和路由嵌套高亮
                if (!routeNode.component) {
                    // 如果它是最外层大目录，需要带侧边栏和顶栏的 MainLayout包裹
                    // 如果它只是被挂在一个大目录里面的子文件夹，那么只需白板的 RouterView
                    routeNode.component = (!node.parentId || node.parentId === 0) ? MainLayout : RouterView
                }
            }

            // 只要后端的这层有内容、有组件，或者作为父节点有子级成立，就推入最终树
            if (localConfig || (node.children && node.children.length > 0)) {
                result.push(routeNode)
            }
        }
        return result
    }

    const controlledRoutes = traverse(authTree)

    // 新增逻辑：提取完全没有写 permission，即不需要权限的免死金牌路由，根据 parentCode 决定归属
    localRoutes.forEach(route => {
        const permCode = route.meta?.permission?.[0]
        if (!permCode) {
            // 这是免权限自由路由，准备挂载
            const freeRoute = { ...route, children: route.children || [] }
            const parentCode = route.meta?.parentCode
            
            let mounted = false
            
            // 如果你在本地写了归属目录的标记，就去受控大树里寻找这个老爹
            if (parentCode) {
                const mountToParent = (treeNodes) => {
                    for (const node of treeNodes) {
                        // 根据 name 或者 permission 这个唯一的特征相认
                        if (node.name === parentCode || (node.meta?.permission && node.meta.permission[0] === parentCode)) {
                            if (!node.children) node.children = []
                            node.children.push(freeRoute)
                            return true
                        }
                        if (node.children && node.children.length > 0) {
                            if (mountToParent(node.children)) return true
                        }
                    }
                    return false
                }
                mounted = mountToParent(controlledRoutes)
            }
            
            // 如果你没写归属爹，或者写了但在当前受控的大树里那个爹因为某些原因不在（比如它没被授权）
            //那就作为流浪孤儿直接放在大树第一层
            if (!mounted) {
                controlledRoutes.push(freeRoute)
            }
        }
    })

    return controlledRoutes
}


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
