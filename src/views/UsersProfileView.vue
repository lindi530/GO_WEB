<template>
  <div class="container my-4">
    <div class="row">
      <UserProfileInfo :user="userProfile" />
      <UserPosts :posts="posts"
                 @post-deleted="handlePostDeleted"
       />
    </div>
      <NewPostForm @created="addPost" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import UserProfileInfo from '../components/UserProfileInfo.vue';
import UserPosts from '../components/UserPosts.vue';
import NewPostForm from '../components/NewPostForm.vue';
import api from '@/api';

const userProfile = ref({});
const posts = ref([]);

const route = useRoute();
const store = useStore();

const userId = computed(() => store.getters['user/userId']);

async function addPost(post) {
  const res = await api.createPost(userId.value, { user_Id: userId.value, ...post });
  const newPost = res.data.post;
  posts.value.unshift(newPost);
  if (typeof window !== 'undefined' && window.$toast) {
    window.$toast.success('Post created!');
  }
}

function handlePostDeleted(deletedPostId) {
  console.log('deletedPostId: ', deletedPostId);
  posts.value = posts.value.filter(post => post.id !== deletedPostId);
}

onMounted(async () => {
  const userIdFromRoute = parseInt(route.params.userId);
  const profileResp = await api.getUserProfileInfo(userIdFromRoute);
  if (profileResp.code === 0) {
    userProfile.value = profileResp.data;
  }

  const postsResp = await api.getPostsByUserId(userIdFromRoute);
  if (postsResp.code === 0) {
    posts.value = postsResp.data.posts;
  }
});
</script>

<style scoped>
.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
