<template>
  <div class="container my-4">
    <div class="row">
      
      <UserProfileInfo 
        :user="user"/>

      <n-card class="col-md-9 mb-4">
        <n-tabs type="line" animated>
          <n-tab-pane name="posts" tab="帖子">
            <UserPosts 
              :posts="posts"
              @post-deleted="handlePostDeleted"
            />
          </n-tab-pane>
          <n-tab-pane name="submissions" tab="提交记录">
            <UserSubmissions 
              :author="user"
              @handle-error="handleError"
            />
          </n-tab-pane>
        </n-tabs>
      </n-card>
      
      
    </div>
      <NewPostForm @created="addPost" />
    </div>
</template>

<script setup>
import { useDialog } from 'naive-ui'
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import UserProfileInfo from '../components/profile/UserProfileInfo.vue';
import UserPosts from '../components/profile/UserPosts.vue';
import UserSubmissions from '../components/profile/UserSubmissions.vue';
import NewPostForm from '../components/profile/NewPostForm.vue';
import api from '@/api';

const user = ref({});
const posts = ref([]);

const route = useRoute();

const userId = computed(() => parseInt(route.params.userId));

async function addPost(post) {
  try {
    const res = await api.createPost(userId.value, { user_Id: userId.value, ...post });
    const newPost = res.data.post;
    posts.value.unshift(newPost);
  } catch {

  }
  if (typeof window !== 'undefined' && window.$toast) {
    window.$toast.success('Post created!');
  }
}

function handlePostDeleted(deletedPostId) {
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
  try {
    const profileResp = await api.getUserProfileInfo(userId.value);
    if (profileResp.code === 0) {
      console.log("profileResp:", profileResp)
      user.value = profileResp.data;
    } else {
      handleError("用户信息请求发送成功", "服务器响应失败")
    }
  } catch {
    handleError("用户信息请求发送失败", "")
  }

  try {
    const postsResp = await api.getPostsByUserId(userId.value);
    if (postsResp.code === 0) {
      posts.value = postsResp.data.posts;
    } else {
      handleError("帖子信息请求发送成功", "服务器响应失败")
    }
  } catch { 
    handleError("帖子信息请求发送失败", "")
  }
};

const dialog = useDialog()
const handleError = (content1, content2) => {
  dialog.error({
    title: '错误',
    content: content1 + '，' + content2,
    positiveText: '那好吧',
  })
}
</script>

<style scoped>
.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
