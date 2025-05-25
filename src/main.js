import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import './utils/request'
import naive from 'naive-ui'


createApp(App).use(router).use(naive).use(store).use(store).mount('#app')