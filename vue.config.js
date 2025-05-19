module.exports = {
  devServer: {
    proxy: {
      // 当请求以 /api 开头时，将请求代理到后端服务
      '/users': {
        target: process.env.VUE_APP_API_BASE,
        changeOrigin: true,
      }
    }
  }
};
