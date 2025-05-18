<template>
  <div class="container my-4">
    <div class="row">
      <UserInfo :user="user" />
      <UserPosts :posts="posts" />
    </div>
    <NewPostForm @created="addPost" />
  </div>
</template>
<script>
import UserInfo from '../components/UserInfo.vue';
import UserPosts from '../components/UserPosts.vue';
import NewPostForm from '../components/NewPostForm.vue';

export default {
  name: 'UserDashboard',
  components: { UserInfo, UserPosts, NewPostForm },
  data() {
    return {
      user: {
        avatar: 'https://via.placeholder.com/100',
        name: 'John Doe',
        email: 'john@example.com',
        joined: '2024-01-15'
      },
      posts: [
        { id: 1, title: 'First Post', date: '2025-05-01', excerpt: 'This is the first post...' },
        { id: 2, title: 'Another Post', date: '2025-05-10', excerpt: 'More content here...' }
      ]
    };
  },
  methods: {
    addPost(post) {
      this.posts.unshift(post);
      this.$toast?.success('Post created!');
    }
  }
};
</script>

<style scoped>
.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
