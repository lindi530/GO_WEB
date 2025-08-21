<template>
  <Teleport to="body">
    <div
      v-show="showModal"
      ref="modalRoot"
      class="floating-chat-window"
      :style="{ top: position.top + 'px', left: position.left + 'px' }"
    >
      <n-card
        title="聊天窗口"
        closable
        @close="showModal = false"
        class="chat-card"
        @mousedown.stop="startDrag"
      >
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
      </n-card>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount, onMounted } from 'vue'
import { useStore } from 'vuex'
import FollowList from '../chat/FollowList.vue'
import ChatWindow from '../chat/ChatWindow.vue'
import api from '@/api'
import { useWebSocketContext } from '@/composables/useWebSocket'

const props = defineProps({
  visible: { type: Boolean, required: true }
})
const emit = defineEmits(['update:visible'])

const store = useStore()
const { messageMap, followedUsers, selectedUserId, sendMessage } = useWebSocketContext()

const userId = computed(() => store.getters['user/userId'])
const userAvatar = computed(() => store.getters['user/userAvatar'] || '/default-avatar.png')

const showModal = ref(props.visible)
const modalRoot = ref(null)

watch(() => props.visible, (val) => {
  showModal.value = val
})
watch(showModal, (val) => {
  if (!val) emit('update:visible', false)
})

function onClickOutside(event) {
  if (showModal.value && modalRoot.value && !modalRoot.value.contains(event.target)) {
    emit('update:visible', false)
  }
}


// 挂载和卸载全局监听事件
onMounted(() => {
  document.addEventListener('mousedown', onClickOutside)
})
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onClickOutside)
})

const newMessage = ref('')
const chatRef = ref(null)

const messages = computed(() => messageMap.value[selectedUserId.value] || [])

const selectedUserAvatar = computed(() => {
  const u = followedUsers.value.find(u => u.user_id === selectedUserId.value)
  return u?.avatar || ''
})

const selectedUserName = computed(() => {
  const u = followedUsers.value.find(u => u.user_id === selectedUserId.value)
  return u?.user_name || ''
})

async function handleSelectUser(id) {
  selectedUserId.value = id
  const user = followedUsers.value.find(u => u.user_id === id)
  if (user) user.hasUnread = false

  if (!messageMap.value[id]) {
    try { 
      const res = await api.getMessageByTargetId(id)
      if (res.code === 0) {
        messageMap.value[id] = res.data
      }
    } catch { 
      console.error('发送请求失败:', error);
    }
  }
}

function handleSendMessage() {
  
  if (!newMessage.value || !selectedUserId.value) return
  const msg = {
    type: 'chat',
    from: userId.value,
    to: selectedUserId.value,
    content: newMessage.value
  }
  messageMap.value[selectedUserId.value] = messageMap.value[selectedUserId.value] || []
  messageMap.value[selectedUserId.value].push(msg)
  console.log("msg: ", msg)
  sendMessage(msg)
  newMessage.value = ''
}

// 拖动逻辑
const position = ref({ top: 100, left: 100 })
let dragging = false
let offsetX = 0
let offsetY = 0

const startDrag = (e) => {
  dragging = true
  offsetX = e.clientX - position.value.left
  offsetY = e.clientY - position.value.top
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

const onDrag = (e) => {
  if (!dragging) return
  position.value.left = e.clientX - offsetX
  position.value.top = e.clientY - offsetY
}

const stopDrag = () => {
  dragging = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}

onBeforeUnmount(() => {
  stopDrag()
})
</script>

<style scoped>
.floating-chat-window {
  width: 60vw;
  height: 70vh;
  position: fixed;
  right: 40px;
  bottom: 80px;
  display: flex;
  flex-direction: column;  
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.chat-card {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0;
  box-sizing: border-box;
  overflow: hidden;
  cursor: move; /* 鼠标拖动提示 */
}

.chat-layout {
  display: flex;
  height: 100%;
  overflow: hidden;
}

.left-sidebar {
  width: 12vw;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.right-chat {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;    /* ✅ 关键！允许子元素收缩 */
}
</style>
