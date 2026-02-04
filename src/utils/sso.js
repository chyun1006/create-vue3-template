
import { APP_CONFIG } from '@/config/app.config'
import { SSOLogin } from '@airtravel/sso-login'

const sso = new SSOLogin({
  baseUrl: import.meta.env.VITE_APP_SSO_BASE_URL || 'http://air.uat.tcair.com',
  systemCode: APP_CONFIG.systemCode,
  requestHeaderConfig: {}
})

export default sso
