# 目录与文件命名规范

为了保证项目结构的一致性，本项目对页面、组件、 Composable 以及其他文件的命名有严格要求。

## 1. 页面 (Page/View) 命名

页面级组件定义在 `src/views` 目录下。

- **命名规范**：**大驼峰 (PascalCase)**
- **目录命名**：大驼峰
- **文件命名**：大驼峰 (组件扩展名为 `.vue`)

### 示例

- `src/views/Home.vue`
- `src/views/UserManagement/Index.vue`
- `src/views/UserManagement/Detail.vue`

---

## 2. 组件 (Component) 命名

公共组件或业务组件定义在 `src/components` 目录下。

- **命名规范**：**小驼峰 + 中划线 (kebab-case)**
- **文件命名**：kebab-case (扩展名为 `.vue`)
- **UI 库前缀**：本项目封装的 UI 组件统一以 `c-` 开头。

### 示例

- `src/components/ui/c-table.vue`
- `src/components/ui/c-card.vue`
- `src/components/user-info-card.vue`

---

## 3. Composable (Hooks) 命名

逻辑复用函数定义在 `src/composables` 目录下。

- **命名规范**：**小驼峰 (camelCase)**，且统一以 `use` 开头。

### 示例

- `src/composables/useModal.js`
- `src/composables/useTable.js`

---

## 4. API 与工具函数命名

- **API 文件**：定义在 `src/apis` 下，使用 **小驼峰 (camelCase)**。
- **工具函数**：定义在 `src/utils` 下，使用 **中划线 (kebab-case)** 或 **小驼峰 (camelCase)**。

### 示例

- `src/apis/userCenter.js`
- `src/utils/await-to-js.js`

---

## 5. 样式命名

- **SCSS/CSS 文件**：使用 **中划线 (kebab-case)**。
- **CSS Class**：使用 **BEM** 规范或 **中划线 (kebab-case)**。

### 示例

- `src/assets/styles/index.scss`
- `src/assets/styles/element-variables.scss`
