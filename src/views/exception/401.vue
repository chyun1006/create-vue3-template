<template>
    <div class="exception-page">
        <div class="exception-content">
            <div class="exception-icon">
                <el-icon :size="120" color="#409eff">
                    <ShieldAlert :size="120" />
                </el-icon>
            </div>
            <h1 class="exception-title">401</h1>
            <p class="exception-description">抱歉,您没有权限访问此页面</p>
            <div class="exception-actions">
                <el-button type="primary" @click="goHome">返回首页</el-button>
                <el-button @click="goBack">返回上一页</el-button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ShieldAlert } from 'lucide-vue-next'

const router = useRouter()

const goHome = () => {
    router.push('/')
}

const goBack = () => {
    router.back()
}
</script>

<style lang="scss" scoped>
.exception-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 20px;
}

.exception-content {
    text-align: center;
    background: white;
    border-radius: 16px;
    padding: 60px 40px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    max-width: 500px;
    width: 100%;
}

.exception-icon {
    margin-bottom: 24px;
    animation: bounce 2s infinite;
}

.exception-title {
    font-size: 72px;
    font-weight: bold;
    color: #409eff;
    margin: 0 0 16px 0;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.exception-description {
    font-size: 18px;
    color: #606266;
    margin: 0 0 32px 0;
    line-height: 1.6;
}

.exception-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
}

@keyframes bounce {
    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-10px);
    }
}
</style>
