# C-Table 表格组件

基于 Element Plus `el-table` 的二次封装表格组件,支持 JSON 配置列、数组/Promise 数据源、自动分页等功能。

## 特性

- ✅ **JSON 配置列**: 通过配置对象定义表格列,减少模板代码
- ✅ **双数据源**: 支持数组(本地分页)和 Promise(远程分页)
- ✅ **自动分页**: 自动管理分页状态和数据请求
- ✅ **自定义渲染**: 支持插槽自定义列内容和表头
- ✅ **多选功能**: 内置多选支持
- ✅ **展开行**: 支持行展开显示详细信息
- ✅ **嵌套列**: 支持多级表头
- ✅ **Loading 状态**: 自动管理加载状态

## 基本用法

### 数组数据源(本地分页)

```vue
<template>
    <c-table :columns="columns" :dataSource="users" :pagination="true" indexable />
</template>

<script setup>
const columns = [
    { prop: 'id', label: 'ID', width: '80' },
    { prop: 'name', label: '姓名', width: '120' },
    { prop: 'age', label: '年龄', width: '80' },
    { prop: 'email', label: '邮箱' }
]

const users = [
    { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
    { id: 2, name: '李四', age: 30, email: 'lisi@example.com' }
]
</script>
```

### Promise 数据源(远程分页)

```vue
<template>
    <c-table ref="tableRef" :columns="columns" :dataSource="fetchUsers" :pagination="true" />
</template>

<script setup>
import { ref } from 'vue'

const tableRef = ref()

const fetchUsers = (params) => {
    return api.getUsers({
        page: params.current,
        pageSize: params.pageSize
    })
}

// 手动刷新
const refresh = () => {
    tableRef.value?.query()
}
</script>
```

## API

### Props

| 参数               | 类型              | 默认值                                    | 说明                              |
| ------------------ | ----------------- | ----------------------------------------- | --------------------------------- |
| columns            | Array             | -                                         | 列配置数组                        |
| dataSource         | Array \| Function | -                                         | 数据源                            |
| pagination         | Boolean \| Object | true                                      | 是否显示分页                      |
| checkable          | Boolean           | false                                     | 是否显示多选框                    |
| indexable          | Boolean           | false                                     | 是否显示序号列                    |
| indexFixed         | String            | -                                         | 序号列固定位置('left' \| 'right') |
| expend             | Boolean           | false                                     | 是否支持展开行                    |
| autoQuery          | Boolean           | true                                      | 是否自动查询(仅 Promise 数据源)   |
| isNewTable         | Boolean           | false                                     | 使用新数据格式                    |
| useLocalPagination | Boolean           | false                                     | 强制使用本地分页                  |
| formatFunc         | Function          | -                                         | 自定义数据格式化函数              |
| defaultParams      | Object            | {}                                        | 默认查询参数                      |
| showOnePage        | Boolean           | true                                      | 单页数据时是否显示分页            |
| layout             | String            | 'total, prev, pager, next, sizes, jumper' | 分页布局                          |

### 列配置 (Column)

```javascript
{
  prop: 'name',              // 字段名(必需)
  label: '姓名',             // 列标题(必需)
  width: '120',              // 列宽
  align: 'center',           // 对齐方式
  fixed: 'left',             // 固定列('left' | 'right')
  sortable: true,            // 是否可排序
  showOverflowTooltip: true, // 溢出显示 tooltip
  children: []               // 子列(嵌套表头)
}
```

### Events

| 事件名           | 参数      | 说明         |
| ---------------- | --------- | ------------ |
| sizeChange       | pageSize  | 每页条数变化 |
| currentChange    | current   | 页码变化     |
| selection-change | selection | 多选变化     |

### Methods

| 方法名            | 参数            | 返回值 | 说明              |
| ----------------- | --------------- | ------ | ----------------- |
| query             | params?: Object | -      | 查询数据          |
| getSelection      | -               | Array  | 获取选中行        |
| changeCurrentPage | page: Number    | -      | 切换页码          |
| getState          | -               | Object | 获取当前状态      |
| clearSort         | -               | -      | 清除排序          |
| changeLoading     | flag: Boolean   | -      | 控制 loading 状态 |

### Slots

| 插槽名          | 参数                   | 说明         |
| --------------- | ---------------------- | ------------ |
| `${prop}`       | { row, column, index } | 自定义列内容 |
| `${prop}Header` | -                      | 自定义列表头 |
| expand          | { props }              | 展开行内容   |
| empty           | -                      | 空数据状态   |

## 高级用法

### 自定义列内容和表头

```vue
<template>
    <c-table :columns="columns" :dataSource="users">
        <!-- 自定义表头 -->
        <template #statusHeader>
            <el-icon><InfoFilled /></el-icon>
            <span>状态信息</span>
        </template>

        <!-- 自定义列内容 -->
        <template #status="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'info'">
                {{ row.status === 'active' ? '激活' : '禁用' }}
            </el-tag>
        </template>

        <!-- 自定义操作列 -->
        <template #actions="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
        </template>
    </c-table>
</template>
```

### 多选功能

```vue
<template>
    <c-table ref="tableRef" :columns="columns" :dataSource="users" checkable />
    <el-button @click="getSelected">获取选中行</el-button>
</template>

<script setup>
import { ref } from 'vue'

const tableRef = ref()

const getSelected = () => {
    const rows = tableRef.value?.getSelection() || []
    console.log('选中的行:', rows)
}
</script>
```

### 展开行

```vue
<template>
    <c-table :columns="columns" :dataSource="users" expend>
        <template #expand="{ props }">
            <div style="padding: 12px">
                <p>详细信息: {{ props.row }}</p>
            </div>
        </template>
    </c-table>
</template>
```

### 嵌套列(多级表头)

```vue
<script setup>
const columns = [
    { prop: 'id', label: 'ID', width: '80' },
    {
        label: '用户信息',
        children: [
            { prop: 'name', label: '姓名', width: '120' },
            { prop: 'age', label: '年龄', width: '80' }
        ]
    },
    {
        label: '联系方式',
        children: [
            { prop: 'email', label: '邮箱' },
            { prop: 'phone', label: '电话' }
        ]
    }
]
</script>
```

### 自定义数据格式化

```vue
<template>
    <c-table :columns="columns" :dataSource="fetchUsers" :formatFunc="formatResponse" />
</template>

<script setup>
const formatResponse = (response) => ({
    list: response.items, // 数据列表
    total: response.count, // 总条数
    current: response.page // 当前页码
})
</script>
```

## 数据格式

### 标准格式 (isNewTable: true)

```javascript
{
  data: {
    list: [...],      // 数据列表
    total: 100,       // 总条数
    pageNum: 1        // 当前页码
  }
}
```

### 旧格式 (默认)

```javascript
{
  data: [...],        // 数据数组
  totalCount: 100     // 总条数
}
```

## 示例

完整示例请查看 `/demo/table` 页面。

## 注意事项

1. **数据源类型**: 数组数据源自动使用本地分页,Promise 数据源使用远程分页
2. **自动查询**: Promise 数据源默认自动查询,可通过 `autoQuery: false` 禁用
3. **分页参数**: Promise 数据源会自动传入 `{ current, pageSize }` 参数
4. **插槽命名**: 列内容插槽为 `${prop}`,表头插槽为 `${prop}Header`
5. **错误处理**: 请求失败时会在控制台输出错误,表格显示为空

## 最佳实践

1. **使用 ref 访问方法**: 需要调用组件方法时,使用 ref 获取组件实例
2. **合理使用本地分页**: 数据量小于 1000 条时建议使用本地分页
3. **自定义格式化**: 后端数据格式不一致时,使用 `formatFunc` 统一处理
4. **默认参数**: 固定查询参数使用 `defaultParams`,避免每次手动传入
