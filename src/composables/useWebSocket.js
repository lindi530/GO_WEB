// useWebSocket.js
import { ref, toHandlerKey } from 'vue'
import api from '@/api'

let ws = null
let isConnected = false

const messageMap = ref({})
const followedUsers = ref([])
const selectedUserId = ref(null)

const messageCache = ref([])
let pendingMessages = ref([])
const submitCodeCallbacks = ref([])

export function registerSubmitCodeCallback(callback) {
  submitCodeCallbacks.value.push(callback)
  console.log("注册了一个回调，当前回调总数：", submitCodeCallbacks.value.length)
  // 返回注销函数，避免组件卸载后仍执行
  return () => {
    submitCodeCallbacks.value = submitCodeCallbacks.value.filter(cb => cb !== callback)
  }
}


export function initWebSocket(token) {

  console.log("isConnected: ", isConnected, "    ws: ", ws)
  // if (isConnected || ws) return
  if (ws && ws.readyState === WebSocket.OPEN) return

  console.log("建立连接：", token)

  ws = new WebSocket(`ws://localhost:8000/ws?token=${token}`)
  console.log("完成连接")

  getFollowedUsers()
  console.log("getFollowedUsers:", followedUsers.value)
  

  ws.onopen = () => {
    isConnected = true
    console.log('WebSocket连接成功')
    pendingMessages.value.forEach(msg => ws.send(JSON.stringify(msg)))
    pendingMessages.value = []
  }

  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data)
    console.log("onmessage", msg)
    switch (msg.type) { 
      case "chat":
        handleChat(msg)
        break;
      case "edit_status":
        handleSubmitCode(msg)
        break;
      case "online_status":
        handleOnlineStatus(msg)
        break;
    }
  }
  // 链接关闭
  ws.onclose = () => {
    isConnected = false
    ws = null
    console.log('WebSocket连接关闭，尝试重连...')
    setTimeout(() => {
        if (localStorage.accessToken) {
          initWebSocket(localStorage.accessToken);
        }
      }, 3000);
  }

  // 连接错误
  ws.onerror = (error) => {
    console.error('WebSocket错误', error);
  };
}

export function closeWebSocket() {
  if (ws) {
    console.log("手动关闭 WebSocket 连接")
    ws.close() // 会触发 ws.onclose
    ws = null
  }

  isConnected = false
  messageMap.value = {}
  followedUsers.value = []
  selectedUserId.value = null
  pendingMessages.value = []
  messageCache.value = []
  submitCodeCallbacks.value = []
}

function handleOnlineStatus(msg) {
  var user = followedUsers.value.find(user => user.user_id === msg.from);
  user.online_state = msg.online_state

  console.log("Ws online msg", msg)
}

function handleSubmitCode(msg) {
  console.log("进入handleSubmitCode，消息：", msg)
  console.log("当前注册的回调数量：", submitCodeCallbacks.value.length)
  
  submitCodeCallbacks.value.forEach(callback => {
    console.log("准备执行回调...")
    callback(msg)
  })
}

function handleChat(msg) {
  
  if (followedUsers.value.length === 0) {
    // 关注列表还没准备好，先缓存消息
      messageCache.value.push(msg)
      return
  }
  console.log("test: ", msg)
  processMessage(msg)
}

function processAllMessages() {
  messageCache.value.forEach(msg => processMessage(msg))
  messageCache.value = []  // 清空缓存
}
function processMessage(msg) {
  const from = msg.from
  if (!messageMap.value[from]) messageMap.value[from] = []
  messageMap.value[from].push(msg)

  console.log("processMessage: ", msg)
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
    closeWebSocket,
    messageMap,
    followedUsers,
    selectedUserId,
    sendMessage,
    registerSubmitCodeCallback
  }
}

async function getFollowedUsers() {
  if (followedUsers.value.length != 0) return
  const resp = await api.getFollowUserList();
  if (resp.code === 0) {
    console.log("getFollowedUsers")
    console.log(resp.data.followUserList)
    followedUsers.value = resp.data.followUserList.map(u => ({ ...u, hasUnread: false }));

    processAllMessages()
  }
}