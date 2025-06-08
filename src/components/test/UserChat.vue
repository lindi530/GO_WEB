<template>
  <n-modal
  v-model:show="showModal"
  preset="card"
  title="聊天窗口"
  style="width: 80vw; max-width: 1200px; height: 80vh; max-height: 800px;">
    <div class="chat-layout">
      <div class="left-sidebar">
        <FollowList
          :followed-users="followedUsers"
          :selected-user-id="selectedUserId"
          @select="handleSelectUser"
        />
      </div>
      <div class="right-chat">
        <ChatWindow
          :messages="messages"
          :user-id="userId"
          :user-avatar="userAvatar"
          :receiver-id="selectedUserId"
          :receiver-name="selectedUserName"
          :receiver-avatar="selectedUserAvatar"
          v-model:new-message="newMessage"
          @send="handleSendMessage"
          ref="chatRef"
        />
      </div>
    </div>
  </n-modal>
</template>

<script setup>
import { ref, computed, nextTick, onMounted } from 'vue'
import { useStore } from 'vuex'

import FollowList from './FollowList.vue'
import ChatWindow from './ChatWindow.vue'
import api from '@/api'
import { useWebSocketContext } from '@/composables/useWebSocket'

const store = useStore()

const showModal = ref(true)
const newMessage = ref('')
const chatRef = ref(null)

const userId = computed(() => store.getters['user/userId'])
const userAvatar = computed(() => store.getters['user/userAvatar'])

const { messageMap, followedUsers, selectedUserId, sendMessage } = useWebSocketContext()

const messages = computed(() => messageMap.value[selectedUserId.value] || [])

const selectedUserAvatar = computed(() => {
  const u = followedUsers.value.find(u => u.user_id === selectedUserId.value)
  return u?.avatar || ''
})

const selectedUserName = computed(() => {
  const u = followedUsers.value.find(u => u.user_id === selectedUserId.value)
  return u?.user_name || ''
})

const handleSelectUser = async (id) => {
  selectedUserId.value = id
  const user = followedUsers.value.find(u => u.user_id === id)
  if (user) user.hasUnread = false

  if (!messageMap.value[id]) {
    const res = await api.getMessageByTargetId(id)
    if (res.code === 0) {
      messageMap.value[id] = res.data
    }
  }
}

const handleSendMessage = () => {
  if (!newMessage.value || !selectedUserId.value) return
  const msg = {
    type: 'chat',
    from: userId.value,
    to: selectedUserId.value,
    content: newMessage.value
  }
  messageMap.value[selectedUserId.value] = messageMap.value[selectedUserId.value] || []
  messageMap.value[selectedUserId.value].push(msg)
  sendMessage(msg)
  newMessage.value = ''
}

</script>

<style scoped>
.n-modal .n-card {
  width: 80vw !important;
  height: 80vh !important;
  max-height: 800px !important;
  min-height: 600px !important; /* 可以调整 */
  display: flex !important;
  padding: 0 !important;
  box-sizing: border-box !important;
  overflow: hidden;
  flex-direction: row;
}

.chat-layout {
  display: flex;
  height: 100%;
  width: 100%;
  overflow: hidden; /* 防止子元素溢出整个 modal */
}

.left-sidebar {
  width: 250px;
  height: 100%;
  max-height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.left-sidebar .follow-list {
  height: 100%;
}

.right-chat {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>