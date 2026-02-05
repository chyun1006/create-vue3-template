<template>
    <div class="c-search-bar">
        <c-validate ref="formRef" v-model="model" :json-schema="jsonSchema" class="search-form">
            <el-row :gutter="20">
                <template v-for="(config, key, index) in jsonSchema" :key="key">
                    <c-rule v-show="isExpanded || index < visibleThreshold" :prop="key"
                        v-bind="getResponsiveSpan(config)">
                        <template v-if="slots[key]">
                            <slot :name="key" :model="model" :config="config"></slot>
                        </template>

                        <component v-else :is="getComName(config.type)" v-model="model[key]"
                            v-bind="getMergedAttrs(config)" @keyup.enter="handleSearch">
                            <template v-if="config.attrs?.options">
                                <component :is="getOptionComp(config.type)" v-for="opt in config.attrs.options"
                                    :key="opt.value" v-bind="opt"
                                    :label="config.type.includes('select') ? opt.label : opt.value" :value="opt.value">
                                    <template v-if="!config.type.includes('select')">{{ opt.label }}</template>
                                </component>
                            </template>
                        </component>
                    </c-rule>
                </template>

                <el-col v-bind="getResponsiveSpan({ attrs: { isBtn: true } })" class="search-btns">
                    <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
                    <el-button :icon="RotateCcw" @click="handleReset">重置</el-button>

                    <el-link v-if="Object.keys(jsonSchema).length > visibleThreshold" type="primary" :underline="false"
                        @click="isExpanded = !isExpanded" class="expand-link">
                        <el-icon>
                            <component :is="isExpanded ? ChevronUp : ChevronDown" />
                        </el-icon>
                    </el-link>
                    <slot name="extra-btns"></slot>
                </el-col>
            </el-row>
        </c-validate>
    </div>
</template>

<script setup>
import { useSlots, ref, computed, onMounted, onUnmounted } from 'vue';
import { Search, RotateCcw, ChevronUp, ChevronDown } from 'lucide-vue-next';
import CValidate from '../c-validate/index.vue';
import CRule from '../c-rule/index.vue';

defineProps({
    jsonSchema: { type: Object, required: true }
});

const model = defineModel({ type: Object, required: true });
const emit = defineEmits(['search', 'reset']);
const slots = useSlots();
const formRef = ref(null);
const isExpanded = ref(false);

/**
 * 响应式监听窗口宽度
 */
const windowWidth = ref(window.innerWidth);
const updateWidth = () => { windowWidth.value = window.innerWidth; };

onMounted(() => window.addEventListener('resize', updateWidth));
onUnmounted(() => window.removeEventListener('resize', updateWidth));

/**
 * 核心逻辑：根据宽度自动计算该显示几个 (阈值)
 * xl: 1920px+ -> 一行6个，显示前5个
 * lg: 1200px+ -> 一行4个，显示前3个
 * md: 992px+  -> 一行3个，显示前2个
 * sm: 768px+  -> 一行2个，显示前1个
 */
const visibleThreshold = computed(() => {
    const w = windowWidth.value;
    if (w >= 1920) return 5; // xl
    if (w >= 1200) return 3; // lg
    if (w >= 992) return 2; // md
    return 1;                // sm & xs
});

const getResponsiveSpan = (config) => {
    // 按钮组和普通输入框共用一套响应式比例
    const defaultSpan = { xs: 24, sm: 12, md: 8, lg: 6, xl: 4 };
    return config.attrs?.span ? { span: config.attrs.span } : defaultSpan;
};

// 工具方法保持不变
const handleSearch = () => emit('search', model.value);
const handleReset = () => { formRef.value?.resetFields(); emit('reset'); };
const getComName = (type) => (type === 'textarea' ? 'el-input' : `el-${type}`);
const getOptionComp = (type) => {
    if (type.includes('select')) return 'el-option';
    if (type.includes('radio')) return 'el-radio';
    if (type.includes('checkbox')) return 'el-checkbox';
    return '';
};
const getMergedAttrs = (config) => {
    // 过滤掉自定义属性，避免传递给原生组件/Element组件产生警告
    // eslint-disable-next-line no-unused-vars
    const { span, options, ...jsonAttrs } = config.attrs || {};
    return { clearable: true, style: { width: '100%' }, ...jsonAttrs };
};
</script>

<style scoped>
.c-search-bar {
    background: #fff;
    padding: 18px 18px 0 18px;
    border-radius: 8px;
    border: 1px solid #ebeef5;
    margin-bottom: 16px;
}

.search-btns {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 18px;
    /* 确保按钮组在当前行空间不足时会自动换行并右侧对齐（可选） */
    flex-wrap: nowrap;
}

.expand-link {
    font-size: 14px;
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
}
</style>