# c-table 组件使用指南

`c-table` 是对 Element Plus `el-table` 的高度封装，集成了数据请求、分页处理、多选等常用功能。

## 基础用法

通过 `columns` 配置列，`dataSource` 传入数据。

```vue
<c-table 
  :columns="columns" 
  :dataSource="tableData" 
  :pagination="true" 
/>
```

## 列配置 (Columns)

`columns` 数组项支持的属性：

- `prop`: 对应数据字段
- `label`: 表头名称
- `width`: 列宽
- `format`: (可选) 格式化函数

## 数据源 (DataSource)

`dataSource` 支持两种格式：

1. **数组 (Array)**：静态数据，组件将自动进行本地分页。
2. **函数 (Promise)**：动态数据，组件在初始化和分页切换时会自动调用该函数。

```javascript
// Promise 数据源示例
const fetchData = async (params) => {
  const { current, pageSize } = params
  const [err, res] = await to(queryList({ page: current, size: pageSize }))
  return {
    data: res?.list || [],
    totalCount: res?.total || 0
  }
}
```

## 插槽 (Slots)

- **自定义列内容**：`#字段名="{ row }"`
- **自定义表头**：`#字段名Header`
- **展开行**：`#expand="{ props }"`

## 核心方法 (Ref 调用)

通过 `ref` 可以调用以下常用方法：

- `query()`: 刷新表格数据（回到第一页）。
- `reload()`: 重新加载当前页数据。
- `getSelection()`: 获取已选中的行。
- `getState()`: 获取当前分页状态。
