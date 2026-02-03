<template>
    <div class="main-layout">
        <sidebar />

        <div class="main-container" :class="{ expanded: isCollapsed }">
            <app-header />

            <div class="content-wrapper">
                <router-view />
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'
import Sidebar from '@/components/Sidebar.vue'
import AppHeader from '@/components/Header.vue'

const appStore = useAppStore()
const isCollapsed = computed(() => appStore.sidebarCollapsed)
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
        transition: width 0.3s;
        overflow: hidden;
        background-color: $bg-page;

        &.expanded {
            width: calc(100% - 64px);
        }

        .content-wrapper {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            @include scrollbar-style;
        }
    }
}
</style>
