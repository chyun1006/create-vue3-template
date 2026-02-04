<template>
    <!-- 如果只有一个子菜单，且该子菜单没有更多子菜单，则直接展示该子菜单 -->
    <template v-if="onlyOneChild && (!onlyOneChild.children || onlyOneChild.children.length === 0)">
        <el-menu-item :index="onlyOneChild.path" @click="handleClick(onlyOneChild)">
            <el-icon v-if="onlyOneChild.icon || item.icon">
                <component :is="onlyOneChild.icon || item.icon" />
            </el-icon>
            <template #title>
                <span>{{ onlyOneChild.title }}</span>
            </template>
        </el-menu-item>
    </template>

    <!-- 没有子菜单 -->
    <el-menu-item v-else-if="!item.children || item.children.length === 0" :index="item.path"
        @click="handleClick(item)">
        <el-icon v-if="item.icon">
            <component :is="item.icon" />
        </el-icon>
        <template #title>
            <span>{{ item.title }}</span>
        </template>
    </el-menu-item>

    <!-- 带多个子菜单的菜单项 -->
    <el-sub-menu v-else :index="item.path || item.title">
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
import { computed } from 'vue'

const props = defineProps({
    item: {
        type: Object,
        required: true
    }
})

const onlyOneChild = computed(() => {
    if (props.item.children && props.item.children.length === 1) {
        return props.item.children[0]
    }
    return null
})

const router = useRouter()

const handleClick = (item) => {
    if (item.path) {
        router.push(item.path)
    }
}
</script>
