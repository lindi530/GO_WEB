import request from '@/utils/request';

export default {
  login(payload) {
    return request.post('/users/login', payload);
  },
  getAllPosts() {
    return request.get('/posts')
  },
  getUserList() {
    return request.get('users/userlist')
  },
  getPostsByUserId(userId) {
    return request.get(`/users/${userId}/posts`);
  },
  createPost(userId, postdata) {
    return request.post(`/users/${userId}/posts/create`, postdata);
  },
  register(postdata) {
    return request.post('/users/register', postdata)
  },
  deletePost(userId, postId) {
    return request.delete(`/users/${userId}/posts/${postId}`)
  },
  // 这里按需继续扩展接口
};
