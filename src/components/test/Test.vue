<template>
  <div>
    <button @click="sendMessage" :disabled="loading" class="btn btn-primary">
      {{ loading ? '发送中...' : '发送消息' }}
    </button>
    <p v-if="success" class="text-success mt-2">消息发送成功！</p>
    <p v-if="error" class="text-danger mt-2">发送失败：{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/api'

const loading = ref(false)
const success = ref(false)
const error = ref('')

async function sendMessage() {
  loading.value = true
  success.value = false
  error.value = ''

  try {
    const response = await api.match()

    if (response.ok) {
      throw new Error(`HTTP错误 ${response.status}`)
    }

    success.value = true
  } catch (err) {
    error.value = err.message || '未知错误'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
