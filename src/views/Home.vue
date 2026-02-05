<template>
    <div class="home-container">
        <div class="welcome-section">
            <div class="welcome-content">
                <h1 class="welcome-title">
                    你好, <span>{{ userStore.userInfo?.userName || '管理员' }}</span>
                </h1>
                <p class="welcome-subtitle">欢迎登录 {{ APP_CONFIG.systemCode || 'xxx' }} 系统</p>
                <div class="welcome-info">
                    <div class="info-item">
                        <Calendar class="icon" :size="16" />
                        <span>{{ currentDate }}</span>
                    </div>
                    <div class="info-item">
                        <Clock class="icon" :size="16" />
                        <span>{{ currentTime }}</span>
                    </div>
                </div>
            </div>
            <div class="welcome-bg">
                <img src="https://img.alicdn.com/imgextra/i3/O1CN01T36nSj1LPL6x9G3jX_!!6000000001287-2-tps-1398-1046.png" alt="welcome" />
            </div>
        </div>

        <div class="dashboard-grid">
            <c-card class="status-card">
                <template #header>
                    <div class="card-header">
                        <span>系统状态</span>
                        <el-tag type="success" size="small" effect="dark">运行中</el-tag>
                    </div>
                </template>
                <div class="status-content">
                    <div class="status-item">
                        <span class="label">当前角色</span>
                        <span class="value">{{ userStore.userInfo?.roleName || '超级管理员' }}</span>
                    </div>
                    <div class="status-item">
                        <span class="label">登录时间</span>
                        <span class="value">{{ loginTime }}</span>
                    </div>
                </div>
            </c-card>

            <c-card class="quick-link-card">
                <template #header>
                    <div class="card-header">
                        <span>快速开始</span>
                    </div>
                </template>
                <div class="quick-links">
                    <div class="link-item" @click="router.push('/all')">
                        <div class="icon-box blue">
                            <FileText :size="24" />
                        </div>
                        <span>示例页面</span>
                    </div>
                    <div class="link-item" @click="router.push('/table')">
                        <div class="icon-box green">
                            <Table2 :size="24" />
                        </div>
                        <span>表格组件</span>
                    </div>
                    <div class="link-item" @click="router.push('/modal')">
                        <div class="icon-box purple">
                            <MessageSquare :size="24" />
                        </div>
                        <span>弹窗示例</span>
                    </div>
                </div>
            </c-card>

            <c-card class="announcement-card">
                <template #header>
                    <div class="card-header">
                        <span>系统公告</span>
                    </div>
                </template>
                <div class="announcement-list">
                    <div class="announcement-item">
                        <span class="dot"></span>
                        <span class="text">系统版本 1.0.0 正式上线发布</span>
                        <span class="date">2024-02-04</span>
                    </div>
                    <div class="announcement-item">
                        <span class="dot"></span>
                        <span class="text">欢迎使用现代化 Vue3 企业级模板</span>
                        <span class="date">2024-02-01</span>
                    </div>
                </div>
            </c-card>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { APP_CONFIG } from '@/config/app.config'
import { Calendar, Clock, FileText, Table2, MessageSquare } from 'lucide-vue-next'
import dayjs from 'dayjs'

const router = useRouter()
const userStore = useUserStore()

const currentDate = ref('')
const currentTime = ref('')
const loginTime = dayjs().format('YYYY-MM-DD HH:mm:ss')

let timer = null

const updateDateTime = () => {
    const now = dayjs()
    currentDate.value = now.format('YYYY年MM月DD日')
    currentTime.value = now.format('HH:mm:ss')
}

onMounted(() => {
    updateDateTime()
    timer = setInterval(updateDateTime, 1000)
})

onUnmounted(() => {
    if (timer) clearInterval(timer)
})
</script>

<style lang="scss" scoped>
.home-container {
    .welcome-section {
        background: linear-gradient(135deg, #1890ff 0%, #36cfc9 100%);
        border-radius: 12px;
        padding: 40px;
        color: white;
        position: relative;
        overflow: hidden;
        margin-bottom: 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

        .welcome-content {
            position: relative;
            z-index: 2;

            .welcome-title {
                font-size: 32px;
                font-weight: 600;
                margin-bottom: 8px;

                span {
                    color: #fffb8f;
                }
            }

            .welcome-subtitle {
                font-size: 18px;
                opacity: 0.9;
                margin-bottom: 24px;
            }

            .welcome-info {
                display: flex;
                gap: 24px;

                .info-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 14px;
                    background: rgba(255, 255, 255, 0.2);
                    padding: 6px 16px;
                    border-radius: 20px;
                    backdrop-filter: blur(4px);

                    .icon {
                        flex-shrink: 0;
                    }
                }
            }
        }

        .welcome-bg {
            position: absolute;
            right: 40px;
            top: 50%;
            transform: translateY(-50%);
            width: 240px;
            opacity: 0.8;
            z-index: 1;

            img {
                width: 100%;
                height: auto;
            }
        }
    }

    .dashboard-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 24px;

        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: 600;
            font-size: 16px;
        }

        .status-content {
            .status-item {
                display: flex;
                justify-content: space-between;
                padding: 12px 0;
                border-bottom: 1px solid var(--el-border-color-lighter);

                &:last-child {
                    border-bottom: none;
                }

                .label {
                    color: var(--el-text-color-secondary);
                }

                .value {
                    color: var(--el-text-color-primary);
                    font-weight: 500;
                }
            }
        }

        .quick-links {
            display: flex;
            justify-content: space-around;
            padding: 12px 0;

            .link-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 12px;
                cursor: pointer;
                transition: all 0.3s;

                &:hover {
                    transform: translateY(-4px);
                    color: var(--el-color-primary);
                }

                .icon-box {
                    width: 48px;
                    height: 48px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                    color: white;

                    &.blue {
                        background-color: #1890ff;
                    }

                    &.green {
                        background-color: #52c41a;
                    }

                    &.purple {
                        background-color: #722ed1;
                    }
                }

                span {
                    font-size: 14px;
                }
            }
        }

        .announcement-list {
            .announcement-item {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px 0;
                border-bottom: 1px solid var(--el-border-color-lighter);

                &:last-child {
                    border-bottom: none;
                }

                .dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background-color: var(--el-color-primary);
                }

                .text {
                    flex: 1;
                    font-size: 14px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .date {
                    font-size: 12px;
                    color: var(--el-text-color-secondary);
                }
            }
        }
    }
}
</style>
