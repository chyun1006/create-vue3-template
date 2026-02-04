import httpConfig from '@/config/http.config'
import Http from '@/utils/request'

export const defaultRequest = new Http(httpConfig.default)
