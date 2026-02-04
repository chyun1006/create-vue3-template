<template>
    <el-card class="c-card" v-bind="$attrs" shadow="never">
        <!-- 头部插槽 -->
        <template v-if="$slots.header" #header>
            <slot name="header"></slot>
        </template>

        <!-- 默认内容插槽 -->
        <slot></slot>
    </el-card>
</template>

<script setup>
// 继承 el-card 的所有属性
defineOptions({
    inheritAttrs: false
})
</script>

<style scoped>
.c-card {
    background-color: white;
    border-radius: 0.75rem;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    border: 1px solid rgb(229 231 235);
}

/* 覆盖 el-card 的默认样式 */
:deep(.el-card__header) {
    border-bottom: 1px solid rgb(243 244 246);
    background-color: transparent;
    padding: 10px 20px;
}

:deep(.el-card__body) {
    padding: 1.25rem;
}
</style>
