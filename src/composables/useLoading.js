import { useAppStore } from '@/stores/app'
import { storeToRefs } from 'pinia'

/**
 * 全局加载状态 Hook (通用模板版)
 */
export function useLoading() {
    const appStore = useAppStore()
    const { loading, loadingConfig } = storeToRefs(appStore)

    /**
     * 设置全局加载状态
     * @param {boolean} status 状态
     * @param {object} config 配置项
     */
    const setGlobalLoading = (status, config = {}) => {
        appStore.setLoading(status, config)
    }

    return {
        loading,
        loadingConfig,
        setGlobalLoading
    }
}
