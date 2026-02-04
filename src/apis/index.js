import httpConfig from '@/config/http.config'
import Http from '@/utils/http'

export const defaultRequest = new Http(httpConfig.default)
