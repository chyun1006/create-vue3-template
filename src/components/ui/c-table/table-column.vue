<template>
    <el-table-column :showOverflowTooltip="showOverflowTooltip" :key="column.prop" :prop="column.prop" :label="column.label" v-bind="{ ...column }">
        <template v-if="column.children && column.children.length">
            <table-column :column="col" v-for="col in column.children" :key="col.prop">
                <template v-if="$slots[col.prop]" v-slot:[col.prop]="{ row, column: childCol, $index }">
                    <slot :name="col.prop" :row="row" :column="childCol" :index="$index"></slot>
                </template>
            </table-column>
        </template>
        <template v-if="$slots[column.prop]" #default="{ row, column: col, $index }">
            <slot :name="column.prop" :row="row" :column="col" :index="$index"> </slot>
        </template>
        <template #header>
            <slot name="header">{{column.label}}</slot>
        </template>
    </el-table-column>
</template>

<script setup>
defineProps({
    column: Object,
    showOverflowTooltip: {
        type: Boolean,
        default: true,
    },
});
</script>
