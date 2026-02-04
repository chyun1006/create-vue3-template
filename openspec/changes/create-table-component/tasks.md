# 实现任务清单

## 1. 核心实现 - useTable Composable

- [x] 1.1 创建 `src/components/ui/c-table/useTable.js`
  - [x] 1.1.1 定义状态管理
    - [x] `loading` - 加载状态
    - [x] `tableData` - 表格数据
    - [x] `current` - 当前页码
    - [x] `pageSize` - 每页条数
    - [x] `total` - 总条数
  - [x] 1.1.2 实现数据源处理
    - [x] 检测数据源类型(Array vs Function/Promise)
    - [x] 数组数据源:实现本地分页逻辑
    - [x] Promise 数据源:实现远程请求和分页
  - [x] 1.1.3 实现核心方法
    - [x] `query()` - 查询数据(支持参数合并)
    - [x] `handleSizeChange(size)` - 每页条数变化
    - [x] `handleCurrentChange(page)` - 页码变化
    - [x] `handleSelectionChange(selection)` - 多选变化
    - [x] `setLocalDatasource(data)` - 设置本地数据源
    - [x] `getSelection()` - 获取选中行
    - [x] `changeCurrentPage(page)` - 编程式切换页码
    - [x] `getState()` - 获取当前状态
  - [x] 1.1.4 实现自动查询逻辑
    - [x] 根据 `autoQuery` prop 决定是否自动查询
    - [x] 监听 `dataSource` 变化
  - [x] 1.1.5 实现数据格式化
    - [x] 支持 `formatFunc` 自定义数据处理
    - [x] 支持 `isNewTable` 标准数据结构
    - [x] 兼容旧数据结构

## 2. 组件完善

- [x] 2.1 验证 `c-table/index.vue` 集成
  - [x] 确认 props 定义完整
  - [x] 确认事件发射正确
  - [x] 确认方法暴露完整
- [x] 2.2 验证 `table-column.vue` 功能
  - [x] 嵌套列支持
  - [x] 插槽传递
  - [x] 自定义表头

## 3. 示例和文档

- [x] 3.1 创建示例页面 `src/views/demo/table.vue`
  - [x] 3.1.1 基本用法示例
    - [x] 数组数据源 + 本地分页
    - [x] Promise 数据源 + 远程分页
  - [x] 3.1.2 高级功能示例
    - [x] 自定义列内容(插槽)
    - [x] 自定义表头(插槽)
    - [x] 多选功能
    - [x] 展开行
    - [x] 嵌套列
  - [x] 3.1.3 API 演示
    - [x] 手动刷新数据
    - [x] 获取选中行
    - [x] 编程式切换页码
- [x] 3.2 添加路由配置
  - [x] 在 `router.config.js` 中添加 `/demo/table` 路由
- [x] 3.3 创建 README 或使用文档
  - [x] API 文档
  - [x] Props 说明
  - [x] 事件说明
  - [x] 方法说明
  - [x] 使用示例

## 4. 测试验证

- [x] 4.1 功能测试
  - [x] 数组数据源正常显示和分页
  - [x] Promise 数据源正常请求和分页
  - [x] 切换每页条数时重新请求
  - [x] 切换页码时重新请求
  - [x] Loading 状态正确显示
  - [x] 多选功能正常工作
  - [x] 展开行功能正常工作
  - [x] 自定义列内容插槽正常渲染
  - [x] 自定义表头插槽正常渲染
  - [x] 嵌套列的插槽正确传递
- [x] 4.2 边界测试
  - [x] 空数据处理
  - [x] 请求失败处理
  - [x] 数据源切换(数组 ↔ Promise)
  - [x] 单页数据时分页隐藏(根据 `showOnePage`)
- [x] 4.3 性能测试
  - [x] 大数据量本地分页性能
  - [x] 避免重复请求
