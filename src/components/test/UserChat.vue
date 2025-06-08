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
        :receiver-id="selectedUserId"
        :receiver-avatar="receiverAvatar"
        v-model:new-message="newMessage"
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
const messageMap = ref({})
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

      if (!messageMap.value[msg.from]) {
        messageMap.value[msg.from] = []
      }

      // 添加到对应用户的消息记录
      if (msg.type === 'chat') {
        messageMap.value[msg.from].push(msg)
      }
      // 添加消息类型检查
      console.log("Msg: ", msg)
      console.log("selectedUserId.value: ", selectedUserId.value)
      if (msg.from === selectedUserId.value) {
        if (msg.type === 'chat') {
          
          nextTick(() => chatRef.value?.scrollToBottom())
        } else if (msg.type === 'notification') {
          // 处理通知类消息
          toast.info(msg.content)
        }
      } else {
        // 🔔 比如设置这个用户为“有未读消息”
        const user = followedUsers.value.find(u => u.user_id === msg.from)
        if (user) user.hasUnread = true  // 你需要维护这个字段
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

const handleSelectUser = async (id) => {
  selectedUserId.value = id

  const user = followedUsers.value.find(u => u.user_id === id)
  if (user) user.hasUnread = false

  if (!messageMap.value[id]) {
    console.log("发送请球")
    const res = await api.getMessageByTargetId(id)
    if (res.code === 0) {
      messageMap.value[id] = res.data
    }
  }
  initWebSocket()
}

const messages = computed(() => {
  return messageMap.value[selectedUserId.value] || []
})

const handleSendMessage = () => {
  if (!newMessage.value || !selectedUserId.value) return

  const msg = {
    type: "chat",
    from: userId.value,
    to: selectedUserId.value,
    content: newMessage.value,
  }

  if (!messageMap.value[selectedUserId.value]) {
    messageMap.value[selectedUserId.value] = []
  }

  ws.value?.send(JSON.stringify(msg))
  messageMap.value[selectedUserId.value].push(msg)
  newMessage.value = ''
  nextTick(() => chatRef.value?.scrollToBottom())
}

onMounted(async () => {
  const resp = await api.getUserList()
  if (resp.code === 0) {
    console.log("followedUsers: ", resp.data)
    followedUsers.value = resp.data.userList.map(user => ({
      ...user,
      hasUnread: false
    }))
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
