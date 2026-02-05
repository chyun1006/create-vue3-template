import axios from 'axios'
import { ElMessage } from 'element-plus'
import sso from '@/utils/sso'

let _service = Symbol()
class Http {
    constructor(options) {
        _service = axios.create(options)
        this.requestInterceptors(options.requestInterceptorFun)
        this.responseInterceptors(options.responseInterceptorFun)
        return _service
    }

    requestInterceptors(requestInterceptorFun) {
        _service.interceptors.request.use(requestInterceptorFun)
        _service.interceptors.request.use(
            (config) => {
                return config
            },
            (error) => {
                return Promise.reject(error)
            }
        )
    }

    responseInterceptors(responseInterceptorFun) {
        _service.interceptors.response.use((response) => {
            return response.data
        }, responseErrorHandle)
        _service.interceptors.response.use(responseInterceptorFun)
    }
}

function responseErrorHandle(error) {
    console.error('responseErrorHandle', error)
    if (error.response) {
        if (error.response.status === 403) {
            ElMessage.warning('暂无权限')
        }
        if (error.response.status === 500 || error.response.status === 502) {
            ElMessage.error('服务器暂时不可用')
        }
        if (error.response.status === 401) {
            _redirectToLogin()
        }
        if (error.response.status === 404) {
            ElMessage.error('没找到接口')
        }
        if (error.response.status === 400) {
            ElMessage.error(error.response.data.message)
        }
    }
    return Promise.reject(error)
}

const _redirectToLogin = () => {
    sso.logout()
}

export default Http
