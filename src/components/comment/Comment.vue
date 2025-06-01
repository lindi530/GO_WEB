<template>
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
                <!-- 第一行：用户名 + 时间 + 点赞 + 删除 -->
                <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <!-- 左侧：用户名、时间、点赞 -->
                    <div class="d-flex align-items-center flex-wrap gap-2">
                    <router-link
                        :to="`/users/${comment.author.user_id}`"
                        class="text-dark text-decoration-none"
                    >
                        <strong>{{ comment.author.user_name }}</strong>
                    </router-link>

                    <small class="text-muted">{{ formatDate(comment.created_at) }}</small>

                    <!-- 点赞按钮 -->
                    <button
                        class="btn btn-sm btn-outline-secondary px-1 py-0 d-flex align-items-center"
                        style="font-size: 0.75rem;"
                        @click="likeComment(comment.id)"
                    >
                        <img
                        :src="image"
                        alt="点赞"
                        width="16"
                        height="16"
                        />
                        <span class="ms-1">{{ comment.likes || 0 }}</span>
                    </button>
                    </div>

                    <!-- 右侧：删除按钮 -->
                    <button
                    class="btn btn-sm btn-outline-danger px-1 py-0"
                    style="font-size: 0.75rem;"
                    @click="deleteComment(comment.id)"
                    >
                    <i class="bi bi-trash"></i>
                    </button>
                </div>

                <!-- 第二行：评论内容 -->
                <p class="mb-0 mt-1">{{ comment.content }}</p>
                </div>
            </div>
        </div>

      <div class="mt-3">
        <textarea v-model="newComment" class="form-control mb-2" rows="3" placeholder="写下你的评论..."></textarea>
        <button @click="submitComment" class="btn btn-primary">发表评论</button>
      </div>
    </div>
</template>

<script setup>
import api from '@/api'
import { ref, onMounted } from 'vue'
import { formatDate } from '@/utils/date'
import image from '../../../public/voteup-empty.png'

const props = defineProps({
  postId: Number,
  comments: Array,
})


const emit = defineEmits(['new-comment'])

const newComment = ref('')

async function submitComment() {
  if (!newComment.value.trim()) return

  const res = await api.createPostComment(props.postId, {
    content: newComment.value
  })

  const newC = res.data
  emit('new-comment', newC) // 通知父组件更新 comments
  newComment.value = ''
}

</script>