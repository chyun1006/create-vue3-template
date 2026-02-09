<template>
    <div class="c-upload">
        <el-upload
            ref="uploadRef"
            v-bind="$attrs"
            :accept="accept"
            :limit="limit"
            :file-list="fileList"
            :drag="drag"
            :before-upload="handleBeforeUpload"
            :on-exceed="handleExceed"
            :on-success="handleSuccess"
            :on-remove="handleRemove"
            :on-error="handleError"
        >
            <!-- 自定义触发区域 -->
            <template v-if="$slots.trigger">
                <slot name="trigger"></slot>
            </template>
            <template v-else-if="drag">
                <div class="c-upload__drag">
                    <Upload class="c-upload__icon" :size="40" :stroke-width="1.5" />
                    <div class="c-upload__drag-text">
                        将文件拖到此处，或 <em>点击上传</em>
                    </div>
                </div>
            </template>
            <template v-else>
                <el-button type="primary" :icon="UploadIcon">
                    <slot name="button-text">点击上传</slot>
                </el-button>
            </template>

            <!-- 提示信息 -->
            <template #tip>
                <slot name="tip">
                    <div v-if="tipText" class="c-upload__tip">{{ tipText }}</div>
                </slot>
            </template>

            <!-- 文件列表自定义 -->
            <template v-if="$slots.file" #file="{ file }">
                <slot name="file" :file="file"></slot>
            </template>
        </el-upload>
    </div>
</template>

<script setup>
import { ref, computed, useSlots } from 'vue'
import { ElMessage } from 'element-plus'
import { Upload as UploadIcon } from 'lucide-vue-next'

defineOptions({
    name: 'CUpload',
    inheritAttrs: false
})

const props = defineProps({
    /** 文件大小限制，单位 MB */
    maxSize: {
        type: Number,
        default: 0
    },
    /** 允许的文件类型，如 '.jpg,.png,.pdf' */
    accept: {
        type: String,
        default: ''
    },
    /** 最大文件数量 */
    limit: {
        type: Number,
        default: 0
    },
    /** 是否启用拖拽上传 */
    drag: {
        type: Boolean,
        default: false
    },
    /** 文件列表 */
    fileList: {
        type: Array,
        default: () => []
    },
    /** 自定义提示文字，不传则自动生成 */
    tip: {
        type: String,
        default: ''
    }
})

const emit = defineEmits(['success', 'remove', 'error', 'exceed'])

const uploadRef = ref(null)
const slots = useSlots()

/**
 * 自动生成提示文本
 */
const tipText = computed(() => {
    if (props.tip) return props.tip

    const parts = []
    if (props.accept) {
        const types = props.accept
            .split(',')
            .map((t) => t.trim().replace('.', '').toUpperCase())
            .join('/')
        parts.push(`支持 ${types} 格式`)
    }
    if (props.maxSize > 0) {
        parts.push(`单个文件不超过 ${props.maxSize}MB`)
    }
    if (props.limit > 0) {
        parts.push(`最多上传 ${props.limit} 个文件`)
    }
    return parts.join('，')
})

/**
 * 上传前校验：文件大小 & 文件类型
 */
const handleBeforeUpload = (file) => {
    // 校验文件类型
    if (props.accept) {
        const acceptList = props.accept.split(',').map((t) => t.trim().toLowerCase())
        const ext = '.' + file.name.split('.').pop().toLowerCase()
        const mimeMatch = acceptList.some(
            (a) => a === ext || file.type.includes(a.replace('.', ''))
        )
        if (!mimeMatch) {
            const types = acceptList.map((t) => t.replace('.', '').toUpperCase()).join('/')
            ElMessage.warning(`仅支持 ${types} 格式的文件`)
            return false
        }
    }

    // 校验文件大小
    if (props.maxSize > 0) {
        const sizeMB = file.size / 1024 / 1024
        if (sizeMB > props.maxSize) {
            ElMessage.warning(`文件大小不能超过 ${props.maxSize}MB`)
            return false
        }
    }

    return true
}

/**
 * 文件数量超限
 */
const handleExceed = (files, uploadFiles) => {
    ElMessage.warning(`最多只能上传 ${props.limit} 个文件`)
    emit('exceed', files, uploadFiles)
}

/**
 * 上传成功
 */
const handleSuccess = (response, file, fileList) => {
    emit('success', response, file, fileList)
}

/**
 * 文件移除
 */
const handleRemove = (file, fileList) => {
    emit('remove', file, fileList)
}

/**
 * 上传失败
 */
const handleError = (error, file, fileList) => {
    ElMessage.error('文件上传失败，请重试')
    emit('error', error, file, fileList)
}

/**
 * 暴露方法供父组件调用
 */
defineExpose({
    /** 清空文件列表 */
    clearFiles: () => uploadRef.value?.clearFiles(),
    /** 取消上传 */
    abort: (file) => uploadRef.value?.abort(file),
    /** 手动触发上传 */
    submit: () => uploadRef.value?.submit()
})
</script>

<style scoped>
.c-upload__drag {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 20px 0;
}

.c-upload__icon {
    color: var(--el-text-color-placeholder);
}

.c-upload__drag-text {
    font-size: 14px;
    color: var(--el-text-color-regular);
}

.c-upload__drag-text em {
    color: var(--primary);
    font-style: normal;
}

.c-upload__tip {
    font-size: 12px;
    color: var(--el-text-color-placeholder);
    margin-top: 8px;
    line-height: 1.5;
}
</style>
