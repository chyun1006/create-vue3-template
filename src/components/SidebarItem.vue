<template>
    <!-- 单个菜单项 -->
    <el-menu-item v-if="!item.children" :index="item.path" @click="handleClick(item)">
        <el-icon v-if="item.icon">
            <component :is="item.icon" />
        </el-icon>
        <template #title>
            <span>{{ item.title }}</span>
        </template>
    </el-menu-item>

    <!-- 带子菜单的菜单项 -->
    <el-sub-menu v-else :index="item.title">
        <template #title>
            <el-icon v-if="item.icon">
                <component :is="item.icon" />
            </el-icon>
            <span>{{ item.title }}</span>
        </template>

        <sidebar-item v-for="child in item.children" :key="child.path" :item="child" />
    </el-sub-menu>
</template>

<script setup>
import { useRouter } from 'vue-router'

defineProps({
    item: {
        type: Object,
        required: true
    }
})

const router = useRouter()

const handleClick = (item) => {
    if (item.path) {
        router.push(item.path)
    }
}
</script>
