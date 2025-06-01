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

    <div class="bg-white p-4 rounded shadow-sm">
      <h5 class="mb-3">评论</h5>

      <div v-if="comments.length">
        <div
          v-for="comment in comments.comments"
          :key="comment.id"
          class="d-flex border-bottom py-3"
        >
          <!-- 左侧头像 -->
          <router-link
            :to="`/users/${comment.author.user_id}`"
            class="text-decoration-none"
          >
            <img
              :src="comment.author.avatar"
              alt="avatar"
              class="rounded-circle me-3"
              width="50"
              height="50"
            />
          </router-link>

          <!-- 右侧评论内容 -->
          <div class="flex-grow-1">
            <!-- 用户名和时间 -->
            <div class="d-flex justify-content-between align-items-center">
              <router-link
                :to="`/users/${comment.author.user_id}`"
                class="text-dark text-decoration-none"
              >
                <strong>{{ comment.author.user_name }}</strong>
              </router-link>
              <small class="text-muted">{{ formatDate(comment.created_at) }}</small>
            </div>

            <!-- 评论内容 -->
            <p class="mb-0 mt-1">{{ comment.content }}</p>
          </div>
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
import { formatDate } from '@/utils/date'

const route = useRoute()
const postId = route.params.post_id


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

  const res = await api.createPostComment(postId, {
    content: newComment.value
  })

  console.log("res: ", res)


  const newC = await res.data 
  comments.value.length += 1
  comments.value.comments.push(newC)
  newComment.value = ''
}


</script>

<style scoped>
.container {
  max-width: 800px;
}
</style>


