import { h } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import sso from '@/utils/sso'
import { SERVER_URL, TOKEN_NAME, APP_CONFIG } from '@/config/app.config'


const commonRequestFn = (config) => {
    config.headers[TOKEN_NAME] = sso.getToken()
    config.headers['System-Code'] = APP_CONFIG.systemCode
    config.data = { t: config.data }
    return config
}

/** 统一响应错误处理逻辑 */
const handleResponseError = (response) => {
    if (!response.success) {
        const message = response.errorMessage || response.errorMsg || response.message || ''
        if (response.errorCode === 'ER0000003') {
            const formattedMessage = message.replace(/\n/g, '<br/>')
            ElMessageBox.alert(
                h('div', {
                    style: 'max-height: 50vh; overflow-y: auto; word-break: break-all; white-space: pre-wrap; padding: 10px 0; font-size: 14px; line-height: 1.6;',
                    innerHTML: formattedMessage
                }),
                '提示',
                {
                    confirmButtonText: '确定',
                    type: 'warning',
                    customClass: 'premium-message-box'
                }
            )
        } else {
            ElMessage.error(message)
        }
    }
}

const commonResponseFn = (response) => {
    handleResponseError(response)
    return response
}

/** 智能拼接 API 基础路径 */
const formatBaseURL = (prefix) => {
    // 如果没有配置域名（本地开发通常为空），则使用相对路径走本地代理
    if (!SERVER_URL) return prefix
    
    // 如果 SERVER_URL 是绝对域名，则进行拼接
    if (/^https?:\/\//.test(SERVER_URL)) {
        const domain = SERVER_URL.endsWith('/') ? SERVER_URL.slice(0, -1) : SERVER_URL
        const pathPrefix = prefix.startsWith('/') ? prefix : `/${prefix}`
        return `${domain}${pathPrefix}`
    }
    
    return SERVER_URL
}

const httpConfig = {
    default: {
        baseURL: formatBaseURL('/busibff/api'),
        timeout: 60000 * 5, // 请求超时时间
        // 自定义request拦截器
        requestInterceptorFun: (config) => commonRequestFn(config),
        responseInterceptorFun: (response) => commonResponseFn(response)
    },
    // 响应错误拦截器
    noResponseError: {
        baseURL: formatBaseURL('/busibff/api'),
        timeout: 60000 * 5, // 请求超时时间
        // 自定义request拦截器
        requestInterceptorFun: (config) => commonRequestFn(config),
        responseInterceptorFun: (response) => {
            return response
        }
    },
    upload: {
        baseURL: formatBaseURL('/busibff'),
        timeout: 60000 * 10, // 请求超时时间
        // 自定义request拦截器
        requestInterceptorFun: (config) => {
            config.headers[TOKEN_NAME] = sso.getToken()
            config.headers['System-Code'] = APP_CONFIG.systemCode
            config.headers['Content-Type'] = 'multipart/form-data'
            return config
        },
        responseInterceptorFun: (response) => commonResponseFn(response)
    }
}

export default httpConfig
