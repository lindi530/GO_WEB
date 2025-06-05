import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import './utils/request'
import naive from 'naive-ui'
import { restoreAuth } from './utils/auth'

restoreAuth(store)

createApp(App).use(router).use(naive).use(store).mount('#app')
