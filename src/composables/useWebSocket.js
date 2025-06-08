// useWebSocket.js
import { ref } from 'vue'
import api from '@/api'

let ws = null
let isConnected = false
let accessToken = null

const messageMap = ref({})
const followedUsers = ref([])
const selectedUserId = ref(null)

export function initWebSocket(token) {
  if (isConnected || ws) return
  
  getFollowedUsers()

  accessToken = token
  ws = new WebSocket(`ws://localhost:8000/ws?token=${token}`)

  ws.onopen = () => {
    isConnected = true
    console.log('[WebSocket] connected')
  }

  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data)
    const from = msg.from
    if (!messageMap.value[from]) messageMap.value[from] = []
    messageMap.value[from].push(msg)
    console.log("ws.onmessage: ", msg)
    const user = followedUsers.value.find(u => u.user_id === from)
    console.log(user)
    if (user) {
      user.hasUnread = true
    }
  }

  ws.onclose = () => {
    isConnected = false
    ws = null
    console.log('[WebSocket] closed')
  }
}

export function sendMessage(msg) {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(msg))
    } else {
    console.warn('[WebSocket] not connected')
  }
}

export function useWebSocketContext() {
  return {
    messageMap,
    followedUsers,
    selectedUserId,
    sendMessage
  }
}

async function getFollowedUsers() {
  const resp = await api.getUserList();
  if (resp.code === 0) {
    followedUsers.value = resp.data.userList.map(u => ({ ...u, hasUnread: false }));
  }
}