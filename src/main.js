import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import './utils/request'
import naive from 'naive-ui'
import { restoreAuth } from './utils/auth'


import { createPinia } from 'pinia'

const pinia = createPinia()

restoreAuth(store).then(() => { 
    createApp(App).use(router).use(naive).use(store).use(pinia).mount('#app')
})


