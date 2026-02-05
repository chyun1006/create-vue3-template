<template>
    <div class="table-demo-container">
        <c-card class="demo-card">
            <template #header>
                <div class="card-header">
                    <span>基础表单演示</span>
                </div>
            </template>
            <c-form ref="formRef" :json-schema="formConfig" v-model="formModel" />
            <div class="mt-4 flex justify-start gap-2">
                <el-button type="primary" @click="onSubmit">提交</el-button>
                <el-button @click="onReset">重置</el-button>
            </div>
        </c-card>

        <!-- 远程数据演示 -->
        <c-card class="demo-card mt-6">
            <template #header>
                <div class="card-header">
                    <span>远程数据获取演示</span>
                </div>
            </template>
            <c-form ref="remoteRef" :json-schema="remoteConfig" v-model="remoteModel" />
            <div class="mt-4">
                <el-button type="primary" @click="onRemoteSubmit">打印数据</el-button>
                <el-button @click="fetchRemoteData">手动重新获取部门数据</el-button>
            </div>
        </c-card>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

// --- 基础表单逻辑 ---
const formRef = ref(null)
const formModel = ref({
    name: '',
    age: 25,
    gender: 'man',
    birthday: '',
    education: '',
    hobbies: [],
    isFullTime: true,
    jobTitle: '',
    description: ''
})

const formConfig = ref({
    name: {
        label: '姓名',
        type: 'input',
        attrs: { span: 12, placeholder: '请输入真实姓名' },
        rule: { required: true }
    },
    gender: {
        label: '性别',
        type: 'radio-group',
        options: [
            { label: '男', value: 'man' },
            { label: '女', value: 'woman' }
        ],
        attrs: { span: 12 },
        rule: { required: true }
    },
    age: {
        label: '年龄',
        type: 'input-number',
        attrs: { span: 12, min: 1, max: 100 },
        rule: { required: true }
    },
    birthday: {
        label: '出生日期',
        type: 'date-picker',
        attrs: { span: 12, type: 'date', placeholder: '选择日期' },
        rule: { required: true }
    },
    education: {
        label: '学历',
        type: 'select',
        options: [
            { label: '本科', value: 'bachelor' },
            { label: '硕士', value: 'master' },
            { label: '博士', value: 'phd' }
        ],
        attrs: { span: 12, placeholder: '请选择最高学历' }
    },
    hobbies: {
        label: '兴趣爱好',
        type: 'checkbox-group',
        options: [
            { label: '阅读', value: 'reading' },
            { label: '旅行', value: 'travel' },
            { label: '游戏', value: 'gaming' }
        ],
        attrs: { span: 12 }
    },
    isFullTime: {
        label: '是否全职',
        type: 'switch',
        attrs: { span: 12 }
    },
    jobTitle: {
        label: '职位名称',
        type: 'input',
        attrs: { span: 12, placeholder: '请输入当前职位' },
        visible: (model) => model.isFullTime
    },
    description: {
        label: '个人简介',
        type: 'textarea',
        attrs: { span: 24, rows: 4, placeholder: '请简单介绍一下自己' }
    }
})

const onSubmit = async () => {
    const valid = await formRef.value?.validate()
    if (valid) {
        console.log('Form Submit:', formModel.value)
        ElMessage.success('提交成功！请在控制台查看数据')
    }
}

const onReset = () => {
    formRef.value?.resetFields()
    ElMessage.info('表单已重置')
}

// --- 远程数据表单逻辑 ---
const remoteRef = ref(null)
const remoteModel = ref({
    deptId: '',
    keyword: ''
})

const remoteConfig = ref({
    deptId: {
        label: '所属部门',
        type: 'select',
        options: [], // 初始为空
        attrs: {
            span: 12,
            placeholder: '异步加载数据中...',
            loading: false
        }
    },
    keyword: {
        label: '关键词',
        type: 'input',
        attrs: { span: 12, placeholder: '输入内容' }
    }
})

// 模拟获取远程数据
const fetchRemoteData = async () => {
    remoteConfig.value.deptId.attrs.loading = true
    remoteConfig.value.deptId.attrs.placeholder = '正在获取部门列表...'

    // 模拟接口延迟
    await new Promise(resolve => setTimeout(resolve, 1500))

    const mockDepts = [
        { label: '技术部', value: '1' },
        { label: '产品部', value: '2' },
        { label: '市场部', value: '3' },
        { label: '人事部', value: '4' }
    ]

    remoteConfig.value.deptId.options = mockDepts
    remoteConfig.value.deptId.attrs.loading = false
    remoteConfig.value.deptId.attrs.placeholder = '请选择部门'
    ElMessage.success('部门数据加载成功')
}

const onRemoteSubmit = () => {
    console.log('Remote Form Data:', remoteModel.value)
    ElMessage.info('数据已打印到控制台')
}

onMounted(() => {
    fetchRemoteData()
})
</script>

<style lang="scss" scoped>
.demo-card {
    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 16px;
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

.mt-4 {
    margin-top: 16px;
}

.flex {
    display: flex;
}

.justify-start {
    justify-content: flex-start;
}

.gap-2 {
    gap: 8px;
}
</style>
