<template>
  <div class="container mt-5">
    <h2 class="text-center mb-3">{{ post.title }}</h2>

    <div class="d-flex justify-content-between align-items-center text-muted mb-4">
      <div class="d-flex align-items-center">
        <span class="me-1">作者：</span>
        <router-link
          :to="`/users/${post.author?.user_id}`"
          class="d-flex align-items-center text-decoration-none text-dark"
        >
          <img
            :src="post.author?.avatar"
            alt="avatar"
            class="rounded-circle me-2"
            width="32"
            height="32"
          />
          <strong>{{ post.author?.user_name }}</strong>
        </router-link>
      </div>
        
      <div>阅读量：{{ post.views || 0 }}</div>
    </div>

    <div class="bg-light p-4 rounded shadow-sm" style="margin-bottom: 12px;">
      <p class="mb-0" style="white-space: pre-wrap;">{{ post.content }}</p>
    </div>

    <div class="d-flex align-items-center">
      <button
        class="btn btn-outline-primary d-flex align-items-center"
        @click="likePost"
      >
        <i class="bi bi-hand-thumbs-up me-2"> {{LikeMassage}} </i>  {{ post.likes || 0 }}
      </button>
    </div>
    <CommentList :postId="postId" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/api'
import CommentList from '../comment/CommentList.vue'


const route = useRoute()
const postId = route.params.post_id

const likeMsg = '取消点赞'
const UnLikeMsg = '点赞'



const post = ref({})

onMounted(async () => {
  // 获取帖子
  const resp = await api.getPostByPostId(postId)
  console.log("resp: ", resp)
  post.value = resp.data
  
})

const LikeMassage = computed(() => {
  return post.value.like ? likeMsg : UnLikeMsg
})

const likePost = async () => {
  if (post.value.like === false) {
    const res = await api.likePost(postId)
    if (res.code === 0) {
      post.value.likes = (post.value.likes + 1 || 0)
      post.value.like = !post.value.like
      window.$toast?.success?.('点赞成功') || alert('点赞成功')
    } else {
      window.$toast?.error?.(res.message || '点赞失败') || alert('点赞失败')
    }
  } else {
    const res = await api.unLikePost(postId)
    if (res.code === 0) {
      post.value.likes = (post.value.likes - 1 || 0)
      post.value.like = !post.value.like
      window.$toast?.success?.('取消点赞成功') || alert('取消点赞成功')
    } else {
      window.$toast?.error?.(res.message || '取消点赞失败') || alert('取消点赞失败')
    }
  }
}

</script>

<style scoped>
.container {
  max-width: 800px;
}
</style>


