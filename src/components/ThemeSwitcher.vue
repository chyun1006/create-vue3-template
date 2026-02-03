<template>
    <div class="theme-switcher">
        <el-dropdown @command="handleThemeChange">
            <el-button>
                <el-icon>
                    <Brush />
                </el-icon>
                <span class="ml-2">{{ currentThemeLabel }}</span>
            </el-button>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item v-for="(theme, key) in themes" :key="key" :command="key"
                        :class="{ 'is-active': currentTheme === key }">
                        {{ theme.label }}
                    </el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Brush } from '@element-plus/icons-vue'
import { themeManager, themes } from '@/utils/theme'
import { ElMessage } from 'element-plus'

const currentTheme = ref(themeManager.getCurrentTheme())

const currentThemeLabel = computed(() => {
    return themes[currentTheme.value]?.label || '主题'
})

const handleThemeChange = (themeName) => {
    themeManager.switchTheme(themeName)
    currentTheme.value = themeName
    ElMessage.success(`已切换到${themes[themeName].label}`)
}

onMounted(() => {
    themeManager.init()
})
</script>

<style lang="scss" scoped>
.theme-switcher {
    :deep(.el-dropdown-menu__item.is-active) {
        color: $primary-color;
        font-weight: 600;
    }
}

.ml-2 {
    margin-left: 0.5rem;
}
</style>
