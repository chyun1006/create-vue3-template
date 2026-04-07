import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
    state: () => ({
        // 侧边栏是否收起
        sidebarCollapsed: false,
        // 设备类型
        device: 'desktop',
        // 全局加载状态
        loading: false,
        // 加载配置项
        loadingConfig: {
            text: '正在加载中...',
            background: 'rgba(255, 255, 255, 0.85)'
        }
    }),

    getters: {
        isMobile: (state) => state.device === 'mobile'
    },

    actions: {
        toggleSidebar() {
            this.sidebarCollapsed = !this.sidebarCollapsed
        },

        setSidebarCollapsed(collapsed) {
            this.sidebarCollapsed = collapsed
        },

        setDevice(device) {
            this.device = device
        },

        setLoading(loading, config = {}) {
            this.loading = loading
            if (loading) {
                this.loadingConfig = {
                    ...this.loadingConfig,
                    ...config
                }
            }
        }
    }
})
