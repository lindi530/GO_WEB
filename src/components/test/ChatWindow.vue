<template>
  <div style="width: 70%; padding: 10px; display: flex; flex-direction: column;">
    <!-- 消息显示区 -->
    <div ref="container" class="scrollable border p-3 mb-3 bg-light rounded" style="flex: 1; overflow-y: auto;">
      <div v-for="(msg, index) in messages" :key="index" class="mb-3">
        <!-- 自己发送的消息 -->
        <div v-if="msg.from === userId" class="message-self mb-3">
        <div class="bubble-self">{{ msg.content }}</div>
        <img :src="userAvatar" class="avatar ms-2" />
        </div>

        <!-- 对方发送的消息 -->
        <div v-else class="message-other mb-3">
            <img :src="receiverAvatar" class="avatar me-2" />
            <div class="bubble-other">{{ msg.content }}</div>
        </div>
      </div>
    </div>

    <!-- 输入框 -->
    <div class="mt-2" style="display: flex; gap: 8px;">
    <n-input
        v-model:value="localMessage"
        placeholder="请输入消息..."
        @keydown.enter="$emit('send')"
        @input="val => $emit('update:newMessage', val)"
        style="flex: 1;"
    />
    <n-button type="primary" @click="$emit('send')">发送</n-button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, nextTick } from 'vue'

const props = defineProps({
  messages: Array,
  newMessage: String,
  userId: Number,
  userAvatar: String,
  receiverAvatar: String
})

const localMessage = computed({
  get: () => props.newMessage,
  set: (val) => {}
})

const container = ref(null)

const scrollToBottom = () => {
  nextTick(() => {
    if (container.value) {
      container.value.scrollTop = container.value.scrollHeight
    }
  })
}

defineExpose({
  scrollToBottom
})

</script>

<style scoped>
.scrollable {
  overflow-y: auto;
  background-color: #f5f5f5;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid #ccc; /* 添加边框 */
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); /* 可选：轻微阴影增强层次感 */
}

.message-self,
.message-other {
  display: flex;
  align-items: center;
  max-width: 100%;
}

.message-self {
  justify-content: flex-end;
}

.message-other {
  justify-content: flex-start;
}

.bubble-self {
  background-color: #95ec69;
  color: black;
  padding: 8px 12px;
  border-radius: 16px;
  max-width: 60%;
  word-wrap: break-word;
  white-space: pre-wrap;
  font-size: 14px;
  line-height: 1.5;
}

.bubble-other {
  background-color: #ffffff;
  padding: 8px 12px;
  border-radius: 16px;
  max-width: 60%;
  word-wrap: break-word;
  white-space: pre-wrap;
  font-size: 14px;
  line-height: 1.5;
  border: 1px solid #ddd;
}

</style>
