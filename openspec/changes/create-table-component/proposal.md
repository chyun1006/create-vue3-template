# 创建表格组件

## 问题陈述

当前项目中已有 `c-table` 组件的基础结构,但缺少核心的 `useTable` composable 实现,导致组件无法正常工作。开发者需要一个功能完整的表格组件来:

1. **简化表格开发**:通过 JSON 配置列定义,避免重复编写模板代码
2. **统一数据处理**:支持数组和 Promise 两种数据源,自动处理加载状态
3. **内置分页功能**:自动管理分页状态和数据请求
4. **灵活扩展**:支持自定义列渲染、多选、展开行等常见场景

## 当前状态

项目中已存在 `/src/components/ui/c-table/` 目录,包含:

- `index.vue` - 表格组件主文件(已实现模板和基础逻辑)
- `table-column.vue` - 列组件(支持嵌套列)
- **缺失**: `useTable.js` - 核心数据管理逻辑

现有组件已实现的功能:

- ✅ 基于 Element Plus `el-table` 的二次封装
- ✅ 支持通过 `columns` prop 配置列
- ✅ 支持多选、序号列、展开行
- ✅ 分页 UI 组件
- ❌ **缺少数据源管理逻辑**(useTable)

## 提议的解决方案

### 核心变更

1. **实现 `useTable` composable**
   - 管理表格数据状态(loading, tableData, pagination)
   - 处理数组和 Promise 数据源
   - 提供数据查询、刷新、分页控制方法

2. **完善组件功能**
   - 确保 `c-table` 组件与 `useTable` 正确集成
   - 支持本地分页和远程分页两种模式
   - 提供完整的方法暴露(query, refresh, getSelection 等)

### 设计原则

- **声明式配置**:通过 JSON 配置列,减少模板代码
- **自动化处理**:自动管理 loading 状态和错误处理
- **灵活性**:支持插槽自定义列内容和表头
- **类型安全**:提供清晰的 TypeScript 类型定义(可选)

## 范围

### 包含

- ✅ 实现 `useTable.js` composable
- ✅ 支持数组数据源(本地分页)
- ✅ 支持 Promise 数据源(远程分页)
- ✅ 分页状态管理
- ✅ 多选功能支持
- ✅ 示例页面和文档

### 不包含

- ❌ 表格编辑功能
- ❌ 树形表格
- ❌ 虚拟滚动
- ❌ 导出功能

## 影响分析

### 新增文件

- `src/components/ui/c-table/useTable.js` - 核心 composable
- `src/views/demo/table.vue` - 示例页面

### 修改文件

- `src/components/ui/c-table/index.vue` - 可能需要微调
- `src/config/router.config.js` - 添加示例路由

### 依赖关系

- 依赖 Element Plus `el-table` 和 `el-pagination`
- 无其他外部依赖

## 验收标准

1. ✅ 支持数组数据源,自动实现本地分页
2. ✅ 支持 Promise 数据源,自动请求和分页
3. ✅ 分页切换时自动重新请求数据
4. ✅ 提供 loading 状态管理
5. ✅ 支持多选并提供 `getSelection` 方法
6. ✅ 提供 `query` 方法手动刷新数据
7. ✅ 示例页面展示所有核心功能

## 实现计划

1. **Phase 1**: 实现 `useTable` composable
2. **Phase 2**: 完善组件集成和测试
3. **Phase 3**: 创建示例页面和文档
