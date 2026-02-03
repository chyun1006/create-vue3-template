<template>
    <div class="demo-page">
        <div class="space-y-8">
            <!-- Element Plus 组件示例 -->
            <c-card class="demo-card">
                <template #header>
                    <div class="flex justify-between items-center">
                        <span class="font-semibold text-lg">Element Plus 组件</span>
                        <el-tag type="primary">主题定制</el-tag>
                    </div>
                </template>

                <div class="space-y-4">
                    <!-- 按钮组 -->
                    <div class="flex gap-3 flex-wrap">
                        <el-button type="primary">主要按钮</el-button>
                        <el-button type="success">成功按钮</el-button>
                        <el-button type="warning">警告按钮</el-button>
                        <el-button type="danger">危险按钮</el-button>
                        <el-button type="info">信息按钮</el-button>
                    </div>

                    <!-- 输入框 -->
                    <el-input v-model="inputValue" placeholder="请输入内容" class="max-w-md" />

                    <!-- 开关和滑块 -->
                    <div class="flex items-center gap-6">
                        <el-switch v-model="switchValue" />
                        <el-slider v-model="sliderValue" class="flex-1 max-w-md" />
                    </div>
                </div>
            </c-card>

            <!-- Tailwind CSS 样式示例 -->
            <c-card class="demo-card">
                <template #header>
                    <span class="font-semibold text-lg">Tailwind CSS 样式</span>
                </template>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
                        <h3 class="text-xl font-bold mb-2">渐变卡片 1</h3>
                        <p class="text-blue-100">使用 Tailwind 渐变背景</p>
                    </div>
                    <div class="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg">
                        <h3 class="text-xl font-bold mb-2">渐变卡片 2</h3>
                        <p class="text-green-100">响应式网格布局</p>
                    </div>
                    <div class="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
                        <h3 class="text-xl font-bold mb-2">渐变卡片 3</h3>
                        <p class="text-purple-100">现代化设计风格</p>
                    </div>
                </div>
            </c-card>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const inputValue = ref('')
const switchValue = ref(true)
const sliderValue = ref(50)

</script>

<style lang="scss" scoped>
.demo-card {
    transition: transform 0.3s ease;

    &:hover {
        transform: translateY(-2px);
    }
}

.custom-styled-card {
    .custom-content {
        @include flex-between;
        gap: 1rem;
        flex-wrap: wrap;
    }

    .custom-box {
        flex: 1;
        min-width: 250px;
        padding: 1.5rem;
        background-color: $bg-color;
        border: 1px solid $border-light;
        border-radius: $border-radius-base;
        transition: all 0.3s;

        &:hover {
            border-color: $primary-color;
            box-shadow: $box-shadow-base;
        }

        h3 {
            color: $primary-color;
            font-size: $font-size-large;
            margin-bottom: 0.5rem;
        }

        p {
            color: $text-secondary;
            font-size: $font-size-base;
        }
    }
}
</style>
