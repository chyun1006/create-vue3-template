/**
 * =========================================================================
 * ✈️ RNP 自动路由与菜单配置指南 (前端实体字典)
 * =========================================================================
 * 
 * 【核心机制：后端驱动层级】
 * 当前系统采用“后端权限数据驱动层级，前端提供实体皮肤和组件”的策略。
 * 本文件不再使用 Vue Router 传统的 `children: []` 嵌套写法，而是将所有页面完全【打平为一维数组】。
 * 
 * 【如何新增一个页面？】
 * 1. 在下方选择合适的业务数组（RoutePlanning / Dataset），直接 Push 一个扁平的路由对象。
 * 2. 必须包含 `meta.permission: ['xxx']`，这里的 `xxx` 必须与 SSO 后端系统里配置的 `permissionId` 完全一致！
 *    （这是引擎重组整棵树的唯一暗号。只要暗号对齐，不论你写在这个数组的哪里，都会自动被挂载到后端设定的父目录下）
 * 3. `parentCode` 为辅助注释字段，只为方便本地代码阅读，不参与真实重组逻辑。
 * 
 * 【补充说明：parentRoutes 虚拟占位层的作用】
 * 在后端的权限树里，存在很多【只作折叠目录、没有实际页面】的节点（例如最外层的“航线规划”、“航班监控”）。
 * 引擎会自动为它们套上 `MainLayout` 或 `RouterView` 的外壳。
 * 此时，前端只需要在文件末尾的 `parentRoutes` 中给这些目录提供一个同名 `permission` 的对象，塞入 `icon` 和 `title` 即可。
 * 这样，左侧的侧边栏大目录就能拥有漂亮的图标啦！
 * 
 * =========================================================================
 */


// 以下是示例，请更改为系统自己的配置
// 下面的包含命名等均可修改，只要保证parentCode和permission一致即可
// ==================================自定义开始=======================================

import { HardDrive, Building2, Plane, FileCog, Clock, Scale, Route, ClipboardList, Activity, BarChart3, RefreshCw, Calculator, Map, Compass, Settings, SlidersHorizontal, Clock4 } from 'lucide-vue-next'
// ————————————————————————————————————————
// 1. 航线规划模块 (包含下属模块及其子模块)，只写叶子节点的
// ————————————————————————————————————————
export const routePlanningRoutes = [
    // --- 航线规划 直属 ---
    {
        path: '/route-planning/company-plan',
        name: 'company-plan',
        component: () => import('@/views/demo/table.vue'),
        meta: { title: '公司计划', icon: Building2, requiresAuth: true, parentCode: 'route-planning', permission: ['company-plan'] }
    },
    {
        path: '/route-planning/plan-wizard',
        name: 'plan-wizard',
        component: () => import('@/views/demo/Form.vue'),
        meta: { title: '公司计划详情', icon: Compass, requiresAuth: true, hidden: true, parentCode: 'route-planning', permission: ['plan-wizard'], activePath: '/route-planning/company-plan' }
    },
    {
        path: '/recommend/flight-plan-calc',
        name: 'flight_plan_calc',
        component: () => import('@/views/demo/index.vue'),
        meta: { title: '计划测算', icon: Calculator, requiresAuth: true, keepAlive: true, parentCode: 'route-planning', permission: ['flight-plan-calc'] }
    },
    {
        path: '/recommend/flight-plan-calc/period-per-day-detail',
        name: 'period-per-day-detail',
        component: () => import('@/views/demo/table.vue'),
        meta: { title: '航班测算历史明细数据', requiresAuth: true, keepAlive: true, hidden: true, parentCode: 'route-planning', permission: ['period-per-day-detail'], activePath: '/recommend/flight-plan-calc' }
    },
    {
        path: '/recommend/season-support',
        name: 'season-support',
        component: () => import('@/views/demo/Form.vue'),
        meta: { title: '换季支撑', icon: RefreshCw, requiresAuth: true, parentCode: 'route-planning', permission: ['season-support'] }
    },

    // --- 航班监控 下属 ---
    {
        path: '/recommend/flight-monitor/monitor-manage',
        name: 'monitor-manage',
        component: () => import('@/views/demo/index.vue'),
        meta: { title: '监控管理', icon: BarChart3, requiresAuth: true, parentCode: 'flight-monitor', permission: ['monitor-manage'] }
    },
    {
        path: '/recommend/flight-monitor/execute-rate-plan',
        name: 'execute-rate-plan',
        component: () => import('@/views/demo/table.vue'),
        meta: { title: '计划管理', icon: ClipboardList, requiresAuth: true, parentCode: 'flight-monitor', permission: ['execute-rate-plan'] }
    }
]

// ————————————————————————————————————————
// 2. 数据维护模块 (包含 系统自带数据维护项、基础数据管理、字典等)
// ————————————————————————————————————————
export const datasetRoutes = [
    // --- 数据维护 下属 ---
    {
        path: '/dataset/history-time',
        name: 'historytime',
        component: () => import('@/views/demo/table.vue'),
        meta: { title: '历史时刻', icon: Clock, requiresAuth: true, parentCode: 'dataset', permission: ['flight_history_time'] }
    },
    {
        path: '/basic-manage/time-coefficient',
        name: 'time-coefficient',
        component: () => import('@/views/demo/Form.vue'),
        meta: { title: '时刻系数', icon: Clock4, requiresAuth: true, parentCode: 'dataset', permission: ['time-coefficient'] }
    },
    {
        path: '/dataset/flight-right',
        name: 'flightright',
        component: () => import('@/views/demo/table.vue'),
        meta: { title: '航权', icon: Scale, requiresAuth: true, parentCode: 'dataset', permission: ['flight_air_right'] }
    },
    {
        path: '/basic-manage/strategy-manage',
        name: 'strategy-manage',
        component: () => import('@/views/demo/Search.vue'),
        meta: { title: '策略管理', icon: SlidersHorizontal, requiresAuth: true, parentCode: 'dataset', permission: ['strategy-manage'] }
    },
    {
        path: '/dataset/airport-throughput',
        name: 'airportthroughput',
        component: () => import('@/views/demo/index.vue'),
        meta: { title: '机场吞吐数据', icon: Plane, requiresAuth: true, parentCode: 'dataset', permission: ['airportthroughput'], keepAlive: true }
    },
    {
        path: '/dataset/data-maintain',
        name: 'datamaintain',
        component: () => import('@/views/demo/Form.vue'),
        meta: { title: '数据维护(明细)', icon: FileCog, requiresAuth: true, parentCode: 'dataset', permission: ['data-maintain'] }
    },
    {
        path: '/dataset/city-data',
        name: 'citydata',
        component: () => import('@/views/demo/table.vue'),
        meta: { title: '城市数据', icon: Building2, requiresAuth: true, parentCode: 'dataset', permission: ['citydata'], keepAlive: true }
    }
]
// ==================================自定义结束=======================================





// ————————————————————————————————————————
// 3. 补充渲染图标和标题占位的纯虚拟父级目录   不论是2还是3级目录，只要没有component，就属于虚拟目录
// 这个类别一般是固定的，最好不自定义，只要上述的parentCode有值对应，就应该将这个permission加入到parentRoutes中
// ————————————————————————————————————————
export const parentRoutes = [
    {
        meta: { permission: ['route-planning'], icon: Map, title: '航线规划' }
    },
    {
        meta: { permission: ['dataset'], icon: HardDrive, title: '数据维护' }
    },
    {
        meta: { permission: ['flight-monitor'], icon: Activity, title: '航班监控' }
    }
]

// 最终汇总暴露的一维配置池
export const flatAsyncRoutes = [
    ...routePlanningRoutes,
    ...datasetRoutes,
    ...parentRoutes
]
