<template>
    <c-validate ref="validateRef" v-model="model" :json-schema="jsonSchema" v-bind="$attrs">
        <el-row :gutter="20">
            <template v-for="(config, key) in jsonSchema" :key="key">
                <c-rule :prop="key">
                    <template v-if="slots[key]">
                        <slot :name="key" :model="model" :config="config"></slot>
                    </template>
                    <component v-else :is="getComName(config.type)" v-model="model[key]"
                        v-bind="getMergedAttrs(config)">
                        <template v-if="config.options">
                            <component :is="getOptionComp(config.type)" v-for="opt in config.options" :key="opt.value"
                                :label="config.type.includes('select') ? opt.label : opt.value" :value="opt.value">
                                <template v-if="!config.type.includes('select')">{{ opt.label }}</template>
                            </component>
                        </template>
                    </component>
                </c-rule>
            </template>
        </el-row>
    </c-validate>
</template>

<script setup>
import { useSlots, ref } from 'vue';
import CValidate from '../c-validate/index.vue';
import CRule from '../c-rule/index.vue';

defineProps({ jsonSchema: { type: Object, required: true } });
const model = defineModel({ type: Object, required: true });

const slots = useSlots();
const validateRef = ref(null);

const getComName = (type) => (type === 'textarea' ? 'el-input' : `el-${type}`);
const getOptionComp = (type) => type.includes('select') ? 'el-option' : (type.includes('radio') ? 'el-radio' : 'el-checkbox');

const getMergedAttrs = (config) => {
    const { ...jsonAttrs } = config.attrs || {};
    const defaults = {
        select: { filterable: true, clearable: true },
        input: { clearable: true },
        textarea: { type: 'textarea', autosize: { minRows: 2 } }
    };
    return { ...(defaults[config.type] || {}), ...jsonAttrs };
};

defineExpose({
    validate: () => validateRef.value?.validate(),
    resetFields: () => validateRef.value?.resetFields()
});
</script>
<style scoped></style>