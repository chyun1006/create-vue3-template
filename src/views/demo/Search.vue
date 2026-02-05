<template>
    <div class="page-container">
        <div class="page-header">
            <h2>C-Search 组件示例</h2>
            <p>基于配置的动态搜索栏，支持响应式布局和自动折叠。</p>
        </div>
        <c-search :json-schema="searchSchema" v-model="searchModel" @search="handleSearch" @reset="handleReset">
            <!-- 演示插槽功能 -->
            <template #extra-btns>
                <el-button type="success" plain @click="handleExport">导出数据</el-button>
            </template>
        </c-search>

        <el-card class="result-card">
            <template #header>
                <div class="card-header">
                    <span>当前搜索条件 (实时预览)</span>
                </div>
            </template>
            <pre class="code-block">{{ JSON.stringify(searchModel, null, 2) }}</pre>
        </el-card>

        <el-card class="mt-4">
            <el-table :data="tableData" border style="width: 100%">
                <el-table-column prop="date" label="Date" width="180" />
                <el-table-column prop="name" label="Name" width="180" />
                <el-table-column prop="status" label="Status" />
                <el-table-column prop="role" label="Role" />
                <el-table-column prop="amount" label="Amount" />
            </el-table>
        </el-card>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import CSearch from '@/components/ui/c-search/index.vue';

// 1. 定义搜索模型
const searchModel = ref({});

// 2. 定义搜索配置
const searchSchema = reactive({
    name: {
        type: 'input',
        attrs: {
            placeholder: '请输入姓名',
            label: '姓名'
        }
    },
    status: {
        type: 'select',
        attrs: {
            placeholder: '请选择状态',
            options: [
                { label: '启用', value: 1 },
                { label: '禁用', value: 0 }
            ]
        }
    },
    role: {
        type: 'select',
        attrs: {
            placeholder: '选择角色',
            options: [
                { label: '管理员', value: 'admin' },
                { label: '用户', value: 'user' },
                { label: '访客', value: 'guest' }
            ]
        }
    },
    date: {
        type: 'date-picker',
        attrs: {
            type: 'daterange',
            'range-separator': '至',
            'start-placeholder': '开始日期',
            'end-placeholder': '结束日期',
            'value-format': 'YYYY-MM-DD'
        }
    },
    amount: {
        type: 'input-number',
        attrs: {
            placeholder: '金额>=',
            min: 0,
            style: { width: '100%' }
        }
    },
    description: {
        type: 'input',
        attrs: {
            placeholder: '描述关键词'
        }
    },
    // 添加更多字段以测试折叠功能
    category: {
        type: 'select',
        attrs: {
            placeholder: '分类',
            options: [
                { label: '技术', value: 'tech' },
                { label: '生活', value: 'life' }
            ]
        }
    },
    tags: {
        type: 'select',
        attrs: {
            placeholder: '标签',
            multiple: true,
            collapseTags: true,
            options: [
                { label: 'Vue', value: 'vue' },
                { label: 'React', value: 'react' },
                { label: 'Angular', value: 'angular' }
            ]
        }
    }
});

// 3. 模拟表格数据
const tableData = ref([
    { date: '2024-02-01', name: 'Tom', status: '启用', role: 'Admin', amount: 100 },
    { date: '2024-02-02', name: 'Jerry', status: '禁用', role: 'User', amount: 200 },
    { date: '2024-02-03', name: 'Spike', status: '启用', role: 'Guest', amount: 50 },
]);

// 4. 事件处理
const handleSearch = (model) => {
    console.log('Search triggered:', model);
    ElMessage.success('搜索已触发，请查看控制台输出');
    // 这里可以调用接口刷新表格
};

const handleReset = () => {
    console.log('Reset triggered');
    ElMessage.info('重置已触发');
    // 这里可以重置分页等状态
};

const handleExport = () => {
    ElMessage.success('导出数据操作');
};
</script>

<style scoped>
.page-container {
    padding: 20px;
}

.page-header {
    margin-bottom: 20px;
}

.page-header h2 {
    margin: 0;
    font-size: 24px;
    color: #303133;
}

.page-header p {
    margin: 8px 0 0;
    color: #909399;
}

.code-block {
    background: #f5f7fa;
    padding: 12px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 14px;
    color: #606266;
    margin: 0;
}

.mt-4 {
    margin-top: 16px;
}
</style>
