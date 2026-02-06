<template>
    <el-table header-cell-class-name="table-header-cell-class-name" ref="tableRef" :data="tableData" v-loading="loading" v-bind="$attrs" @selection-change="handleSelectionChange" :header-cell-style="{ background: '#f9fafb' }">
        <el-table-column v-if="checkable && !latest" type="selection" width="55" :selectable="(row) => !row.disabled" />

        <el-table-column type="expand" v-if="expend">
            <template #default="props">
                <slot name="expand" :props="props"></slot>
            </template>
        </el-table-column>

        <el-table-column align="center" :fixed="indexFixed" v-if="indexable" key="index" prop="index" width="60" label="序号">
            <template #default="{ $index }">{{ (current - 1) * pageSize + $index + 1 }}</template>
        </el-table-column>

        <table-column v-bind="{ ...col }" v-for="col in columns" :column="col" :key="col.prop">
            <template v-if="$slots[col.prop]" v-slot:[col.prop]="{ row, column, index }">
                <slot :name="col.prop" :row="row" :column="column" :index="index"></slot>
            </template>
            <template v-if="$slots[col.prop + 'Header']" v-slot:header>
                <slot :name="col.prop + 'Header'"></slot>
            </template>
        </table-column>

        <el-table-column v-if="checkable && latest" type="selection" width="55" :selectable="(row) => !row.disabled" />
        <template #empty>
            <slot name="empty"></slot>
        </template>
    </el-table>
    <div v-if="showPagination" class="table-pagination">
        <el-pagination
            v-bind="$attrs"
            :current-page="current"
            :page-sizes="[5, 10, 20, 50, 100]"
            :page-size="pageSize"
            :total="total"
            :layout="layout"
            @size-change="_handleSizeChange"
            @current-change="_handleCurrentChange"
        >
        </el-pagination>
    </div>
</template>

<script setup>
import { ref, reactive, provide, watch, toRaw, nextTick, isRef } from 'vue'
import TableColumn from './table-column.vue'
import { useTable } from './useTable'
import { computed } from 'vue'

const props = defineProps({
    columns: Array,
    dataSource: [Function, Array],
    pagination: [Object, Boolean],
    /** 是否展示多选 */
    checkable: Boolean,
    /** 是否自动显示序号 */
    indexable: Boolean,
    indexFixed: String,
    spining: Boolean,
    /** 是否展开 */
    expend: Boolean,
    latest: Boolean,
    defaultParams: Object,
    totalCount: Number,
    formatFunc: Function,
    /** 请求结束回调，场景：想知道请求结束的时间，用于展示刷新时间 */
    onRequestFinished: Function,
    layout: {
        type: String,
        default: 'total, prev, pager, next, sizes, jumper'
    },
    // 是否自动查询, 关闭是为了处理筛选条件异步的问题
    autoQuery: {
        type: Boolean,
        default: true
    },
    // 运行改造后标准数据结构
    isNewTable: {
        type: Boolean,
        default: false
    },
    useLocalPagination: {
        type: Boolean,
        default: false
    },
    showOnePage: {
        type: Boolean,
        default: true
    }
})

const emits = defineEmits(['sizeChange', 'currentChange', 'tabChange'])
const tableRef = ref()
let {
    loading,
    tableData,
    setLocalDatasource,
    current,
    total,
    pageSize,
    query,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange,
    getSelection,
    changeCurrentPage,
    getState
} = useTable(props)

const showPagination = computed(() => {
    if (props.pagination && tableData.value?.length) {
        if (!props.showOnePage && total.value <= pageSize.value) {
            return false
        }
        return true
    }
    return false
})

watch(
    () => props.dataSource,
    (newV) => {
        // 当前数据源为数组时
        if (Array.isArray(newV)) {
            setLocalDatasource(newV)
        }
    },
    {
        immediate: true
    }
)

watch(
    tableData,
    (newV) => {
        // 设置默认选中行
        if (props.checkable) {
            const rows = (newV || []).filter((r) => r.disabled)
            // setRowSelecttion(rows);
        }
        // 数据更新后，将展开的行合上
        if (props.expend) {
            setRowExpand(newV)
        }
    },
    {
        immediate: true
    }
)

watch(
    () => props.spining,
    (newV) => {
        loading.value = newV
    }
)

function setRowSelecttion(rows) {
    nextTick(() => {
        ;(rows || []).map((r) => {
            tableRef.value.toggleRowSelection(r, true)
        })
    })
}

function setRowExpand(rows) {
    nextTick(() => {
        ;(rows || []).map((r) => {
            tableRef.value.toggleRowExpansion(r, false)
        })
    })
}

const _handleSizeChange = (e) => {
    handleSizeChange(e)
    emits('sizeChange', e)
}

const _handleCurrentChange = (e) => {
    handleCurrentChange(e)
    emits('currentChange', e)
}
const changeLoading = (v) => {
    loading.value = v
}
const clearSort = () => {
    tableRef.value.clearSort()
}
const getSelectionRows = () => {
    return tableRef.value?.getSelectionRows()
}

defineExpose({
    query,
    tableData,
    tableRef,
    setRowSelecttion,
    getSelection,
    changeLoading,
    changeCurrentPage,
    getState,
    clearSort,
    getSelectionRows
})
</script>
<style lang="scss" scoped>
.table-pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
}
</style>
