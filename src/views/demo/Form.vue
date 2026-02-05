<template>
    <div class="table-demo-container">
        <c-form :json-schema="formConfig" v-model="formModel" />
    </div>
</template>

<script setup>
import { ref } from 'vue'

const formModel = ref({
    name: '',
    age: 25,
    gender: 'man',
    birthday: ''
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
    }
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
</style>
