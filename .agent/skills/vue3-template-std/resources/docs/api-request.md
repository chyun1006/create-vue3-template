# API 与网络请求规范

本项目采用分层架构处理网络请求，将配置、请求实例与具体接口分离。

## 文件结构

- `src/config/http.config.js`: axios 基础配置（baseURL, 拦截器等）。
- `src/apis/index.js`: 导出 `defaultRequest` (Http 类的实例)。
- `src/apis/*.js`: 业务接口定义文件。

## 接口定义规范

使用 `defaultRequest` 定义接口，参数统一包装。

```javascript
import { defaultRequest as http } from './index'

export const queryList = (params) => 
  http.post('/your/endpoint', { t: params || {} })
```

## 网络请求错误处理 (await-to-js)

为了避免 `try-catch` 嵌套，项目集成了 `to` 工具函数。

**导入方式**：`import to from '@/utils/await-to-js'`

**使用方式**：

```javascript
const [err, res] = await to(api.queryList(params))

if (err) {
  // 处理错误逻辑（全局错误弹窗通常已在拦截器中处理）
  return
}

// 正常使用 res
console.log(res.list)
```
