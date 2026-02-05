<template>
    <el-form ref="formRef" :model="model" v-bind="$attrs">
        <slot :rules="computedRules"></slot>
    </el-form>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
    jsonSchema: { type: Object, required: true }
})

// 使用 defineModel 直接同步 modelValue
const model = defineModel({ type: Object, required: true })

const formRef = ref(null)

const computedRules = computed(() => {
    const rulesMap = {}
    Object.keys(props.jsonSchema).forEach((key) => {
        const config = props.jsonSchema[key]
        const { rule, label, type } = config
        if (rule) {
            const fieldRules = []
            if (rule.required) {
                const selectKeys = ['select', 'radio', 'checkbox', 'date', 'time', 'cascader', 'picker', 'rate']
                const isSelect = selectKeys.some((k) => type.includes(k))
                fieldRules.push({
                    required: true,
                    message: `${isSelect ? '请选择' : '请输入'}${label}`,
                    trigger: isSelect ? 'change' : 'blur'
                })
            }
            if (rule.validate) {
                fieldRules.push({
                    validator: (r, val, cb) => rule.validate(val, model.value, cb),
                    trigger: 'blur'
                })
            }
            rulesMap[key] = fieldRules
        }
    })
    return rulesMap
})

defineExpose({
    validate: () => formRef.value?.validate(),
    resetFields: () => formRef.value?.resetFields()
})
</script>
