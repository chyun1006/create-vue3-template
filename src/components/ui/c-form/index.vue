<template>
    <c-validate ref="validateRef" v-model="model" :json-schema="jsonSchema" v-bind="$attrs">
        <template #default="{ rules }">
            <el-row :gutter="20">
                <template v-for="(config, key) in jsonSchema" :key="key">
                    <el-col v-if="checkVisible(config)" :span="config.attrs?.span || 24">
                        <el-form-item :label="config.label" :prop="key" :rules="rules[key]">
                            <component :is="getComName(config.type)" v-model="model[key]" v-bind="getPureAttrs(config)"
                                class="w-full">
                                <!-- <template v-if="config.type.includes('select') && config.options">
                                    <el-option v-for="opt in config.options" :key="opt.value" :label="opt.label"
                                        :value="opt.value" />
                                </template>
<template v-else-if="hasOptions(config.type) && config.options">
                                    <component :is="config.type.includes('radio') ? 'el-radio' : 'el-checkbox'"
                                        v-for="opt in config.options" :key="opt.value" :label="opt.value">
                                        {{ opt.label }}
                                    </component>
                                </template> -->
                            </component>
                        </el-form-item>
                    </el-col>
                </template>
            </el-row>
        </template>
    </c-validate>
</template>

<script setup>
import { ref } from 'vue';
import CValidate from './c-validate.vue';

defineProps({
    jsonSchema: { type: Object, required: true }
});

const model = defineModel({ type: Object, required: true });
const validateRef = ref(null);

/**
 * 核心：组件名称转换函数
 */
const getComName = (type) => {
    if (!type) return 'el-input';
    // 别名处理：如果你喜欢直接写 textarea，我们把它映射给 el-input
    if (type === 'textarea') return 'el-input';
    // 标准拼接
    return `el-${type}`;
};

/**
 * 属性预处理：提取 span 并根据 type 自动补全属性
 */
const getPureAttrs = (config) => {
    const { span, ...rest } = config.attrs || {};
    // 自动处理 textarea 的原生 type 属性
    if (config.type === 'textarea') {
        return { type: 'textarea', ...rest };
    }
    return rest;
};

// 辅助判断是否需要渲染 Radio/Checkbox 子项
const hasOptions = (type) => type.includes('radio') || type.includes('checkbox');

// 联动判断
const checkVisible = (config) => {
    if (config.visible === undefined) return true;
    return typeof config.visible === 'function' ? config.visible(model.value) : !!config.visible;
};

defineExpose({ validate: () => validateRef.value?.validate() });
</script>

<style scoped>
.w-full {
    width: 100% !important;
}
</style>