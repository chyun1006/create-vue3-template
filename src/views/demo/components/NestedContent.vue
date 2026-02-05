<template>
    <div class="nested-content">
        <p>这是父弹窗的内容</p>
        <el-button type="primary" @click="openChildModal">打开子弹窗</el-button>
    </div>
</template>

<script setup>
import { useModal } from '@/composables/useModal'
import BasicContent from './BasicContent.vue'

const childModal = useModal()

const openChildModal = () => {
    childModal.open(BasicContent, {
        title: '子弹窗',
        width: '400px'
    })
}
</script>

<style lang="scss" scoped>
.nested-content {
    padding: 40px;
    text-align: center;

    p {
        margin-bottom: 20px;
        font-size: 16px;
        color: #606266;
    }
}
</style>
