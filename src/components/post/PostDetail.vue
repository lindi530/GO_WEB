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
        
      <div>阅读量：{{ post.view_count || 0 }}</div>
    </div>

    <div class="bg-light p-4 rounded shadow-sm mb-5">
      <p class="mb-0" style="white-space: pre-wrap;">{{ post.content }}</p>
    </div>
    <Comment :comments="comments" :postId="postId" 
      @new-comment="handleNewComment"
      @delete-comment="handleDeleteComment"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/api'
import Comment from '../comment/CommentList.vue'


const route = useRoute()
const postId = route.params.post_id


const post = ref({})
const comments = ref([])


onMounted(async () => {
  // 获取帖子
  const resp = await api.getPostByPostId(postId)
  console.log("resp: ", resp)
  post.value = resp.data

})

function handleNewComment(newC) {
  // 假设 newC 是新评论对象
  comments.value.comments.push(newC)
  comments.value.length += 1
}

function handleDeleteComment(commentId) {
  comments.value.comments = comments.value.comments.filter(
    comment => comment.id !== commentId
  );
  comments.value.length -= 1;
}

</script>

<style scoped>
.container {
  max-width: 800px;
}
</style>


