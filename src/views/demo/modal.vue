<template>
  <div class="demo-modal-page">
    <h2>useModal 示例</h2>

    <div class="demo-section">
      <h3>1. 基本用法</h3>
      <el-button type="primary" @click="openBasicModal">打开基本弹窗</el-button>
    </div>

    <div class="demo-section">
      <h3>2. 带参数的弹窗</h3>
      <el-button type="primary" @click="openModalWithParams">
        打开带参数的弹窗
      </el-button>
    </div>

    <div class="demo-section">
      <h3>3. 自定义配置</h3>
      <el-button type="primary" @click="openCustomModal">
        打开自定义配置弹窗
      </el-button>
    </div>

    <div class="demo-section">
      <h3>4. 嵌套弹窗</h3>
      <el-button type="primary" @click="openNestedModal">打开嵌套弹窗</el-button>
    </div>

    <div class="demo-section">
      <h3>5. 回调函数</h3>
      <el-button type="primary" @click="openModalWithCallbacks">
        打开带回调的弹窗
      </el-button>
      <div v-if="callbackResult" class="result">
        <strong>回调结果:</strong> {{ callbackResult }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useModal } from '@/composables/useModal'
import BasicContent from './components/BasicContent.vue'
import FormContent from './components/FormContent.vue'
import NestedContent from './components/NestedContent.vue'

const modal = useModal()
const callbackResult = ref('')

// 1. 基本用法
const openBasicModal = () => {
  modal.open(BasicContent, {
    title: '基本弹窗'
  })
}

// 2. 带参数的弹窗
const openModalWithParams = () => {
  modal.open(FormContent, {
    params: {
      userId: 123,
      userName: '张三'
    },
    title: '编辑用户',
    width: '600px'
  })
}

// 3. 自定义配置
const openCustomModal = () => {
  modal.open(BasicContent, {
    title: '自定义配置弹窗',
    width: '800px',
    top: '5vh',
    closeOnClickModal: false,
    closeOnPressEscape: false
  })
}

// 4. 嵌套弹窗
const openNestedModal = () => {
  modal.open(NestedContent, {
    title: '父弹窗',
    width: '700px'
  })
}

// 5. 带回调的弹窗
const openModalWithCallbacks = () => {
  callbackResult.value = ''
  modal.open(FormContent, {
    params: {
      userId: 456,
      userName: '李四'
    },
    title: '提交表单',
    width: '600px',
    onOk: (data) => {
      callbackResult.value = `确认提交: ${JSON.stringify(data)}`
    },
    onClose: () => {
      callbackResult.value = '用户取消了操作'
    }
  })
}
</script>

<style lang="scss" scoped>
.demo-modal-page {
  padding: 20px;

  h2 {
    margin-bottom: 30px;
    color: #303133;
  }

  .demo-section {
    margin-bottom: 30px;
    padding: 20px;
    background: #f5f7fa;
    border-radius: 4px;

    h3 {
      margin-bottom: 15px;
      font-size: 16px;
      color: #606266;
    }

    .result {
      margin-top: 15px;
      padding: 10px;
      background: #fff;
      border-radius: 4px;
      color: #67c23a;
    }
  }
}
</style>
