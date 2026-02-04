# UI 系统配置指南

## c-card 布局组件

统一使用 `c-card` 代替原生的 `el-card`。

### 属性建议

- `title`: 简单的字符串标题，会通过 `el-card` 的 header 渲染。
- `padding`: 默认已在全局样式覆盖为 `10px 20px` (针对 header)。如果需要给 body 设置特殊 padding，请使用 `body-style` 属性。

## 颜色与主题 (Variables)

开发时应优先使用全局 SCSS 变量，以支持主题切换：

- 主色：`$primary-color` (CSS 变量 `--primary`)
- 背景：`$bg-page` (CSS 变量 `--background`)
- 边框：`$border-base` (CSS 变量 `--border`)

## 样式覆盖原则

1. **避免 scoped 穿透滥用**：尽量通过修改 `src/assets/styles/index.scss` 或 CSS 变量来全局统一风格。
2. **变量优先**：Element Plus 的组件样式应优先通过修改 CSS 变量（如 `--el-card-padding`）来定制。
