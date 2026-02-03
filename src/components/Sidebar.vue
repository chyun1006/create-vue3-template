<template>
    <div class="sidebar-container" :class="{ collapsed: isCollapsed }">
        <div class="logo-container">
            <transition name="fade">
                <span v-if="!isCollapsed" class="logo-title">Vue3 Template</span>
                <span v-else class="logo-title">V</span>
            </transition>
        </div>

        <el-scrollbar class="sidebar-scrollbar">
            <el-menu :default-active="activeMenu" :collapse="isCollapsed" :unique-opened="true"
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
import { getMenuConfig } from '@/config/router.config'
import SidebarItem from './SidebarItem.vue'

const route = useRoute()
const appStore = useAppStore()

const isCollapsed = computed(() => appStore.sidebarCollapsed)
const menuList = computed(() => getMenuConfig())
const activeMenu = computed(() => route.path)
</script>

<style lang="scss" scoped>
.sidebar-container {
    height: 100%;
    background-color: var(--sidebar-bg);
    transition: width 0.3s;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    .logo-container {
        height: 60px;
        background-color: var(--sidebar-logo-bg);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 16px;
        overflow: hidden;
        white-space: nowrap;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);

        .logo-title {
            color: var(--sidebar-text, white);
            font-weight: 600;
            font-size: 18px;
        }
    }

    .sidebar-scrollbar {
        flex: 1;
        background-color: var(--sidebar-bg);

        :deep(.el-scrollbar__wrap) {
            overflow-x: hidden;
        }
    }

    .el-menu-vertical {
        border-right: none;
        background-color: transparent !important;
        height: 100%;

        &:not(.el-menu--collapse) {
            width: 256px;
        }

        :deep(.el-menu) {
            background-color: transparent !important;
        }

        :deep(.el-sub-menu__title) {
            color: var(--sidebar-text, #bfcbd9) !important;

            &:hover {
                background-color: rgba(255, 255, 255, 0.08) !important;
            }
        }

        :deep(.el-menu-item) {
            color: var(--sidebar-text, #bfcbd9) !important;

            &:hover {
                background-color: rgba(255, 255, 255, 0.08) !important;
            }

            &.is-active {
                color: #ffffff !important;
                background-color: color-mix(in oklch, var(--el-color-primary), transparent 80%) !important;
                border-right: 3px solid var(--el-color-primary);

                :deep(span) {
                    color: #ffffff !important;
                }
            }
        }
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
