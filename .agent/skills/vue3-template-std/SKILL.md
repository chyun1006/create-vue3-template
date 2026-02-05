---
name: vue3-template-std
description: 规范当前 Vue3 项目的开发标准，包括核心组件使用、API 编写规范、错误处理以及 UI 交互准则。
---

# Vue3 项目开发规范 (Vue3 Template Standard)

本 Skill 旨在指导开发者如何正确使用本项目中的封装组件和工具函数，确保代码风格统一且符合项目架构设计。

## 核心原则（重点）

1. **优先复用**：在开发新功能时，必须优先查看 `src/components/ui` 和 `src/composables` 下是否已有封装好的组件或逻辑。
2. **规范命名**：所有 UI 组件以 `c-` 开头（如 `c-table`），Composable 以 `use` 开头。
3. **数据驱动**：表格和弹窗等交互应尽量通过配置项（JSON）驱动，而非指令式操作。
4. **错误处理**：网络请求必须使用 `await-to-js` 风格的工具函数 `to` 处理。
5. **工具函数**：优先使用 `src/utils` 下的工具函数，不要重复造轮子。

## 详细指导文档

开发者应详细阅读以下专项规范：

- [表格组件使用指南](resources/docs/c-table.md)
- [搜索组件使用指南](resources/docs/c-search.md)
- [表单组件使用指南](resources/docs/c-form.md)
- [弹窗 Composable 使用指南](resources/docs/useModal.md)
- [API 与网络请求规范](resources/docs/api-request.md)
- [UI 系统配置](resources/docs/ui-std.md)
- [目录与文件命名规范](resources/docs/naming-file-std.md)
- [Vue 3 生态最佳实践](resources/docs/vue-ecosystem-std.md)
- **图标规范**: 优先使用 `lucide-vue-next` 库中的图标

## 使用建议

每次开始编写新页面或新 API 时，建议先运行 `view_file` 查看本 Skill 目录下的对应文档，以避免重复造轮子或破坏项目架构。
