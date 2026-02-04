# modal-management Specification

## Purpose
TBD - created by archiving change add-use-modal-composable. Update Purpose after archive.
## Requirements
### Requirement: 命令式弹窗打开

系统 SHALL 提供 `useModal` 可组合函数,允许开发者通过命令式 API 打开弹窗。

#### Scenario: 基本弹窗打开

- **WHEN** 开发者调用 `modal.open(Component, options)`
- **THEN** 系统应该:
  - 创建新的弹窗实例
  - 渲染传入的业务组件
  - 显示 Element Plus Dialog
  - 返回弹窗实例的控制对象

#### Scenario: 传递 props 到业务组件

- **WHEN** 开发者调用 `modal.open(Component, { params: { id: 1, name: 'test' } })`
- **THEN** 业务组件应该能够通过 `defineProps` 接收到 `id` 和 `name` 属性

#### Scenario: 配置 Dialog 选项

- **WHEN** 开发者调用 `modal.open(Component, { params: { id: 1 }, title: '标题', width: '800px', closeOnClickModal: false })`
- **THEN** Element Plus Dialog 应该:
  - 显示标题为 "标题"
  - 宽度为 800px
  - 点击遮罩不关闭弹窗

#### Scenario: 注册回调函数

- **WHEN** 开发者调用 `modal.open(Component, { params: { id: 1 }, title: '标题', onOk: (data) => {}, onClose: () => {} })`
- **THEN** 系统应该:
  - 保存 onOk 和 onClose 回调函数
  - 当业务组件调用 `handleOk(data)` 时,触发 onOk 回调并传递 data
  - 当业务组件调用 `handleClose()` 时,触发 onClose 回调

### Requirement: 命令式弹窗关闭

系统 SHALL 允许从父组件或业务组件内部关闭弹窗。

#### Scenario: 父组件关闭弹窗

- **WHEN** 父组件调用 `modal.close()`
- **THEN** 系统应该:
  - 关闭最近打开的弹窗
  - 从弹窗实例列表中移除该实例
  - 销毁业务组件

#### Scenario: 业务组件内部关闭弹窗

- **WHEN** 业务组件调用 `useModalContext().handleClose()`
- **THEN** 系统应该:
  - 关闭当前弹窗
  - 卸载应用实例
  - 移除 DOM 元素

#### Scenario: 通过 Dialog 关闭按钮关闭

- **WHEN** 用户点击 Dialog 右上角的关闭按钮
- **THEN** 系统应该:
  - 关闭当前弹窗
  - 从弹窗实例列表中移除该实例
  - 销毁业务组件

### Requirement: Loading 状态控制

系统 SHALL 支持控制弹窗的 loading 状态。

#### Scenario: 确认按钮 loading

- **WHEN** 业务组件调用 `useModalContext().toggleConfirmLoading(true)`
- **THEN** 系统应该:
  - 在确认按钮上显示 loading 状态
  - 禁用确认按钮

#### Scenario: 内容区 loading

- **WHEN** 业务组件调用 `useModalContext().toggleLoading(true)`
- **THEN** 系统应该:
  - 在弹窗内容区显示 loading 遮罩
  - 禁用用户交互

#### Scenario: 取消 loading

- **WHEN** 调用 `toggleConfirmLoading(false)` 或 `toggleLoading(false)`
- **THEN** 系统应该:
  - 移除对应的 loading 状态
  - 恢复用户交互

### Requirement: 嵌套弹窗支持

系统 SHALL 支持在弹窗内再打开新的弹窗。

#### Scenario: 弹窗内打开新弹窗

- **WHEN** 业务组件内调用 `useModal().open(AnotherComponent)`
- **THEN** 系统应该:
  - 创建新的弹窗实例
  - 新弹窗显示在原弹窗之上
  - 两个弹窗独立管理,互不干扰

#### Scenario: 关闭子弹窗

- **WHEN** 关闭子弹窗
- **THEN** 系统应该:
  - 只关闭子弹窗
  - 父弹窗保持打开状态

#### Scenario: 层级管理

- **WHEN** 打开多个嵌套弹窗
- **THEN** Element Plus Dialog 应该自动管理 z-index,确保最新打开的弹窗在最上层

### Requirement: Element Plus Dialog 配置支持

系统 SHALL 支持 Element Plus Dialog 组件的所有原生配置项。

#### Scenario: 常用配置项

- **WHEN** 开发者传入以下配置:
  - `title`: 标题
  - `width`: 宽度
  - `top`: 距离顶部距离
  - `modal`: 是否需要遮罩层
  - `closeOnClickModal`: 点击遮罩是否关闭
  - `closeOnPressEscape`: 按 ESC 是否关闭
  - `showClose`: 是否显示关闭按钮
- **THEN** 这些配置应该正确传递给 Element Plus Dialog 组件

#### Scenario: 自定义类名和样式

- **WHEN** 开发者传入 `customClass` 或 `modalClass`
- **THEN** 这些类名应该正确应用到 Dialog 元素上

### Requirement: 默认配置

系统 SHALL 提供合理的默认配置。

#### Scenario: 使用默认配置

- **WHEN** 开发者调用 `modal.open(Component)` 不传入任何配置
- **THEN** 系统应该使用以下默认值:
  - `width`: '50%'
  - `closeOnClickModal`: true
  - `closeOnPressEscape`: true
  - `showClose`: true
  - `destroyOnClose`: true

### Requirement: 业务组件控制接口

系统 SHALL 向业务组件提供 `useModalContext` 可组合函数以控制当前弹窗。

#### Scenario: 获取控制方法

- **WHEN** 业务组件调用 `useModalContext()`
- **THEN** 应该返回包含以下方法的对象:
  - `onConfirm(handler)`: 注册确认按钮点击回调
  - `onClose(handler)`: 注册关闭按钮点击回调
  - `handleOk(data)`: 确认并关闭弹窗,触发父组件的 onOk 回调
  - `handleClose()`: 取消并关闭弹窗,触发父组件的 onClose 回调
  - `toggleConfirmLoading(flag)`: 控制确认按钮 loading 状态
  - `toggleLoading(flag)`: 控制内容区 loading 状态

#### Scenario: 注册确认回调

- **WHEN** 业务组件调用 `onConfirm(() => { /* 业务逻辑 */ })`
- **THEN** 当用户点击确认按钮时,应该执行注册的回调函数而不是直接关闭弹窗

#### Scenario: 非弹窗场景使用

- **WHEN** 业务组件在非弹窗场景调用 `useModalContext()`
- **THEN** 应该返回 undefined 或空对象,业务组件需要判断其存在性

