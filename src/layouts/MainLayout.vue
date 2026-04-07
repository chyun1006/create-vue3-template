<template>
    <div class="main-layout">
        <sidebar />

        <div class="main-container" :class="{ expanded: isCollapsed }">
            <app-header />

            <div 
                class="content-wrapper" 
                v-loading="loading"
                :element-loading-text="loadingConfig.text"
                :element-loading-background="loadingConfig.background"
                :element-loading-spinner="loadingConfig.spinner"
                :element-loading-custom-class="loadingConfig.customClass"
            >
                <div class="content-scroller">
                    <router-view v-slot="{ Component, route }">
                        <keep-alive>
                            <component :is="Component" v-if="route.meta.keepAlive" :key="route.path" />
                        </keep-alive>
                        <component :is="Component" v-if="!route.meta.keepAlive" :key="route.path" />
                    </router-view>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'
import Sidebar from '@/components/Sidebar.vue'
import AppHeader from '@/components/Header.vue'
import { useLoading } from '@/composables/useLoading'

const appStore = useAppStore()
const isCollapsed = computed(() => appStore.sidebarCollapsed)
const { loading, loadingConfig } = useLoading()
</script>

<style lang="scss" scoped>
.main-layout {
    display: flex;
    width: 100%;
    height: 100vh;
    overflow: hidden;

    .main-container {
        flex: 1;
        display: flex;
        flex-direction: column;
        width: calc(100% - 256px);
        transition: width 0.28s cubic-bezier(0.4, 0, 0.2, 1);
        will-change: width;
        overflow: hidden;
        background-color: $bg-page;

        &.expanded {
            width: calc(100% - 64px);
        }

        .content-wrapper {
            flex: 1;
            overflow: hidden;
        }

        .content-scroller {
            height: 100%;
            padding: 20px;
            overflow-y: auto;
            overflow-x: hidden;
            @include scrollbar-style;
        }
    }
}
</style>
