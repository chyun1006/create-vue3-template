# Vue3 项目模板

一个集成了 Tailwind CSS、Element Plus 主题定制和 SCSS 的现代化 Vue3 项目模板。

## 技术栈

- **Vue 3** - 渐进式 JavaScript 框架
- **Vite** - 下一代前端构建工具
- **Vue Router** - 官方路由管理器
- **Pinia** - 新一代状态管理
- **Element Plus** - Vue 3 UI 组件库(支持主题定制)
- **Tailwind CSS** - 实用优先的 CSS 框架
- **SCSS** - CSS 预处理器
- **Axios** - HTTP 客户端
- **ESLint + Prettier** - 代码规范和格式化

## 特性

✨ **三合一样式方案**

- 🎨 Tailwind CSS - 快速构建现代化 UI
- 🎭 Element Plus - 丰富的企业级组件
- 💅 SCSS - 强大的样式预处理能力

🔧 **开箱即用的配置**

- Element Plus 主题完全可定制
- SCSS 全局变量和 mixins 自动导入
- Tailwind 与 Element Plus 无缝集成
- 路径别名 `@` 指向 `src` 目录

🚀 **企业级功能**

- SSO 单点登录集成(模拟实现)
- 权限管理和路由守卫
- 环境变量配置

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 <http://localhost:3000>

### 生产构建

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

## 样式使用指南

### 1. Tailwind CSS

直接在模板中使用 Tailwind 的工具类:

```vue
<template>
  <div class="flex items-center justify-between p-4 bg-blue-500 text-white rounded-lg">
    <span class="text-xl font-bold">标题</span>
  </div>
</template>
```

### 2. Element Plus 组件

使用 Element Plus 组件,主题已自动定制:

```vue
<template>
  <el-button type="primary">主要按钮</el-button>
  <el-input v-model="value" placeholder="请输入" />
</template>
```

### 3. SCSS 自定义样式

使用 SCSS 变量和 mixins(已全局自动导入):

```vue
<style lang="scss" scoped>
.custom-box {
  padding: 1rem;
  background-color: $bg-color;
  border: 1px solid $border-light;
  
  // 使用 mixin
  @include flex-center;
  
  .title {
    color: $primary-color;
    font-size: $font-size-large;
  }
}
</style>
```

## Element Plus 主题定制

主题变量定义在 `src/assets/styles/element-variables.scss`:

```scss
// 修改主题色
$--color-primary: #409eff !default;
$--color-success: #67c23a !default;

// 修改字体大小
$--font-size-base: 14px !default;
```

修改这些变量即可定制 Element Plus 的整体主题。

## 环境变量

- `.env.development` - 开发环境配置
- `.env.production` - 生产环境配置

使用方式:

```javascript
const apiUrl = import.meta.env.VITE_APP_API_BASE_URL
```

## 浏览器支持

- Chrome >= 87
- Firefox >= 78
- Safari >= 14
- Edge >= 88

## 许可证

MIT
