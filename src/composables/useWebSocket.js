// useWebSocket.js
import { ref } from 'vue'
import api from '@/api'

let ws = null
let isConnected = false
let accessToken = null

const messageMap = ref({})
const followedUsers = ref([])
const selectedUserId = ref(null)

const messageCache = ref([])
let pendingMessages = ref([])

export function initWebSocket(token) {
  if (isConnected || ws) return
  
  getFollowedUsers()
  console.log("getFollowedUsers:", followedUsers.value)

  accessToken = token
  ws = new WebSocket(`ws://localhost:8000/ws?token=${token}`)

  ws.onopen = () => {
    isConnected = true
    console.log('[WebSocket] connected')
    pendingMessages.value.forEach(msg => ws.send(JSON.stringify(msg)))
    pendingMessages.value = []
  }

  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data)

    if (followedUsers.value.length === 0) {
    // 关注列表还没准备好，先缓存消息
      messageCache.value.push(msg)
      return
    }

    processMessage(msg)
  }

  ws.onclose = () => {
    isConnected = false
    ws = null
    console.log('[WebSocket] closed')
  }
}
function processAllMessages() {
  messageCache.value.forEach(msg => processMessage(msg))
  messageCache.value = []  // 清空缓存
}
function processMessage(msg) {
  const from = msg.from
  if (!messageMap.value[from]) messageMap.value[from] = []
  messageMap.value[from].push(msg)
  console.log("followedUsers: ", followedUsers.value)
  const user = followedUsers.value.find(u => u.user_id === from)
  console.log("hasUnread", user)
  if (user) {
    user.hasUnread = true
  }
}

export function sendMessage(msg) {
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    if (!ws) {
      initWebSocket(localStorage.accessToken)
    }

    // 缓存消息
    pendingMessages.value.push(msg)
    console.log('[WebSocket] not ready, message cached:', msg)
    return
  }

  console.log("Sending message:", JSON.stringify(msg))
  ws.send(JSON.stringify(msg))
}



export function useWebSocketContext() {
  return {
    initWebSocket,
    messageMap,
    followedUsers,
    selectedUserId,
    sendMessage
  }
}

async function getFollowedUsers() {
  const resp = await api.getFollowUserList();
  if (resp.code === 0) {
    console.log("getFollowedUsers")
    console.log(resp.data.followUserList)
    followedUsers.value = resp.data.followUserList.map(u => ({ ...u, hasUnread: false }));

    processAllMessages()
  }
}