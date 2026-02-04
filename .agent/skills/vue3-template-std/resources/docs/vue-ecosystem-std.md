# Vue 3 生态最佳实践指南

本指南整合了 Vue 3 生态系统的核心最佳实践，涵盖从组合式 API 到状态管理及测试的全方位指导。

## 1. Vue 3 与组合式 API (vue-best-practices)

- **响应式选择**：优先使用 `ref` 定义基本类型，`reactive` 仅用于深度嵌套且逻辑紧密的结构（如表单状态）。
- **性能优化**：对于大列表展示，使用 `shallowRef` 或 `shallowReactive` 减少嵌套追踪。
- **类型支持**：配合 TypeScript 使用 `defineProps<Props>()` 和 `defineEmits<Emits>()` 增强类型推导。

## 2. 选项式 API 适配 (vue-options-api-best-practices)

- **生命周期映射**：了解 `created` 对应 `setup` 代码，`mounted` 对应 `onMounted` 等。
- **Context 处理**：在选项式 API 中注意 `this` 指向，但在新开发中应逐步迁移至 `setup` 模式。

## 3. 路由管理 (vue-router-best-practices)

- **导航守卫**：将权限控制逻辑集中在 `router.beforeEach`。
- **动态路由**：深层次菜单或动态业务组件应通过异步路由加载以优化首屏。
- **生命周期**：注意 `onBeforeRouteUpdate` 在复用组件时的入参变化。

## 4. 状态管理 (vue-pinia-best-practices)

- **组合式 Store**：优先使用 `defineStore('id', () => { ... })` 风格定义 store。
- **响应式解构**：从 store 解构数据时必须使用 `storeToRefs` 保持响应性。

## 5. 测试规范 (vue-testing-best-practices)

- **单元测试**：使用 Vitest 和 Vue Test Utils 对 UI 逻辑和 Composable 工具函数进行测试。
- **E2E 测试**：使用 Playwright 覆盖核心流程。

## 6. JSX 使用指南 (vue-jsx-best-practices)

- **应用场景**：仅在高度动态渲染（如表格渲染器、抽象封装组件）中使用 JSX。
- **语法差异**：注意 `v-model` 和事件绑定的 JSX 写法差异。

## 7. 项目开发准则 (vue-development-guides)

- **组件拆分**：模版逻辑过重（建议超过 300 行）时，必须将逻辑紧密的部分抽离为子组件或单文件。
- **单向数据流**：Props 用于输入，Emit 用于输出，严禁子组件直接修改引用类型的 Props。

## 8. 调试与错误处理 (vue-debug-guides)

- **全局捕获**：使用 `app.config.errorHandler` 处理运行时错误。
- **异步错误**：网络请求统一使用 `to` 工具函数处理，确保报错信息可追溯。

## 9. 高复用性 Composable (create-adaptable-composable)

- **参数适配**：函数入参应支持 `MaybeRef<T>` 或 `MaybeRefOrGetter<T>` 以适配响应式变量和普通值。
- **SSR 友好**：避免在 Composable 顶层直接访问 DOM 元素，应在 `onMounted` 内进行处理。
