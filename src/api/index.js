import request from '@/utils/request';

export default {
  login(payload) {
    return request.post('/users/login', payload);
  },
  upLoadAvatar(userId, formData) {
    return request.post(`/users/${userId}/modify_avatar`, formData);
  },
  modifyUserProfile(userId, formData) {
    return request.patch(`/users/${userId}/profile`, formData);
  },
  getUserProfileInfo(userId) {
    return request.get(`/users/${userId}`)
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
  checkFollowing(targetUserId) {
    return request.get(`/users/${targetUserId}/is_following`)
  },
  followUser(targetUserID) {
    return request.post(`/users/${targetUserID}/follow`)
  },
  unFollowUser(targetUserID) {
    return request.delete(`/users/${targetUserID}/follow`)
  },
  getPostByPostId(postID) {
    return request.get(`posts/${postID}`)
  },
  getPostComments(postID) {
    return request.get(`posts/${postID}/comments`)
  },
  createPostComment(postID, newPost) {
    return request.post(`posts/${postID}/comments`, newPost)
  },
  // 这里按需继续扩展接口
};
