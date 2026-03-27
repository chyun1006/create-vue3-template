<template>
    <c-table :columns="tableColumns" :dataSource="fetchData" :pagination="true">
        <template #content="{ row }">
            <div class="whitespace-normal break-words leading-relaxed text-gray-600">
                {{ row.content || '无' }}
            </div>
        </template>
        <template #action="{ row }">
            <slot name="action" :row="row"></slot>
        </template>
    </c-table>
</template>

<script setup>
import { computed } from 'vue'
import dayjs from 'dayjs'
import to from '@/utils/await-to-js'
import * as api from '@/apis/common/common'

const props = defineProps({
    bizKey: {
        type: String,
        required: true
    },
    showAction: {
        type: Boolean,
        default: false
    },
    actionColumnWidth: {
        type: [Number, String],
        default: 120
    }
})

const tableColumns = computed(() => {
    const cols = [
        { prop: 'operator', label: '操作人', minWidth: 150 },
        {
            prop: 'createTime',
            label: '操作时间',
            minWidth: 150,
            formatter: (row) => (row.createTime ? dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss') : '')
        },
        {
            prop: 'content',
            label: '操作内容',
            minWidth: 350,
            slot: 'content'
        }
    ]

    if (props.showAction) {
        cols.push({
            prop: 'action',
            label: '操作',
            width: props.actionColumnWidth,
            slot: 'action',
            fixed: 'right'
        })
    }
    return cols
})

const fetchData = async (params) => {
    const { current, pageSize } = params

    const [err, res] = await to(
        api.queryOperateLog({
            targetId: props.bizKey,
            currentPage: current,
            pageSize
        })
    )

    if (err || !res?.success) {
        return { data: [], totalCount: 0 }
    }

    return {
        data: res?.data?.dataList || [],
        totalCount: res?.data?.count || 0
    }
}
</script>
