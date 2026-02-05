<template>
    <el-col v-if="isVisible" :span="fieldConfig.attrs?.span || 24">
        <el-form-item :prop="prop" :label="label || fieldConfig.label" :rules="allRules[prop]" v-bind="$attrs">
            <slot></slot>
        </el-form-item>
    </el-col>
</template>

<script setup>
import { inject, computed } from 'vue';

const props = defineProps({
    prop: { type: String, required: true },
    label: { type: String, default: '' }
});

const allRules = inject('CFormRules', computed(() => ({})));
const jsonSchema = inject('CFormSchema', computed(() => ({})));
const formModel = inject('CFormModel');

const fieldConfig = computed(() => jsonSchema.value[props.prop] || {});

const isVisible = computed(() => {
    const cfg = fieldConfig.value;
    if (!cfg.visible) return true;
    return typeof cfg.visible === 'function' ? cfg.visible(formModel.value) : !!cfg.visible;
});
</script>