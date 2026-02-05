import { ref, watch, onMounted } from 'vue'

/**
 * 表格数据管理 Composable
 * @param {Object} props - 组件 props
 * @returns {Object} 表格状态和方法
 */
export function useTable(props) {
    // ========== 状态管理 ==========
    const loading = ref(false)
    const tableData = ref([])
    const current = ref(1)
    const pageSize = ref(10)
    const total = ref(0)

    // 选中行数据
    let selectionRows = []
    // 本地数据源(数组类型)
    let localDataSource = []

    // ========== 数据源类型检测 ==========
    const isArrayDataSource = () => Array.isArray(props.dataSource)
    const isFunctionDataSource = () => typeof props.dataSource === 'function'

    // ========== 数据格式化 ==========
    /**
     * 格式化响应数据
     * @param {Object} response - API 响应
     * @returns {Object} { list, total, current }
     */
    const formatResponse = (response) => {
        // 自定义格式化函数优先
        if (props.formatFunc) {
            return props.formatFunc(response)
        }

        // 标准格式 (isNewTable: true)
        if (props.isNewTable) {
            const { data = {} } = response || {}
            const { list = [], total: resTotal = 0, pageNum = 1 } = data || {}
            return {
                list,
                total: resTotal,
                current: pageNum
            }
        }

        // 旧格式 (默认)
        const { data = [], totalCount = 0 } = response || {}
        return {
            list: Array.isArray(data) ? data : [],
            total: totalCount,
            current: current.value
        }
    }

    // ========== 本地分页逻辑 ==========
    /**
     * 计算本地分页数据
     */
    const calculateLocalPagination = () => {
        const start = (current.value - 1) * pageSize.value
        const end = start + pageSize.value
        tableData.value = localDataSource.slice(start, end)
        total.value = localDataSource.length
    }

    /**
     * 设置本地数据源
     * @param {Array} data - 数据数组
     */
    const setLocalDatasource = (data) => {
        localDataSource = Array.isArray(data) ? data : []
        total.value = localDataSource.length

        // 如果使用本地分页,计算分页数据
        if (props.useLocalPagination || isArrayDataSource()) {
            calculateLocalPagination()
        } else {
            tableData.value = localDataSource
        }
    }

    // ========== 远程数据请求 ==========
    /**
     * 查询数据
     * @param {Object} params - 查询参数
     */
    const query = async (params = {}) => {
        // 如果是数组数据源,不执行查询
        if (isArrayDataSource()) {
            return
        }

        // 如果不是函数数据源,无法查询
        if (!isFunctionDataSource()) {
            console.warn('[c-table] dataSource 必须是函数类型才能执行查询')
            return
        }

        try {
            loading.value = true

            // 合并默认参数和传入参数
            const queryParams = {
                ...props.defaultParams,
                ...params,
                current: current.value,
                pageSize: pageSize.value
            }

            // 调用数据源函数
            const response = await props.dataSource(queryParams)

            // 格式化响应数据
            const { list, total: resTotal, current: resCurrent } = formatResponse(response)

            tableData.value = list
            total.value = resTotal

            // 更新当前页码(如果响应中包含)
            if (resCurrent !== undefined) {
                current.value = resCurrent
            }

            // 调用请求完成回调
            if (props.onRequestFinished) {
                props.onRequestFinished()
            }
        } catch (error) {
            console.error('[c-table] 数据请求失败:', error)
            tableData.value = []
            total.value = 0
        } finally {
            loading.value = false
        }
    }

    // ========== 分页控制 ==========
    /**
     * 每页条数变化
     * @param {Number} size - 新的每页条数
     */
    const handleSizeChange = (size) => {
        pageSize.value = size
        current.value = 1 // 重置到第一页

        if (isArrayDataSource() || props.useLocalPagination) {
            // 本地分页
            calculateLocalPagination()
        } else {
            // 远程分页
            query()
        }
    }

    /**
     * 页码变化
     * @param {Number} page - 新的页码
     */
    const handleCurrentChange = (page) => {
        current.value = page

        if (isArrayDataSource() || props.useLocalPagination) {
            // 本地分页
            calculateLocalPagination()
        } else {
            // 远程分页
            query()
        }
    }

    /**
     * 编程式切换页码
     * @param {Number} page - 目标页码
     */
    const changeCurrentPage = (page) => {
        handleCurrentChange(page)
    }

    // ========== 多选控制 ==========
    /**
     * 多选变化
     * @param {Array} selection - 选中的行
     */
    const handleSelectionChange = (selection) => {
        selectionRows = selection
    }

    /**
     * 获取选中行
     * @returns {Array} 选中的行数据
     */
    const getSelection = () => {
        return selectionRows
    }

    // ========== 状态获取 ==========
    /**
     * 获取当前状态
     * @returns {Object} 当前状态
     */
    const getState = () => {
        return {
            current: current.value,
            pageSize: pageSize.value,
            total: total.value,
            loading: loading.value
        }
    }

    // ========== 初始化和监听 ==========
    onMounted(() => {
        // 自动查询
        if (props.autoQuery && isFunctionDataSource()) {
            query()
        }
    })

    // 监听数据源变化
    watch(
        () => props.dataSource,
        (newDataSource) => {
            // 重置分页状态
            current.value = 1

            if (Array.isArray(newDataSource)) {
                // 数组数据源
                setLocalDatasource(newDataSource)
            } else if (typeof newDataSource === 'function' && props.autoQuery) {
                // 函数数据源,自动查询
                query()
            }
        }
    )

    // ========== 返回值 ==========
    return {
        // 状态
        loading,
        tableData,
        current,
        pageSize,
        total,

        // 方法
        query,
        handleSizeChange,
        handleCurrentChange,
        handleSelectionChange,
        setLocalDatasource,
        getSelection,
        changeCurrentPage,
        getState
    }
}
