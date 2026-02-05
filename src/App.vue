<template>
    <el-config-provider :locale="zhCn">
        <div id="app">
            <router-view />
        </div>
    </el-config-provider>
</template>

<script setup>
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
</script>

<style lang="scss">
#app {
    width: 100%;
    height: 100%;
}
</style>
