<template>
    <div class="table-demo-container">
        <c-card class="demo-card">
            <template #header>
                <div class="card-header">
                    <span>表格组件示例</span>
                </div>
            </template>

            <!-- 基本用法 - 数组数据源 -->
            <section class="demo-section">
                <h3>1. 数组数据源(本地分页)</h3>
                <c-table :columns="basicColumns" :dataSource="arrayData" :pagination="true" indexable />
            </section>

            <!-- Promise 数据源 -->
            <section class="demo-section">
                <h3>2. Promise 数据源(远程分页)</h3>
                <el-button @click="refreshRemoteData" type="primary" size="small" style="margin-bottom: 12px">
                    刷新数据
                </el-button>
                <c-table ref="remoteTableRef" :columns="basicColumns" :dataSource="fetchData" :pagination="true"
                    indexable />
            </section>

            <!-- 自定义列和表头 -->
            <section class="demo-section">
                <h3>3. 自定义列内容和表头</h3>
                <c-table :columns="customColumns" :dataSource="arrayData" :pagination="true">
                    <!-- 自定义状态列表头 -->
                    <template #statusHeader>
                        <el-icon style="margin-right: 4px">
                            <InfoFilled />
                        </el-icon>
                        <span>状态信息</span>
                    </template>

                    <!-- 自定义状态列内容 -->
                    <template #status="{ row }">
                        <el-tag :type="row.status === 'active' ? 'success' : 'info'">
                            {{ row.status === 'active' ? '激活' : '禁用' }}
                        </el-tag>
                    </template>

                    <!-- 自定义操作列 -->
                    <template #actions="{ row }">
                        <el-button type="primary" size="small" link @click="handleEdit(row)">
                            编辑
                        </el-button>
                        <el-button type="danger" size="small" link @click="handleDelete(row)">
                            删除
                        </el-button>
                    </template>
                </c-table>
            </section>

            <!-- 多选功能 -->
            <section class="demo-section">
                <h3>4. 多选功能</h3>
                <div style="margin-bottom: 12px">
                    <el-button @click="getSelectedRows" type="primary" size="small">
                        获取选中行
                    </el-button>
                    <span v-if="selectedRows.length" style="margin-left: 12px">
                        已选中 {{ selectedRows.length }} 行
                    </span>
                </div>
                <c-table ref="checkableTableRef" :columns="basicColumns" :dataSource="arrayData" :pagination="true"
                    checkable indexable />
            </section>

            <!-- 展开行 -->
            <section class="demo-section">
                <h3>5. 展开行</h3>
                <c-table :columns="basicColumns" :dataSource="arrayData" :pagination="true" expend>
                    <template #expand="{ props }">
                        <div style="padding: 12px">
                            <p><strong>详细信息:</strong></p>
                            <p>ID: {{ props.row.id }}</p>
                            <p>姓名: {{ props.row.name }}</p>
                            <p>年龄: {{ props.row.age }}</p>
                            <p>邮箱: {{ props.row.email }}</p>
                            <p>状态: {{ props.row.status }}</p>
                        </div>
                    </template>
                </c-table>
            </section>

            <!-- 嵌套列 -->
            <section class="demo-section">
                <h3>6. 嵌套列</h3>
                <c-table :columns="nestedColumns" :dataSource="arrayData" :pagination="true" />
            </section>
        </c-card>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { InfoFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// ========== 数据定义 ==========
const arrayData = ref([
    { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com', status: 'active' },
    { id: 2, name: '李四', age: 30, email: 'lisi@example.com', status: 'inactive' },
    { id: 3, name: '王五', age: 28, email: 'wangwu@example.com', status: 'active' },
    { id: 4, name: '赵六', age: 35, email: 'zhaoliu@example.com', status: 'active' },
    { id: 5, name: '孙七', age: 22, email: 'sunqi@example.com', status: 'inactive' },
    { id: 6, name: '周八', age: 29, email: 'zhouba@example.com', status: 'active' },
    { id: 7, name: '吴九', age: 31, email: 'wujiu@example.com', status: 'active' },
    { id: 8, name: '郑十', age: 27, email: 'zhengshi@example.com', status: 'inactive' },
    { id: 9, name: '钱十一', age: 33, email: 'qianshiyi@example.com', status: 'active' },
    { id: 10, name: '孙十二', age: 26, email: 'sunshier@example.com', status: 'active' },
    { id: 11, name: '李十三', age: 24, email: 'lishisan@example.com', status: 'inactive' },
    { id: 12, name: '周十四', age: 32, email: 'zhoushisi@example.com', status: 'active' }
])

// ========== 列配置 ==========
const basicColumns = [
    { prop: 'id', label: 'ID', width: '80' },
    { prop: 'name', label: '姓名', width: '120' },
    { prop: 'age', label: '年龄', width: '80' },
    { prop: 'email', label: '邮箱' }
]

const customColumns = [
    { prop: 'id', label: 'ID', width: '80' },
    { prop: 'name', label: '姓名', width: '120' },
    { prop: 'age', label: '年龄', width: '80' },
    { prop: 'status', label: '状态', width: '120' },
    { prop: 'actions', label: '操作', width: '150' }
]

const nestedColumns = [
    { prop: 'id', label: 'ID', width: '80' },
    {
        label: '用户信息',
        children: [
            { prop: 'name', label: '姓名', width: '120' },
            { prop: 'age', label: '年龄', width: '80' }
        ]
    },
    {
        label: '联系方式',
        children: [
            { prop: 'email', label: '邮箱' },
            { prop: 'status', label: '状态', width: '100' }
        ]
    }
]

// ========== Promise 数据源 ==========
const fetchData = (params) => {
    return new Promise((resolve) => {
        // 模拟 API 请求延迟
        setTimeout(() => {
            const { current, pageSize } = params
            const start = (current - 1) * pageSize
            const end = start + pageSize

            resolve({
                data: arrayData.value.slice(start, end),
                totalCount: arrayData.value.length
            })
        }, 500)
    })
}

// ========== 组件引用 ==========
const remoteTableRef = ref()
const checkableTableRef = ref()
const selectedRows = ref([])

// ========== 方法 ==========
const refreshRemoteData = () => {
    remoteTableRef.value?.query()
    ElMessage.success('数据已刷新')
}

const getSelectedRows = () => {
    const rows = checkableTableRef.value?.getSelection() || []
    selectedRows.value = rows
    ElMessage.success(`已选中 ${rows.length} 行`)
}

const handleEdit = (row) => {
    ElMessage.info(`编辑: ${row.name}`)
}

const handleDelete = (row) => {
    ElMessage.warning(`删除: ${row.name}`)
}
</script>

<style lang="scss" scoped>
.table-demo-container {
    padding: 20px;
}

.demo-card {
    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 18px;
        font-weight: 600;
    }
}

.demo-section {
    margin-bottom: 40px;

    &:last-child {
        margin-bottom: 0;
    }

    h3 {
        margin: 0 0 16px 0;
        font-size: 16px;
        font-weight: 600;
        color: #303133;
    }
}
</style>
