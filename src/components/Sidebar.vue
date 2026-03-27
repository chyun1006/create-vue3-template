<template>
    <div class="sidebar-container" :class="[isCollapsed ? 'collapsed' : '', `theme-sidebar-${sidebarTheme}`]">
        <div class="logo-container">
            <transition name="fade">
                <span v-if="!isCollapsed" class="logo-title">Vue3 Template</span>
                <span v-else class="logo-title">V</span>
            </transition>
        </div>

        <el-scrollbar class="sidebar-scrollbar">
            <el-menu :default-active="activeMenu" :collapse="isCollapsed" :unique-opened="false"
                :collapse-transition="false" class="el-menu-vertical" router>
                <sidebar-item v-for="route in menuList" :key="route.path || route.title" :item="route" />
            </el-menu>
        </el-scrollbar>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { getMenuConfig } from '@/utils/routeHelper'
import SidebarItem from './SidebarItem.vue'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const appStore = useAppStore()
const userStore = useUserStore()

const isCollapsed = computed(() => appStore.sidebarCollapsed)
// 侧边栏主题：可选 'light' 或 'dark'，默认为 'light'
const sidebarTheme = computed(() => appStore.sidebarTheme || 'light')
const menuList = computed(() => getMenuConfig(userStore.menus || []))
const activeMenu = computed(() => {
    const { meta, path } = route
    return meta?.activePath || path
})
</script>

<style lang="scss" scoped>
.sidebar-container {
    height: 100%;
    width: 256px;
    transition: width 0.28s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: width;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    &.collapsed {
        width: 64px;
    }

    .logo-container {
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 16px;
        overflow: hidden;
        white-space: nowrap;
        position: relative;

        .logo-title {
            font-weight: 600;
            font-size: 18px;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
        }
    }

    .sidebar-scrollbar {
        flex: 1;

        :deep(.el-scrollbar__wrap) {
            overflow-x: hidden;
        }
    }

    .el-menu-vertical {
        background-color: transparent !important;
        height: 100%;

        &:not(.el-menu--collapse) {
            width: 100% !important;
        }

        :deep(.el-menu) {
            background-color: transparent !important;
        }
    }
}

.fade-enter-active {
    transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1) 0.1s;
}

.fade-leave-active {
    transition: opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
