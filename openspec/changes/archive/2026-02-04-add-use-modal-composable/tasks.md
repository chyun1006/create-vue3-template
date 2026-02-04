# 实现任务清单

## 1. 核心实现

- [x] 1.1 创建 `src/composables/useModal.js` 文件
  - [x] 1.1.1 实现 `useModal()` 可组合函数
    - [x] 获取当前组件实例的 `appContext`
    - [x] 实现 `open(component, options)` 方法(扁平化配置对象)
    - [x] 实现 `close()` 方法
    - [x] 使用 `createApp` 创建独立应用实例
    - [x] 使用 `h()` 函数渲染 Dialog 和业务组件
    - [x] 继承父应用上下文
    - [x] 在 `onBeforeUnmount` 时清理资源
  - [x] 1.1.2 实现 `modalContext` 对象
    - [x] `onConfirm(handler)` - 注册确认按钮回调
    - [x] `onClose(handler)` - 注册关闭按钮回调
    - [x] `handleOk(data)` - 确认并关闭,触发 onOk 回调
    - [x] `handleClose()` - 取消并关闭,触发 onClose 回调
    - [x] `toggleConfirmLoading(flag)` - 控制确认按钮 loading
    - [x] `toggleLoading(flag)` - 控制内容区 loading
  - [x] 1.1.3 实现 `useModalContext()` 可组合函数
    - [x] 使用 `inject` 获取 modalContext
    - [x] 返回所有控制方法
  - [x] 1.1.4 配置默认值
    - [x] Dialog 默认宽度、关闭行为等
  - [x] 1.1.5 从 options 中提取 `params` 字段传递给业务组件

## 2. 示例和文档

- [x] 2.1 更新 `src/views/demo/modal.vue` 创建使用示例
  - [x] 2.1.1 基本用法示例
  - [x] 2.1.2 嵌套弹窗示例
  - [x] 2.1.3 业务组件使用 `useModalContext` 示例
  - [x] 2.1.4 确认/取消回调示例
  - [x] 2.1.5 Loading 状态控制示例
  - [x] 2.1.6 自定义 Dialog 配置示例

## 3. 测试验证

- [x] 3.1 验证基本打开/关闭功能
- [x] 3.2 验证嵌套弹窗功能
- [x] 3.3 验证确认按钮 loading 状态
- [x] 3.4 验证内容区 loading 状态
- [x] 3.5 验证 Element Plus Dialog 配置项传递
- [x] 3.6 验证业务组件内部控制弹窗
- [x] 3.7 验证确认/取消回调函数
- [x] 3.8 验证多个弹窗同时打开的场景
- [x] 3.9 验证上下文继承(Pinia store, directives 等)
