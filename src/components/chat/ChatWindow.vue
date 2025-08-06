<template>
  <div class="chat-wrapper">
    <!-- 顶部栏 -->
    <div class="chat-header">
      <strong>与 {{ receiverName }} 聊天中</strong>
    </div>

    <!-- 聊天内容区域 -->
    <div class="chat-body" ref="scrollContainer">
      <div class="chat-messages">
        <div
          v-for="(msg, index) in messages"
          :key="index"
          class="message-container"
        >
          <div v-if="msg.data.from === userId" class="message-self">
            <div class="bubble-self">{{ msg.data.content }}</div>
            <img :src="userAvatar" class="avatar" />
          </div>
          <div v-else class="message-other">
            <img :src="receiverAvatar" class="avatar" />
            <div class="bubble-other">{{ msg.data.content }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部输入框 -->
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
  receiverAvatar: String,
})

const scrollContainer = ref(null)

const scrollToBottom = () => {
  nextTick(() => {
    if (scrollContainer.value) {
      scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight
    }
  })
}

watch(() => props.messages, scrollToBottom, { deep: true, immediate: true })

const localMessage = computed({
  get: () => props.newMessage,
  set: () => {},
})
</script>

<style scoped>
.chat-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 62vh;
  border: 1px solid #ccc;
  box-sizing: border-box;
}

.chat-header {
  flex-shrink: 0;
  height: 48px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
}

.chat-body {
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 12px;
  background-color: #fff;
}

.chat-messages {
  display: flex;
  flex-direction: column;
}

.message-container {
  margin-bottom: 12px;
}

.message-self,
.message-other {
  display: flex;
  align-items: flex-end;
}

.message-self {
  justify-content: flex-end;
}

.message-other {
  justify-content: flex-start;
}

.bubble-self,
.bubble-other {
  max-width: 60%;
  padding: 10px 14px;
  border-radius: 12px;
  word-break: break-word;
  font-size: 14px;
}

.bubble-self {
  background-color: #0eb840;
  color: white;
  border-bottom-right-radius: 0;
}

.bubble-other {
  background-color: #f1f1f1;
  color: #000;
  border: 1px solid #ddd;
  border-bottom-left-radius: 0;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin: 0 8px;
  object-fit: cover;
}

.chat-input {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-top: 1px solid #ddd;
  background-color: #fff;
}
</style>
