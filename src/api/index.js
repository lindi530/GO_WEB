import request from '@/utils/request';

export default {
  login(payload) {
    return request.post('/users/login', payload);
  },
  getPosts(userId) {
    return request.get(`/users/${userId}/posts`);
  },
  createPost(userId, postdata) {
    return request.post(`/users/${userId}/post`, postdata);
  },
  register(postdata) {
    return request.post('users/register', postdata)
  },
  getProfile() {
    return request.get('/users/me/');
  },
  // 这里按需继续扩展接口
};
