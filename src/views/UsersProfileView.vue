<template>
  <div class="container my-4">
    <div class="row">
      <UserProfileInfo :user="user" />
      <UserPosts :posts="posts"
                 @post-deleted="handlePostDeleted"
       />
    </div>
      <NewPostForm @created="addPost" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import UserProfileInfo from '../components/profile/UserProfileInfo.vue';
import UserPosts from '../components/profile/UserPosts.vue';
import NewPostForm from '../components/profile/NewPostForm.vue';
import api from '@/api';

const user = ref({});
const posts = ref([]);

const route = useRoute();

const userId = computed(() => parseInt(route.params.userId));

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
  console.log("userIdFromRoute: ", userId.value)
  loadUserProfile()
});

watch(
  () => route.params.userId,
  (newUserId, oldUserId) => {
    if (newUserId !== oldUserId) {
      loadUserProfile();
    }
  }
);

const loadUserProfile = async () => {
  const profileResp = await api.getUserProfileInfo(userId.value);
  if (profileResp.code === 0) {
    user.value = profileResp.data;
  }
  console.log("loadUserProfile: ", user.value)
  const postsResp = await api.getPostsByUserId(userId.value);
  if (postsResp.code === 0) {
    posts.value = postsResp.data.posts;
  }
  console.log("postsResp: ", posts.value)
};
</script>

<style scoped>
.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
