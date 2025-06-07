<template>
  <n-modal v-model:show="showModal" preset="card" title="聊天窗口" style="width: 80vw; height: 80vh;">
    <div style="display: flex; height: 100%;">
      <FollowList
        :followed-users="followedUsers"
        :selectedUserId="selectedUserId"
        @select="handleSelectUser"
      />
      <ChatWindow
        :messages="messages"
        :user-id="userId"
        :user-avatar="userAvatar"
        :receiver-avatar="receiverAvatar"
        :new-message="newMessage"
        @update:new-message="val => newMessage = val"
        @send="handleSendMessage"
        ref="chatRef"
      />
    </div>
  </n-modal>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useMessage } from 'naive-ui'

import FollowList from './FollowList.vue'
import ChatWindow from './ChatWindow.vue'
import api from '@/api'

const store = useStore()
const toast = useMessage()

const showModal = ref(true)
const followedUsers = ref([])
const selectedUserId = ref(null)
const messages = ref([])
const newMessage = ref('')
const ws = ref(null)

const userId = computed(() => store.getters['user/userId'])
const userAvatar = computed(() => store.getters['user/userAvatar'])
const accessToken = computed(() => store.getters['user/accessToken'])

const chatRef = ref(null)

const initWebSocket = () => {
  if (!selectedUserId.value) return
  if (ws.value) ws.value.close()

  const wsUrl = `ws://localhost:8000/ws?token=${accessToken.value}&to=${selectedUserId.value}`
  ws.value = new WebSocket(wsUrl)

  ws.value.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data)
      console.log("onmessage: ", msg)
      // 添加消息类型检查
      if (msg.type === 'chat') {
        messages.value.push(msg)
        nextTick(() => chatRef.value?.scrollToBottom())
      } else if (msg.type === 'notification') {
        // 处理通知类消息
        toast.info(msg.content)
      }
    } catch (e) {
      console.error('WebSocket 消息解析错误:', e)
    }
  }

  ws.value.onerror = () => {
    // toast.error('WebSocket 连接失败，请检查服务是否启动')
  }

  ws.value.onclose = () => {
    // toast.warning('WebSocket 已断开')
  }
}

const handleSelectUser = (id) => {
  selectedUserId.value = id
  messages.value = []
  initWebSocket()
}

const handleSendMessage = () => {
  if (!newMessage.value || !selectedUserId.value) return

  const msg = {
    type: "chat",
    from: userId.value,
    to: selectedUserId.value,
    content: newMessage.value,
  }


  ws.value?.send(JSON.stringify(msg))
  messages.value.push(msg)
  newMessage.value = ''
  nextTick(() => chatRef.value?.scrollToBottom())
}

onMounted(async () => {
  const resp = await api.getUserList()
  if (resp.code === 0) {
    console.log("followedUsers: ", resp.data)
    followedUsers.value = resp.data.userList
  }  
})

const receiverAvatar = computed(() => {
  const user = followedUsers.value.find(user => user.user_id === selectedUserId.value)
  console.log("receiverAvatar updated:", user?.avatar) // 调试用
  return user?.avatar // 提供默认值
})

onBeforeUnmount(() => {
  ws.value?.close()
})
</script>
