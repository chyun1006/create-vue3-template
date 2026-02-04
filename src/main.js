import { createApp } from 'vue'
import { createPinia } from 'pinia'

import '@/assets/styles/index.scss'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import sso from './utils/sso'
import uiComponents from './components/ui'
import './permission'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(uiComponents)
app.directive('permission', sso.createPermissionDirective())
app.provide('sso', sso)

app.mount('#app')
