# c-search 组件使用指南

`c-search` 是一个基于配置驱动的响应式搜索栏组件，支持自动折叠、响应式布局以及多种常用的表单项。

## 基础用法

通过 `json-schema` 配置搜索项，并使用 `v-model` 绑定搜索模型。

```vue
<template>
  <c-search 
    :json-schema="searchSchema" 
    v-model="searchModel" 
    @search="handleSearch" 
    @reset="handleReset"
  >
    <!-- 自定义额外按钮 -->
    <template #extra-btns>
      <el-button @click="handleExport">导出</el-button>
    </template>
  </c-search>
</template>

<script setup>
import { ref, reactive } from 'vue';

const searchModel = ref({});
const searchSchema = reactive({
  name: {
    type: 'input',
    attrs: { label: '姓名', placeholder: '请输入姓名' }
  },
  status: {
    type: 'select',
    attrs: { 
      label: '状态', 
      options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 }
      ] 
    }
  }
});

const handleSearch = (model) => console.log('搜索', model);
const handleReset = () => console.log('重置');
</script>
```

## 配置项 (jsonSchema)

每个配置项的 key 对应 `v-model` 中的字段名。

- `type`: 组件类型。可选值：`input`, `select`, `date-picker`, `input-number`, `textarea` 等（会自动映射为 `el-` 前缀组件）。
- `attrs`: 传递给底层 Element Plus 组件的属性。
  - `label`: 标签名称。
  - `placeholder`: 占位文本。
  - `options`: (仅 `select`, `radio`, `checkbox`) 选项数组，格式为 `[{ label, value }]`。
  - `span`: (可选) 手动指定该项占用的网格数（24栅格制）。如果不指定，则使用全局响应式布局。
  - `...`: 其他 Element Plus 支持的属性（如 `clearable`, `multiple` 等）。

## 响应式布局与折叠

组件内部有一套默认的响应式规则：

- **xl (>=1920px)**: 每行 6 个，默认显示前 5 个，多余的进入折叠区。
- **lg (>=1200px)**: 每行 4 个，默认显示前 3 个。
- **md (>=992px)**: 每行 3 个，默认显示前 2 个。
- **sm (<992px)**: 每行 2 个，默认显示前 1 个。

当配置项总数超过当前屏幕宽度的显示阈值时，会自动出现 “展开/收起” 按钮。

## 插槽 (Slots)

- **自定义表单项**: 使用 `#字段名="{ model, config }"` 可以完全自定义某个搜索项的输入组件。
- **额外按钮**: `#extra-btns` 用于在 “搜索/重置/展开” 按钮组后追加自定义操作。

## 事件 (Events)

- `@search`: 当点击搜索按钮或在输入框回车时触发，参数为当前的搜索模型。
- `@reset`: 当点击重置按钮时触发。
