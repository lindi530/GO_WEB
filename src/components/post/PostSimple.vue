<template>
  <div class="card mb-3">
    <!-- 卡片头部 -->
    <div class="card-header d-flex align-items-center justify-content-between">
      <!-- 左侧头像 -->
      <div class="me-3">
        <img :src="avatarImg" alt="头像" class="rounded-circle" width="40" height="40">
      </div>

      <!-- 中间用户名 + 时间 -->
      <div class="flex-grow-1">
        <div class="fw-bold">{{ post.author.user_name }}</div>
        <div class="text-muted small">{{ formatDate(post.updated_at) }}</div>
      </div>

      <!-- 右侧标题 -->
       <router-link
        :to="`/posts/${post.id}`"
        class="flex-grow-1 text-decoration-none text-body"
        >
        <div class="ms-3 text-end fw-bold">
            {{ post.title }}
        </div>
      </router-link>
      
    </div>

    <!-- 卡片内容 -->
    <div class="card-body p-2">
      <pre class="bg-light p-3 rounded overflow-auto" style="max-height: 300px">
{{ post.content }}
      </pre>
    </div>
  </div>
</template>


<script setup>
import avatarImg from '../test/1.png'
import { formatDate } from '@/utils/date'


const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})
console.log("props.post: ", props.post)

</script>

<style scoped>
pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: monospace;
}
</style>
