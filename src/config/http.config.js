import { ElMessage } from 'element-plus'
import sso from '@/utils/sso'
import { SERVER_URL, TOKEN_NAME } from '@/config/app.config'

const httpConfig = {
  default: {
    baseURL: SERVER_URL || '/amtcapi',
    timeout: 60000 * 5, // 请求超时时间
    // 自定义request拦截器
    requestInterceptorFun: (config) => {
      config.headers[TOKEN_NAME] = sso.getToken()
      return config
    },
    responseInterceptorFun: (response) => {
      if (!response.success) {
        ElMessage.error(response.errorMessage)
      }
      return response
    }
  }
}

export default httpConfig
