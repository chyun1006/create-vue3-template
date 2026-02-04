# 设计文档: useModal 可组合函数

## Context

`useModal` 可组合函数需要在 Vue 3 应用中提供命令式的弹窗管理能力。核心挑战包括:

1. **状态管理**: 需要在全局范围内管理多个弹窗实例的状态
2. **组件通信**: 业务组件需要能够控制自己所在的弹窗
3. **嵌套支持**: 弹窗内打开的弹窗需要正确的层级管理
4. **配置传递**: 需要完整支持 Element Plus Dialog 的所有配置项

## Goals / Non-Goals

**Goals:**

- 提供简洁的命令式 API: `modal.open(Component, options)`
- 支持嵌套弹窗,自动管理层级
- 业务组件可通过 props 或 inject 获取控制方法
- 支持 Element Plus Dialog 的所有原生配置
- 提供合理的默认配置

**Non-Goals:**

- 不提供全局配置注入(使用本地默认配置即可)
- 不支持非 Element Plus 的其他 UI 库
- 不处理复杂的权限控制(由业务组件自行处理)

## Decisions

### 1. 架构设计

**决策**: 使用 **createApp 独立应用实例** 模式

- 每次打开弹窗时,使用 `createApp` 创建独立的 Vue 应用实例
- 将弹窗挂载到动态创建的 DOM 元素上
- 通过 `Object.assign(childApp._context, appContext)` 继承父应用的上下文(plugins, directives 等)
- 关闭弹窗时 `unmount` 并移除 DOM 元素

**理由**:

- **完全隔离**: 每个弹窗是独立的 Vue 应用,不会相互干扰
- **上下文继承**: 可以访问父应用的 Pinia store, router, directives 等
- **内存管理**: 关闭时完全销毁,避免内存泄漏
- **简单直接**: 不需要全局容器组件,代码更简洁

**参考实现**: 基于用户提供的 `useFunctionalModal` 实现方案

**替代方案**:

- ❌ 全局容器 + 响应式状态: 需要额外的容器组件,状态管理更复杂
- ❌ Teleport 到 body: 需要在每个使用处写 Teleport,代码重复

### 2. 业务组件通信方式

**决策**: 使用 **inject/provide 上下文注入**

通过 `provide` 注入 `useModalContext`,业务组件使用 `inject` 获取控制方法:

```javascript
// useModal 内部
const context = {
  onConfirm: (handler) => { /* 注册确认回调 */ },
  onClose: (handler) => { /* 注册关闭回调 */ },
  handleOk: (data) => { /* 确认并关闭 */ },
  handleClose: () => { /* 取消并关闭 */ },
  toggleConfirmLoading: (flag) => { /* 确认按钮 loading */ },
  toggleLoading: (flag) => { /* 内容区 loading */ },
}
provide(MODAL_CONTEXT, context)

// 业务组件内
const { handleOk, toggleLoading } = useModalContext() || {}
```

**理由**:

- **灵活性**: 业务组件可以选择性使用需要的方法
- **解耦**: 不需要在 props 中定义,业务组件更纯粹
- **可选性**: 业务组件在非弹窗场景也能正常使用
- **符合 Vue 3 最佳实践**: inject/provide 是官方推荐的跨层级通信方式

**替代方案**:

- ❌ props 注入: 业务组件必须定义 modalControl prop,耦合度高
- ❌ emit 事件: 需要在容器组件监听,增加复杂度

### 3. 嵌套弹窗处理

**决策**: **依赖 Element Plus 自动层级管理**

Element Plus Dialog 组件内置了 z-index 管理,每次打开新弹窗会自动递增 z-index。

**理由**:

- Element Plus 已经处理好层级问题
- 无需手动管理 z-index
- 减少代码复杂度

### 4. API 设计

**决策**: 扁平化配置对象

```javascript
const modal = useModal()

// 打开弹窗 - 所有配置扁平化在一个对象中
modal.open(MyComponent, {
  // 业务组件 props
  params: { id: 1, name: 'test' },
  
  // Dialog 配置
  title: '编辑用户',
  width: '600px',
  closeOnClickModal: false,
  // ... 其他 Element Plus Dialog 配置
  
  // 回调函数(可选)
  onOk: (data) => { console.log('确认', data) },
  onClose: () => { console.log('取消') }
})

// 关闭弹窗
modal.close()
```

**业务组件内使用**:

```javascript
// 获取控制方法
const context = useModalContext()
const { onConfirm, onClose, handleOk, handleClose, toggleLoading } = context || {}

// 方式1: 注册确认回调
onConfirm?.(() => {
  toggleLoading?.(true)
  // 执行业务逻辑
  api.save().then(() => {
    handleOk?.({ success: true }) // 触发 onOk 回调并关闭
  })
})

// 方式2: 直接调用
const handleSubmit = () => {
  handleOk?.({ data: formData })
}
```

**理由**:

- **扁平化配置**: 所有参数在一个对象中,更简洁直观
- **params 字段**: 明确区分业务组件的 props 和 Dialog 配置
- **简化命名**: `onConfirm` 比 `onClickConfirm` 更简洁
- **灵活性高**: 可以传递任意 Dialog 配置和回调函数

**默认行为**:

- 如果业务组件没有注册 `onConfirm`,点击确认按钮直接关闭弹窗
- 如果注册了回调,由业务组件决定何时调用 `handleOk` 关闭弹窗

## Implementation Details

### 核心流程

1. **打开弹窗**:
   - 创建 DOM 元素并添加到 body
   - 使用 `createApp` 创建独立应用实例
   - 继承父应用上下文 (`appContext`)
   - 通过 `provide` 注入 `modalContext`
   - 使用 `h()` 函数渲染 Dialog 和业务组件
   - 挂载应用实例

2. **业务组件交互**:
   - 业务组件通过 `useModalContext()` 获取控制方法
   - 可选择注册确认/取消回调,或直接调用 `handleOk/handleClose`

3. **关闭弹窗**:
   - 调用 `childApp.unmount()` 卸载应用
   - 移除 DOM 元素
   - 触发回调函数(如果有)

### 数据结构

```javascript
// modalContext 对象
{
  onConfirm: (handler) => void,          // 注册确认按钮回调
  onClose: (handler) => void,            // 注册关闭按钮回调
  handleOk: (data) => void,              // 确认并关闭,触发 onOk 回调
  handleClose: () => void,               // 取消并关闭,触发 onClose 回调
  toggleConfirmLoading: (flag) => void,  // 控制确认按钮 loading
  toggleLoading: (flag) => void,         // 控制内容区 loading
}
```

### 文件结构

```text
src/
└── composables/
    └── useModal.js          # 包含 useModal 和 useModalContext 两个导出
```

**注意**: 不再需要 `ModalContainer.vue` 组件,也不需要在 `main.js` 中注册

## Risks / Trade-offs

### 风险 1: 上下文继承问题

**风险**: `Object.assign(childApp._context, appContext)` 使用了 Vue 内部 API,可能在 Vue 版本升级时失效

**缓解措施**:

- 这是 Vue 3 中常见的做法,社区广泛使用
- 如果未来 Vue 版本改变,可以通过手动注册 plugins 和 directives 替代
- 在文档中说明此依赖,便于后续维护

### 风险 2: 内存泄漏

**风险**: 如果业务组件持有大量数据或定时器,关闭弹窗后未及时清理可能导致内存泄漏

**缓解措施**:

- 使用 `destroyOnClose: true` 确保 Dialog 关闭时销毁内容
- 调用 `unmount()` 完全卸载应用实例
- 在文档中提醒开发者在业务组件的 `onBeforeUnmount` 中清理资源

### 风险 3: Dialog 组件依赖

**风险**: 当前方案直接使用 Element Plus Dialog,如果需要自定义 Dialog 组件需要修改代码

**缓解措施**:

- 初期使用 Element Plus Dialog 满足大部分需求
- 如果后续需要自定义,可以通过配置参数支持传入自定义 Dialog 组件

## Migration Plan

无需迁移,这是新增功能,不影响现有代码。

## Open Questions

无
