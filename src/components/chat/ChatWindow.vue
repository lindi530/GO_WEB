<template>
    <div class="chat-header">
      <strong>与 {{ receiverName }} 聊天中</strong>
    </div>
      <div class="chat-container" ref="scrollContainer">
      <div class="chat-messages">
        <div v-for="(msg, index) in messages" :key="index" class="message-container">
          <div v-if="msg.from === userId" class="message-self">
            <div class="bubble-self">{{ msg.content }}</div>
            <img :src="userAvatar" class="avatar ms-2" />
          </div>
          <div v-else class="message-other">
            <img :src="receiverAvatar" class="avatar me-2" />
            <div class="bubble-other">{{ msg.content }}</div>
          </div>
        </div>
      </div>
   </div>
    <div class="chat-input">
      <n-input
        v-model:value="localMessage"
        placeholder="请输入消息..."
        @keydown.enter="$emit('send')"
        @input="val => $emit('update:newMessage', val)"
        style="flex: 1"
      />
      <n-button type="primary" @click="$emit('send')">发送</n-button>
    </div>

</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'

const props = defineProps({
  messages: Array,
  newMessage: String,
  userId: Number,
  userAvatar: String,
  receiverId: Number,
  receiverName: String,
  receiverAvatar: String
})

const scrollContainer = ref(null)

// 100% 有效的滚动函数
const scrollToBottom = () => {
  const container = scrollContainer.value
  if (!container) return
  
  // 强制样式确保可滚动
  container.style.overflowY = 'auto'
  container.style.display = 'block'
  
  // 双重保险滚动
  nextTick(() => {
    container.scrollTop = container.scrollHeight
    setTimeout(() => {
      container.scrollTop = container.scrollHeight
      // 最终极的保证方案
      if (container.scrollTop < container.scrollHeight - container.clientHeight) {
        container.style.height = 'auto'
        container.scrollTop = container.scrollHeight
      }
    }, 50)
  })
}

watch(() => props.messages, scrollToBottom, { deep: true, immediate: true })

const localMessage = computed({
  get: () => props.newMessage,
  set: () => {}
})

</script>

<style scoped>

.n-infinite-scroll {
  overflow-y: auto !important;
}

/* 顶部固定高 */
.chat-header {
  height: 40px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding: 0 12px;
}

.chat-container {
  height: 58vh;
  overflow-y: scroll !important; /* 强制显示滚动条 */
  position: relative;
}

.chat-messages {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  padding: 12px;
}

.message-container {
  margin-bottom: 16px;
}
.message-self, .message-other {
  display: flex;
  align-items: flex-end;
  max-width: 100%;
}

.message-self {
  justify-content: flex-end;
}

.message-other {
  justify-content: flex-start;
}

.bubble-self, .bubble-other {
  max-width: 70%;
  padding: 8px 12px;
  border-radius: 12px;
  word-wrap: break-word;
}

.bubble-self {
  background-color: #0eb840;
  color: white;
  border-bottom-right-radius: 0;
}

.bubble-other {
  background-color: white;
  border: 1px solid #ddd;
  border-bottom-left-radius: 0;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

/* 底部输入区域固定高 */
.chat-input {
  display: flex;
  gap: 8px;
  padding-top: 8px;
  border-top: 1px solid #ddd;
  background-color: #fff;
  flex-shrink: 0;
  height: 50px;
  box-sizing: border-box;
}
</style>