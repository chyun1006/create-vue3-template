# useModal Composable 使用指南

`useModal` 采用命令式（Imperative）方式管理弹窗，支持在不改变当前页面组件树结构的情况下动态挂载业务组件。

## 1. 父组件用法：打开弹窗

在父组件（触发弹窗的页面）中通过 `useModal` 获取 `open` 方法。

```javascript
import { useModal } from '@/composables/useModal'
import UserForm from './components/UserForm.vue' // 引入业务组件

const modal = useModal()

const handleAdd = () => {
  modal.open(UserForm, {
    title: '新增用户',
    width: '600px',
    params: { // 传递给 UserForm 的 props
      mode: 'add',
      groupId: 1
    },
    onOk: (data) => {
      console.log('用户点击了确定并返回了数据:', data)
      // 处理刷新逻辑...
    },
    onClose: () => {
      console.log('用户取消了操作')
    }
  })
}
```

### `open` 配置选项

- `title`: 弹窗标题
- `width`: 弹窗宽度 (默认 50%)
- `params`: 传递给内部组件的 `props` 对象
- `onOk`: 确定回调函数，可接收内部组件传回的数据
- `onClose`: 关闭/取消回调函数
- `...dialogOptions`: 支持所有 Element Plus `el-dialog` 的原生属性（如 `top`, `closeOnClickModal` 等）

---

## 2. 内部组件用法：控制与通信

在被弹窗打开的业务组件（如 `UserForm.vue`）中，通过 `useModalContext` 获取控制方法。

```javascript
import { useModalContext } from '@/composables/useModal'

const { onConfirm, handleOk, handleClose, toggleConfirmLoading, toggleLoading } = useModalContext() || {}

// 注册弹窗“确定”按钮的点击事件
onConfirm?.(async () => {
  toggleConfirmLoading?.(true) // 开启确定按钮 loading
  
  const [err, success] = await to(submitForm(formData))
  
  toggleConfirmLoading?.(false)
  if (!err) {
    handleOk?.(formData) // 提交成功，传回数据并关闭弹窗
  }
})

// 主动关闭（例如点击“取消”按钮）
const cancel = () => {
  handleClose?.()
}
```

### `useModalContext` 核心方法

- `onConfirm(handler)`: 注册顶部弹窗“确定”按钮的点击逻辑。
- `handleOk(data)`: 完成业务并关闭弹窗，执行父组件的 `onOk` 回调。
- `handleClose()`: 关闭弹窗。
- `toggleConfirmLoading(bool)`: 控制弹窗右下角“确定”按钮的 Loading 状态。
- `toggleLoading(bool)`: 控制弹窗内容区域的 Loading 状态。

## 最佳实践建议

1. **职责分离**：父组件只管“开”，内部组件通过 `onConfirm` 托管“确认逻辑”。
2. **状态独立**：复杂的表单逻辑应封装在内部组件中，保持主页面清爽。
3. **安全调用**：由于 `useModalContext` 仅在弹窗模式下有效，建议使用 `?.` 可选链进行调用。
