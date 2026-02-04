# Project Context

## Purpose

这是一个现代化的 Vue3 企业级项目模板，旨在提供开箱即用的开发环境和最佳实践。项目集成了三种样式方案（Tailwind CSS、Element Plus、SCSS），支持 SSO 单点登录，并提供完整的权限管理和路由守卫功能。

**主要目标：**

- 为企业级 Vue3 项目提供标准化的项目结构
- 集成多种样式解决方案，满足不同场景需求
- 提供完整的认证授权体系
- 支持多环境配置和部署

## Tech Stack

**核心框架：**

- **Vue 3.4+** - 渐进式 JavaScript 框架
- **Vite 5.0+** - 下一代前端构建工具
- **Vue Router 4.2+** - 官方路由管理器
- **Pinia 2.1+** - 新一代状态管理

**UI 和样式：**

- **Element Plus 2.5+** - Vue 3 UI 组件库（支持主题定制）
- **@element-plus/icons-vue 2.3+** - Element Plus 图标库
- **Tailwind CSS 3.4+** - 实用优先的 CSS 框架
- **SCSS 1.69+** - CSS 预处理器
- **PostCSS + Autoprefixer** - CSS 后处理

**工具库：**

- **Axios 1.6+** - HTTP 客户端
- **@tc-airTravel/ssoLogin 1.0.3** - SSO 单点登录集成

**开发工具：**

- **ESLint 8.56+** - 代码质量检查
- **Prettier 3.1+** - 代码格式化
- **unplugin-auto-import** - 自动导入 API
- **unplugin-vue-components** - 自动导入组件

## Project Conventions

### Code Style

**JavaScript/Vue 规范：**

- 使用 ES6+ 语法
- 组件名称：PascalCase（如 `UserProfile.vue`）
- 文件名：kebab-case 或 PascalCase
- 变量和函数：camelCase
- 常量：UPPER_SNAKE_CASE
- 使用 Composition API（`<script setup>`）
- 禁用 `vue/multi-word-component-names` 规则

**Prettier 配置：**

- 不使用分号（`semi: false`）
- 使用单引号（`singleQuote: true`）
- 不使用尾随逗号（`trailingComma: "none"`）
- 每行最大宽度：100 字符
- 缩进：2 空格

**样式规范：**

- 优先使用 Tailwind CSS 工具类
- 复杂样式使用 SCSS
- Element Plus 组件使用主题定制
- SCSS 变量和 mixins 已全局自动导入

**命名约定：**

- 路由名称：PascalCase
- Store 模块：camelCase（如 `useAppStore`）
- 组件 props：camelCase
- 事件名称：kebab-case

### Architecture Patterns

**目录结构：**

```text
src/
├── apis/           # API 接口定义
├── assets/         # 静态资源
│   └── styles/     # 全局样式、变量、mixins
├── components/     # 公共组件
├── composables/    # 组合式函数
├── config/         # 配置文件（路由配置等）
├── layouts/        # 布局组件
├── router/         # 路由定义
├── stores/         # Pinia 状态管理
├── utils/          # 工具函数
└── views/          # 页面组件
```

**设计模式：**

- **单一配置源**：路由和菜单使用统一配置文件（`router.config.js`）
- **组合式 API**：使用 `<script setup>` 和 Composition API
- **状态管理**：使用 Pinia 进行全局状态管理
- **权限控制**：基于路由 meta 的权限守卫
- **自动导入**：Element Plus 组件和 API 自动导入

**路由配置规范：**

- 使用 `router.config.js` 统一管理路由和菜单
- 路由 meta 字段：
  - `title`: 页面标题
  - `icon`: 菜单图标（Element Plus Icon 名称）
  - `menu`: 是否在菜单中显示
  - `requiresAuth`: 是否需要登录

**组件通信：**

- 父子组件：props/emit
- 跨组件：Pinia store
- 全局事件：避免使用，优先使用 store

### Testing Strategy

目前项目暂未配置测试框架。

**建议的测试策略：**

- 单元测试：Vitest + Vue Test Utils
- E2E 测试：Playwright 或 Cypress
- 组件测试：重点测试公共组件和复杂业务组件
- 覆盖率目标：核心业务逻辑 > 80%

### Git Workflow

**分支策略：**

- `main` - 主分支，保持稳定
- `develop` - 开发分支
- `feature/*` - 功能分支
- `bugfix/*` - 修复分支
- `release/*` - 发布分支

**提交规范（建议）：**

- `feat:` - 新功能
- `fix:` - 修复 bug
- `docs:` - 文档更新
- `style:` - 代码格式调整
- `refactor:` - 重构
- `perf:` - 性能优化
- `test:` - 测试相关
- `chore:` - 构建/工具链相关

## Domain Context

**业务领域：**

- 企业级管理系统
- 支持 SSO 单点登录
- 基于角色的权限管理
- 多环境部署（开发、CSUAT、生产）

**用户角色：**

- 普通用户：基本功能访问
- 管理员：完整权限

**关键业务流程：**

1. SSO 登录认证
2. 权限验证和路由守卫
3. 菜单动态渲染
4. 多环境配置切换

## Important Constraints

**技术约束：**

- 必须使用 Vue 3 Composition API
- 必须支持 IE 以外的现代浏览器（Chrome >= 87, Firefox >= 78, Safari >= 14, Edge >= 88）
- 使用 pnpm 作为包管理器
- Node.js 版本要求：>= 16.0.0

**样式约束：**

- 三种样式方案可以混用，但需保持一致性
- Element Plus 主题定制通过 `element-variables.scss` 统一管理
- SCSS 变量和 mixins 已全局导入，无需手动引入

**代码规范约束：**

- 必须通过 ESLint 检查
- 必须使用 Prettier 格式化
- 所有 API 请求必须使用统一的 axios 实例

**性能约束：**

- 首屏加载时间 < 3s
- 路由懒加载
- 组件按需导入

## External Dependencies

**认证服务：**

- `@tc-airTravel/ssoLogin` - 内部 SSO 单点登录服务

**API 服务：**

- 开发环境：通过 Vite proxy 代理到 `http://localhost:8080`
- 生产环境：通过环境变量配置（`.env.product`, `.env.csuat`）

**CDN 资源：**

- Google Fonts（如需使用）
- Element Plus 图标

**构建和部署：**

- Nginx 配置文件位于 `/nginx` 目录
- 支持多环境构建：
  - `pnpm dev` - 开发环境
  - `pnpm build` - 默认生产构建
  - `pnpm build-product` - 生产环境构建
  - `pnpm build-csuat` - CSUAT 环境构建

**私有 npm 仓库：**

- 配置在 `.npmrc` 文件中
- 用于内部包的安装和发布
