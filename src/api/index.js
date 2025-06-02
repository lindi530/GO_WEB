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
  followUser(targetUserId) {
    return request.post(`/users/${targetUserId}/follow`)
  },
  unFollowUser(targetUserId) {
    return request.delete(`/users/${targetUserId}/follow`)
  },
  getPostByPostId(postId) {
    return request.get(`posts/${postId}`)
  },
  getPostComments(postId) {
    return request.get(`posts/${postId}/comments`)
  },
  createPostComment(postId, newPost) {
    return request.post(`posts/${postId}/comments`, newPost)
  },
  likeComment(commentId) { 
    return request.post(`comment/${commentId}/like`)
  },
  unlikeComment(commentId) {
    return request.post(`comment/${commentId}/unlike`)
  },
  deleteComment(commentId) {
    return request.delete(`posts/comments/${commentId}`)
  },
  // 这里按需继续扩展接口
};
