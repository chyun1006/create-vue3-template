# table-component Specification

## Purpose

定义表格组件的功能需求和行为规范,确保组件能够满足常见的数据展示和交互场景。

## ADDED Requirements

### Requirement: 数据源支持

系统 SHALL 支持数组和 Promise 两种数据源类型。

#### Scenario: 数组数据源

- **WHEN** 开发者传入数组类型的 `dataSource`
- **THEN** 系统应该:
  - 直接使用数组数据渲染表格
  - 实现本地分页逻辑
  - 不发起网络请求
  - `total` 等于数组长度

#### Scenario: Promise 数据源

- **WHEN** 开发者传入函数类型的 `dataSource`
- **THEN** 系统应该:
  - 自动调用函数获取数据
  - 传入当前分页参数 `{ current, pageSize }`
  - 显示 loading 状态
  - 从响应中提取数据和总数
  - 更新表格显示

#### Scenario: 数据源切换

- **WHEN** `dataSource` prop 从数组切换为函数(或相反)
- **THEN** 系统应该:
  - 检测数据源类型变化
  - 重置分页状态
  - 使用新的数据源重新加载数据

### Requirement: 列配置

系统 SHALL 支持通过 JSON 配置列定义。

#### Scenario: 基础列配置

- **WHEN** 开发者传入 `columns` 数组
- **THEN** 每个列配置应该支持:
  - `prop`: 字段名(必需)
  - `label`: 列标题(必需)
  - `width`: 列宽
  - `align`: 对齐方式
  - `fixed`: 固定列位置
  - `sortable`: 是否可排序
  - `showOverflowTooltip`: 是否显示溢出提示

#### Scenario: 嵌套列

- **WHEN** 列配置包含 `children` 属性
- **THEN** 系统应该:
  - 递归渲染子列
  - 支持多级嵌套
  - 正确传递插槽到子列

#### Scenario: 自定义列内容

- **WHEN** 开发者提供与 `prop` 同名的插槽
- **THEN** 系统应该:
  - 使用插槽内容渲染该列
  - 传递 `row`, `column`, `index` 参数到插槽
  - 保持列配置的其他属性(width, align 等)有效

#### Scenario: 自定义表头

- **WHEN** 开发者提供 `prop + 'Header'` 命名的插槽
- **THEN** 系统应该:
  - 使用插槽内容渲染该列的表头
  - 替换默认的 `label` 显示
  - 支持在表头中添加图标、提示等自定义元素

**示例**:

```vue
<!-- 列配置 -->
{ prop: 'status', label: '状态' }

<!-- 自定义表头 -->
<template #statusHeader>
  <el-icon><InfoFilled /></el-icon>
  <span>状态信息</span>
</template>

<!-- 自定义列内容 -->
<template #status="{ row }">
  <el-tag>{{ row.status }}</el-tag>
</template>
```

#### Scenario: 嵌套列的插槽传递

- **WHEN** 嵌套列中的子列使用插槽
- **THEN** 系统应该:
  - 正确传递插槽到子列组件
  - 支持子列的表头和内容插槽
  - 保持插槽参数的正确性

### Requirement: 分页功能

系统 SHALL 提供完整的分页支持。

#### Scenario: 远程分页

- **WHEN** 数据源为 Promise 且 `pagination` 为 true
- **THEN** 系统应该:
  - 显示分页组件
  - 切换页码时重新请求数据
  - 切换每页条数时重置到第一页并请求
  - 从响应中提取 `total`

#### Scenario: 本地分页

- **WHEN** 数据源为数组或 `useLocalPagination` 为 true
- **THEN** 系统应该:
  - 显示分页组件
  - 切换页码时重新计算数据切片
  - 不发起网络请求
  - `total` 为数组总长度

#### Scenario: 禁用分页

- **WHEN** `pagination` 为 false
- **THEN** 系统应该:
  - 不显示分页组件
  - 显示所有数据(数组)或单页数据(Promise)

#### Scenario: 单页数据隐藏分页

- **WHEN** `showOnePage` 为 false 且数据总数小于等于 `pageSize`
- **THEN** 系统应该:
  - 隐藏分页组件
  - 正常显示数据

### Requirement: Loading 状态

系统 SHALL 自动管理加载状态。

#### Scenario: 请求开始

- **WHEN** 调用 Promise 数据源
- **THEN** 系统应该:
  - 设置 `loading` 为 true
  - 在表格上显示 loading 遮罩

#### Scenario: 请求完成

- **WHEN** Promise resolve 或 reject
- **THEN** 系统应该:
  - 设置 `loading` 为 false
  - 移除 loading 遮罩

#### Scenario: 外部控制 loading

- **WHEN** 开发者传入 `spining` prop
- **THEN** 系统应该:
  - 使用外部 loading 状态
  - 覆盖内部 loading 状态

### Requirement: 多选功能

系统 SHALL 支持行多选。

#### Scenario: 启用多选

- **WHEN** `checkable` 为 true
- **THEN** 系统应该:
  - 显示多选列
  - 支持全选/取消全选
  - 触发 `selection-change` 事件

#### Scenario: 禁用某些行

- **WHEN** 数据行包含 `disabled: true`
- **THEN** 该行的多选框应该:
  - 显示为禁用状态
  - 无法被选中

#### Scenario: 获取选中行

- **WHEN** 调用 `getSelection()` 方法
- **THEN** 应该返回:
  - 当前选中的所有行数据
  - 数组格式

### Requirement: 序号列

系统 SHALL 支持自动序号列。

#### Scenario: 显示序号

- **WHEN** `indexable` 为 true
- **THEN** 系统应该:
  - 在第一列显示序号
  - 序号从 1 开始
  - 跨页时序号连续(考虑分页)

#### Scenario: 序号计算

- **WHEN** 当前页为第 2 页,每页 10 条
- **THEN** 第一行序号应该为:
  - `(current - 1) * pageSize + 1 = 11`

#### Scenario: 固定序号列

- **WHEN** `indexFixed` 为 'left' 或 'right'
- **THEN** 序号列应该:
  - 固定在指定位置
  - 滚动时保持可见

### Requirement: 展开行

系统 SHALL 支持行展开功能。

#### Scenario: 启用展开

- **WHEN** `expend` 为 true
- **THEN** 系统应该:
  - 显示展开列
  - 提供 `expand` 插槽
  - 支持展开/收起切换

#### Scenario: 数据更新时收起

- **WHEN** 表格数据更新
- **THEN** 系统应该:
  - 自动收起所有展开的行
  - 避免展开状态错乱

### Requirement: 数据格式化

系统 SHALL 支持多种数据格式。

#### Scenario: 标准格式

- **WHEN** `isNewTable` 为 true
- **THEN** 系统应该期望响应格式为:

  ```javascript
  {
    data: {
      list: [...],
      total: 100,
      pageNum: 1
    }
  }
  ```

#### Scenario: 旧格式

- **WHEN** `isNewTable` 为 false(默认)
- **THEN** 系统应该期望响应格式为:

  ```javascript
  {
    data: [...],
    totalCount: 100
  }
  ```

#### Scenario: 自定义格式

- **WHEN** 提供 `formatFunc` 函数
- **THEN** 系统应该:
  - 使用该函数处理响应
  - 函数应返回 `{ list, total, current }` 格式
  - 覆盖默认格式化逻辑

### Requirement: 查询控制

系统 SHALL 提供灵活的查询控制。

#### Scenario: 自动查询

- **WHEN** `autoQuery` 为 true(默认)
- **THEN** 系统应该:
  - 组件挂载时自动查询
  - `dataSource` 变化时自动查询

#### Scenario: 手动查询

- **WHEN** `autoQuery` 为 false
- **THEN** 系统应该:
  - 不自动查询
  - 等待调用 `query()` 方法
  - 适用于异步筛选条件场景

#### Scenario: 带参数查询

- **WHEN** 调用 `query({ status: 'active' })`
- **THEN** 系统应该:
  - 合并默认参数和传入参数
  - 重置到第一页
  - 发起请求

#### Scenario: 默认参数

- **WHEN** 提供 `defaultParams`
- **THEN** 每次查询应该:
  - 自动合并默认参数
  - 传入参数优先级更高

### Requirement: 方法暴露

系统 SHALL 暴露必要的控制方法。

#### Scenario: 暴露的方法

- **WHEN** 通过 ref 访问组件实例
- **THEN** 应该可以调用:
  - `query(params)` - 查询数据
  - `getSelection()` - 获取选中行
  - `changeCurrentPage(page)` - 切换页码
  - `getState()` - 获取当前状态
  - `clearSort()` - 清除排序
  - `changeLoading(flag)` - 控制 loading

#### Scenario: 获取状态

- **WHEN** 调用 `getState()`
- **THEN** 应该返回:

  ```javascript
  {
    current: 1,
    pageSize: 10,
    total: 100,
    loading: false
  }
  ```

### Requirement: 事件发射

系统 SHALL 发射必要的事件。

#### Scenario: 分页事件

- **WHEN** 用户切换页码或每页条数
- **THEN** 系统应该:
  - 发射 `currentChange` 事件(页码变化)
  - 发射 `sizeChange` 事件(每页条数变化)
  - 传递新的值作为参数

#### Scenario: 多选事件

- **WHEN** 用户选中/取消选中行
- **THEN** 系统应该:
  - 发射 `selection-change` 事件
  - 传递当前选中的所有行

### Requirement: 错误处理

系统 SHALL 优雅处理错误情况。

#### Scenario: 请求失败

- **WHEN** Promise 数据源 reject
- **THEN** 系统应该:
  - 关闭 loading 状态
  - 清空表格数据
  - 在控制台输出错误
  - 不崩溃

#### Scenario: 数据格式错误

- **WHEN** 响应数据格式不符合预期
- **THEN** 系统应该:
  - 使用默认值避免崩溃
  - 显示空表格
  - 在控制台输出警告

#### Scenario: 空数据

- **WHEN** 数据为空数组
- **THEN** 系统应该:
  - 显示空状态
  - 支持自定义空状态插槽
  - 隐藏分页(如果 `showOnePage` 为 false)
