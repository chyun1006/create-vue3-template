import httpConfig from '@/config/http.config'
import Http from '@/utils/request'
const http = new Http(httpConfig.default)

export const queryCategoryList = (params) =>
  http.post('/trainCategory/queryTreeList', { t: params || {} })
