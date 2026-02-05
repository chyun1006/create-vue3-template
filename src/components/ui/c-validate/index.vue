<template>
    <el-form ref="formRef" :model="model" v-bind="mergeProps">
        <slot></slot>
    </el-form>
</template>

<script setup>
import { computed, provide, ref, useAttrs } from 'vue';

const props = defineProps({
    jsonSchema: { type: Object, required: true }
});

const model = defineModel({ type: Object, required: true });
const formRef = ref(null);
const attrs = useAttrs();

// 1. 核心：在内部自动生成 Rules
const computedRules = computed(() => {
    const rulesMap = {};
    Object.keys(props.jsonSchema).forEach(key => {
        const config = props.jsonSchema[key];
        if (config.rule) {
            const fieldRules = [];
            if (config.rule.required) {
                const isSelect = ['select', 'radio', 'checkbox', 'date', 'picker'].some(k => config.type?.includes(k));
                fieldRules.push({
                    required: true,
                    message: `${isSelect ? '请选择' : '请输入'}${config.label}`,
                    trigger: isSelect ? 'change' : 'blur'
                });
            }
            if (config.rule.validate) {
                fieldRules.push({
                    validator: (r, val, cb) => config.rule.validate(val, model.value, cb),
                    trigger: 'blur'
                });
            }
            rulesMap[key] = fieldRules;
        }
    });
    return rulesMap;
});

// 2. 核心：建立通信隧道，下发数据
provide('CFormRules', computedRules);
provide('CFormSchema', computed(() => props.jsonSchema));
provide('CFormModel', model);

const mergeProps = computed(() => ({
    'label-width': 'auto',
    ...attrs
}));

// 暴露校验方法
defineExpose({
    validate: () => formRef.value?.validate(),
    resetFields: () => formRef.value?.resetFields()
});
</script>