/**
 * 自动注册 components/ui 目录下的所有组件
 * 组件将以 PascalCase 形式全局注册
 * 例如: c-card.vue -> CCard
 */

export default {
    install(app) {
        // 使用 Vite 的 import.meta.glob 自动导入所有 .vue 文件
        const components = import.meta.glob('./**/*.vue', { eager: true })

        Object.entries(components).forEach(([path, module]) => {
            // 从路径中提取文件名: ./c-card.vue -> c-card
            const componentName = path
                .split('/')
                .pop()
                .replace(/\.\w+$/, '')

            // 转换为 PascalCase: c-card -> CCard
            const pascalName = componentName
                .split('-')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join('')

            // 注册组件
            app.component(pascalName, module.default || module)
        })
    }
}
