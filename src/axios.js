import axios from 'axios' 
import store from './store';  // 根据你的路径调整

// 设置基础 URL
axios.defaults.baseURL = '/';

// 请求拦截器：自动从 Vuex 拿 token
axios.interceptors.request.use(config => {
  const token = store.state.user.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));

// 响应拦截器（可选）：比如处理 401 或全局错误
axios.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      // Token 过期或未授权，清空 Vuex 并跳转登录
      store.commit('user/SET_ACCESSTOKEN', '');
      store.commit('user/SET_PROFILE', {});
      // router.push('/login');
    }
    return Promise.reject(err);
  }
);

export default axios;
