import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import './utils/request'


createApp(App).use(router).use(store).use(store).mount('#app')