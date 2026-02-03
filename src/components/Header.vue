<template>
    <div class="header-container">
        <div class="header-left">
            <el-icon class="hamburger" @click="toggleSidebar">
                <component :is="isCollapsed ? 'Expand' : 'Fold'" />
            </el-icon>

            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item v-if="currentRoute">{{ currentRoute }}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="header-right">
            <!-- 主题切换器 -->
            <theme-switcher class="mr-4" />

            <el-dropdown @command="handleCommand" trigger="click">
                <div class="user-info">
                    <el-avatar :size="32" class="user-avatar" :icon="User" />
                    <span class="username">管理员</span>
                    <el-icon class="arrow-icon">
                        <CaretBottom />
                    </el-icon>
                </div>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                        <el-dropdown-item command="settings">设置</el-dropdown-item>
                        <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { User, CaretBottom } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import ThemeSwitcher from './ThemeSwitcher.vue'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

const isCollapsed = computed(() => appStore.sidebarCollapsed)
const currentRoute = computed(() => route.meta.title || route.name)

const toggleSidebar = () => {
    appStore.toggleSidebar()
}

const handleCommand = (command) => {
    switch (command) {
        case 'profile':
            ElMessage.info('个人中心')
            break
        case 'settings':
            ElMessage.info('设置')
            break
        case 'logout':
            ElMessage.success('退出登录成功')
            router.push('/')
            break
    }
}
</script>

<style lang="scss" scoped>
.header-container {
    @include flex-between;
    height: 60px;
    padding: 0 20px;
    background-color: white;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);

    .header-left {
        @include flex-center;
        gap: 20px;

        .hamburger {
            font-size: 24px;
            cursor: pointer;
            transition: color 0.3s;

            &:hover {
                color: $primary-color;
            }
        }
    }

    .header-right {
        @include flex-center;
        gap: 16px;

        .mr-4 {
            margin-right: 1rem;
        }

        .user-info {
            @include flex-center;
            gap: 8px;
            cursor: pointer;
            padding: 4px 8px;
            border-radius: 4px;
            transition: all 0.3s;

            &:hover {
                background-color: #f5f7fa;
            }

            .user-avatar {
                background-color: var(--el-color-primary);
                color: white;
            }

            .username {
                font-size: 14px;
                color: #303133;
                font-weight: 500;
            }

            .arrow-icon {
                font-size: 12px;
                color: #909399;
                margin-left: -2px;
            }
        }
    }
}
</style>
