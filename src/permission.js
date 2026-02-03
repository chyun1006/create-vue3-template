import router from './router'
import sso from './utils/sso'

router.beforeEach(async (to) => {
  console.log('路由守卫:', to.path)

  if (to.query.token) {
    sso.setToken(to.query.token)
    console.log('Token 已存储:', to.query.token)

    const query = { ...to.query }
    delete query.token
    delete query.token_name
    delete query.sso_tenant_code
    delete query.sso_business_code

    return { path: to.path, query }
  }

  if (!to.meta.requiresAuth) {
    return true
  }

  // const isAuth = await sso.auth(to)
  // if (isAuth) {
  //   return true
  // }

  return true
})
