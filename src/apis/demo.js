import { defaultRequest as http } from './index'

export const queryCategoryList = (params) => http.post('/trainCategory/queryTreeList', { t: params || {} })
