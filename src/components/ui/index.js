/**
 * 自动注册 components/ui 目录下的所有组件
 * 组件将以 PascalCase 形式全局注册
 * 例如: c-card.vue -> CCard, c-upload/index.vue -> CUpload
 */

export default {
    install(app) {
        // 使用 Vite 的 import.meta.glob 自动导入所有 .vue 文件
        const components = import.meta.glob('./**/*.vue', { eager: true })

        Object.entries(components).forEach(([path, module]) => {
            const parts = path.split('/')
            const fileName = parts.pop().replace(/\.\w+$/, '')

            // 如果文件名是 index，则使用父目录名作为组件名
            // 例如: ./c-upload/index.vue -> c-upload
            // 否则使用文件名: ./c-card.vue -> c-card
            const componentName = fileName === 'index' ? parts.pop() : fileName

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
