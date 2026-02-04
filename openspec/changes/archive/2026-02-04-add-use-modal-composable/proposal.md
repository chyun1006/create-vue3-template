# Change: 新增 useModal 可组合函数

## Why

当前项目缺少统一的弹窗管理方案,每次需要弹窗时都要在组件中手动管理 `visible` 状态和 Dialog 组件。这导致:

- 代码重复,每个弹窗都需要重复编写状态管理逻辑
- 嵌套弹窗难以管理,需要手动处理多层状态
- 业务组件与弹窗逻辑耦合,不利于组件复用

通过提供命令式的 `useModal` 可组合函数,可以简化弹窗的使用,提升开发效率和代码可维护性。

## What Changes

- 新增 `src/composables/useModal.js` 可组合函数
  - 导出 `useModal()` - 用于打开/关闭弹窗
  - 导出 `useModalContext()` - 业务组件内获取控制方法
- 支持以下核心功能:
  - 命令式 API 打开/关闭弹窗
  - 支持传递任意业务组件到弹窗中
  - 支持嵌套弹窗(弹窗内再打开弹窗)
  - 支持 Element Plus Dialog 的所有配置项
  - 业务组件通过 `useModalContext()` 控制弹窗的关闭、loading 状态
  - 支持确认/取消回调函数,获取业务组件返回的数据
  - 提供默认配置,无需全局配置
- 使用 `createApp` 创建独立应用实例,每个弹窗完全隔离
- 通过 `inject/provide` 实现业务组件与弹窗的通信

## Impact

- **新增能力**: `modal-management` - 弹窗管理能力
- **影响文件**:
  - 新增: `src/composables/useModal.js` (包含 useModal 和 useModalContext)
  - 可选: 更新示例页面 `src/views/demo/modal.vue` 展示用法
- **向后兼容**: 完全兼容,不影响现有代码
- **依赖**: 依赖 Element Plus Dialog 组件(已安装)
