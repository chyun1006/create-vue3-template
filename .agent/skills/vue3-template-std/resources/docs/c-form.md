# 表单组件使用指南 (CForm Guide)

本项目采用 **JSON Schema 驱动 + 插槽扩展** 的方案，将表单逻辑（校验、布局、联动）进行模块化封装。

## 组件体系

### 1. `c-validate` (校验引擎)

表单的最外层容器，封装了 `el-form`。

- **动态规则**：自动根据 Schema 中的 `rule` 配置生成 Element Plus 校验规则。
- **数据隧道**：通过 `provide` 向下分发 `model` 和 `schema`，解耦子组件。
- **暴露方法**：提供 `validate` 和 `resetFields`。

### 2. `c-rule` (栅格包装器)

单个表单字段的逻辑包装，封装了 `el-col` 和 `el-form-item`。

- **布局控制**：通过 `attrs.span` 决定占据的份额。
- **显示联动**：内置 `visible` 处理逻辑，支持布尔值或函数（接收 model）。
- **自动规则**：根据 `prop` 自动连接到容器的校验逻辑。

### 3. `c-form` (全自动渲染)

高层组合组件，通过循环 Schema 自动渲染所有表单项。

- **类型自动映射**：支持 `input`, `select`, `radio-group`, `checkbox-group`, `switch`, `date-picker` 等。
- **插槽优先级**：如果定义了与字段同名的插槽，将优先渲染插槽内容。

---

## 快速上手

### 基础用法

```vue
<c-form ref="formRef" :json-schema="formConfig" v-model="formModel" />
```

### 配置示例 (JSON Schema)

```javascript
const formConfig = ref({
  name: {
    label: '姓名',
    type: 'input',
    attrs: { span: 12, placeholder: '请输入' },
    rule: { required: true }
  },
  isFullTime: {
    label: '是否全职',
    type: 'switch',
    attrs: { span: 12 }
  },
  jobTitle: {
    label: '职位',
    type: 'input',
    visible: (model) => model.isFullTime // 联动显示
  }
})
```

---

## 进阶技巧

### 1. 动态/远程数据源

由于 `formConfig` 是响应式的，可以直接修改其 `options`。

```javascript
const fetchDepts = async () => {
  remoteConfig.value.deptId.attrs.loading = true
  const res = await api.getDepts()
  remoteConfig.value.deptId.options = res.data
  remoteConfig.value.deptId.attrs.loading = false
}
```

### 2. 使用具名插槽

当自动化渲染无法满足需求时，使用字段名作为插槽。

```vue
<c-form :json-schema="formConfig" v-model="formModel">
  <template #customField="{ model, config }">
     <my-custom-input v-model="model.customField" />
  </template>
</c-form>
```

### 3. 核心 API 参考

| 属性 | 说明 | 类型 | 默认值 |
| :--- | :--- | :--- | :--- |
| `json-schema` | 表单项配置列表 | Object | - |
| `v-model` | 表单绑定的数据对象 | Object | - |

| 方法 | 说明 |
| :--- | :--- |
| `validate()` | 执行表单校验，返回 Promise |
| `resetFields()` | 重置表单字段并移除校验提示 |

---

## 开发建议

1. **优先配置化**：简单的输入和选择应完全通过配置完成。
2. **解离复杂逻辑**：复杂的 UI 交互建议使用插槽。
3. **命名一致性**：Schema 的 key 应与后台 API 字段名保持一致，避免二次映射。
