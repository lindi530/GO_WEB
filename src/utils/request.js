// src/utils/request.js
import axios from 'axios'
import store from '@/store'
import router from '@/router'

const request = axios.create({
  baseURL: process.env.VUE_APP_API_BASE || 'http://localhost:8000',
  timeout: 10000
})

// 请求拦截器
request.interceptors.request.use(config => {
  const token = store.getters['user/accessToken']
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, error => Promise.reject(error))

// 响应拦截器
request.interceptors.response.use(
  res => res.data,
  error => {
    const status = error.response?.status
    console.error('[RESPONSE ERROR]', error)

    if (status === 401) {
      store.commit('user/SET_ACCESSTOKEN', '')
      store.commit('user/SET_PROFILE', {})
      router.push('/login')
      return new Promise(() => {}) // 阻止后续 catch
    }

    if (status === 404) {
      router.push('/404')
      return new Promise(() => {}) // 阻止后续 catch
    }

    return Promise.reject(error)
  }
)

export default request