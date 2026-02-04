<template>
  <div class="form-content">
    <el-form :model="form" label-width="80px">
      <el-form-item label="用户ID">
        <el-input v-model="form.userId" disabled />
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="form.userName" />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="form.email" />
      </el-form-item>
    </el-form>

    <div class="tips">
      <p>提示: 点击确定按钮会触发保存逻辑</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useModalContext } from '@/composables/useModal'

const props = defineProps({
  userId: Number,
  userName: String
})

const form = ref({
  userId: props.userId,
  userName: props.userName,
  email: ''
})

// 获取弹窗上下文
const context = useModalContext()
const { onConfirm, handleOk, toggleLoading } = context || {}

// 注册确认按钮回调
onConfirm?.(() => {
  // 模拟保存操作
  toggleLoading?.(true)

  setTimeout(() => {
    toggleLoading?.(false)
    // 确认并关闭,返回数据给父组件
    handleOk?.({
      userId: form.value.userId,
      userName: form.value.userName,
      email: form.value.email
    })
  }, 1000)
})

onMounted(() => {
  // 模拟加载数据
  setTimeout(() => {
    form.value.email = `user${props.userId}@example.com`
  }, 500)
})
</script>

<style lang="scss" scoped>
.form-content {
  padding: 20px;

  .tips {
    margin-top: 20px;
    padding: 10px;
    background: #f0f9ff;
    border-left: 3px solid #409eff;

    p {
      margin: 0;
      font-size: 14px;
      color: #606266;
    }
  }
}
</style>
