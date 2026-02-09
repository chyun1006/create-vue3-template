<template>
    <div class="upload-demo-container">
        <!-- 1. 基础按钮上传 -->
        <c-card class="demo-card">
            <template #header>
                <div class="card-header">
                    <span>1. 基础按钮上传</span>
                </div>
            </template>
            <c-upload
                action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                :max-size="5"
                accept=".jpg,.png,.gif"
                :limit="3"
                @success="onSuccess"
                @remove="onRemove"
            />
        </c-card>

        <!-- 2. 拖拽上传 -->
        <c-card class="demo-card mt-4">
            <template #header>
                <div class="card-header">
                    <span>2. 拖拽上传</span>
                </div>
            </template>
            <c-upload
                action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                drag
                :max-size="20"
                accept=".pdf,.docx,.xlsx"
                :limit="5"
                @success="onSuccess"
            />
        </c-card>

        <!-- 3. 自定义触发器 -->
        <c-card class="demo-card mt-4">
            <template #header>
                <div class="card-header">
                    <span>3. 自定义触发器</span>
                </div>
            </template>
            <c-upload
                action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                :max-size="10"
                accept=".jpg,.png"
                :limit="1"
                @success="onSuccess"
            >
                <template #trigger>
                    <div class="custom-trigger">
                        <ImagePlus :size="32" :stroke-width="1.5" />
                        <span>选择图片</span>
                    </div>
                </template>
                <template #tip>
                    <div class="custom-tip">仅支持 JPG/PNG 格式，不超过 10MB</div>
                </template>
            </c-upload>
        </c-card>

        <!-- 4. 手动上传 -->
        <c-card class="demo-card mt-4">
            <template #header>
                <div class="card-header">
                    <span>4. 手动上传</span>
                </div>
            </template>
            <c-upload
                ref="manualUploadRef"
                action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                :auto-upload="false"
                :max-size="10"
                :limit="5"
                @success="onSuccess"
            >
                <template #button-text>选取文件</template>
            </c-upload>
            <div class="mt-4 flex gap-2">
                <el-button type="success" @click="submitUpload">
                    上传到服务器
                </el-button>
                <el-button @click="clearFiles">清空文件</el-button>
            </div>
        </c-card>

        <!-- 5. 图片列表模式 -->
        <c-card class="demo-card mt-4">
            <template #header>
                <div class="card-header">
                    <span>5. 图片列表模式</span>
                </div>
            </template>
            <c-upload
                action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                list-type="picture-card"
                accept=".jpg,.png,.gif,.webp"
                :max-size="5"
                :limit="6"
                @success="onSuccess"
            >
                <template #trigger>
                    <Plus :size="24" />
                </template>
            </c-upload>
        </c-card>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { ImagePlus, Plus } from 'lucide-vue-next'

const manualUploadRef = ref(null)

const onSuccess = (response, file) => {
    ElMessage.success(`${file.name} 上传成功`)
}

const onRemove = (file) => {
    ElMessage.info(`${file.name} 已移除`)
}

const submitUpload = () => {
    manualUploadRef.value?.submit()
}

const clearFiles = () => {
    manualUploadRef.value?.clearFiles()
    ElMessage.info('文件列表已清空')
}
</script>

<style lang="scss" scoped>
.demo-card {
    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 16px;
        font-weight: 600;
    }
}

.custom-trigger {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 120px;
    height: 120px;
    border: 2px dashed var(--border);
    border-radius: 8px;
    cursor: pointer;
    color: var(--el-text-color-placeholder);
    transition: all 0.3s;

    &:hover {
        border-color: var(--primary);
        color: var(--primary);
    }

    span {
        font-size: 13px;
    }
}

.custom-tip {
    font-size: 12px;
    color: var(--el-text-color-placeholder);
    margin-top: 8px;
}

.mt-4 {
    margin-top: 16px;
}

.flex {
    display: flex;
}

.gap-2 {
    gap: 8px;
}
</style>
