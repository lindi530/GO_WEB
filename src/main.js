import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import './axios'


createApp(App).use(router).use(store).use(store).mount('#app')