<template>
  <div class="container mt-5">
    <h2 class="text-center mb-3">{{ post.title }}</h2>

    <div class="d-flex justify-content-between text-muted mb-4">
      <div>作者：<strong>{{ post.author?.username }}</strong></div>
      <div>阅读量：{{ post.view_count || 0}}</div>
    </div>

    <div class="bg-light p-4 rounded shadow-sm mb-5">
      <p class="mb-0" style="white-space: pre-wrap;">{{ post.content }}</p>
    </div>

    <div class="bg-white p-4 rounded shadow-sm">
      <h5 class="mb-3">评论</h5>

      <div v-if="comments.length">
        <div v-for="comment in comments" :key="comment.id" class="border-bottom py-2">
          <strong>{{ comment.author.username }}</strong>
          <small class="text-muted ms-2">{{ formatDate(comment.created_at) }}</small>
          <p class="mb-1">{{ comment.content }}</p>
        </div>
      </div>
      <p v-else class="text-muted">暂无评论。</p>

      <div class="mt-3">
        <textarea v-model="newComment" class="form-control mb-2" rows="3" placeholder="写下你的评论..."></textarea>
        <button @click="submitComment" class="btn btn-primary">发表评论</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/api'

const route = useRoute()
const postId = route.params.post_id

console.log("postId: ", postId)

const post = ref({})
const comments = ref([])
const newComment = ref('')

onMounted(async () => {
  // 获取帖子
  const resp1 = await api.getPostByPostId(postId)
  console.log("resp1: ", resp1)
  post.value = resp1.data

  // 获取评论
  const resp2 = await api.getPostComments(postId)
  console.log("resp2: ", resp2)
  comments.value = resp2.data
})

async function submitComment() {
  if (!newComment.value.trim()) return

  const res = await api.createPost(postId, {
    content: newComment.value
  })

  console.log("res: ", res)

  const newC = await res.data
  comments.value.push(newC)
  newComment.value = ''
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
</script>

<style scoped>
.container {
  max-width: 800px;
}
</style>


