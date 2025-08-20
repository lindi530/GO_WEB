<template>
  <div class="layout-container">
    <!-- 匹配成功特效提示 - 改为在对战区域内显示 -->
    <div 
      class="match-success-overlay" 
      v-if="showMatchSuccess"
      :class="{ 'fade-out': isFadingOut }"
    >
      <div class="success-content">
        <div class="success-icon">✦</div>
        <div class="success-text">匹配成功！</div>
        <div class="success-subtext">即将进入对战...</div>
      </div>
    </div>
    
    <div class="top-area">
      <div class="top-content">
        <div class="page-title">{{ battleType }}</div>
      </div>
    </div>
    
    <div class="middle-area" ref="middleAreaRef">
      <!-- 左侧玩家区域 -->
      <div class="player-container" >
        <div class="effect-wrapper" :class="{ 'hover-active': isLeftHovered && !isMatching }">
          <div class="player-box" 
               :style="playerBoxStyle"
               @mouseenter="handleLeftEnter" 
               @mouseleave="handleLeftLeave">
            <!-- 左侧玩家信息 -->
            <div class="player-info-container">
              <!-- 玩家头像 -->
              <div class="avatar-wrapper">
                <img :src="leftPlayer.avatar" :alt="leftPlayer.name" class="player-avatar">
                <div class="player-level-badge">{{ leftPlayer.level }}</div>
              </div>
              
              <!-- 玩家基本信息 -->
              <div class="player-basic-info">
                <h3 class="player-name">{{ leftPlayer.name }}</h3>
                <div class="player-rating">
                  <i class="rating-icon">🏆</i>
                  <span class="rating-value">{{ leftPlayer.rating }}</span>
                </div>
              </div>
              
              <!-- 玩家统计数据 -->
              <div class="player-stats">
                <div class="stat-item">
                  <span class="stat-label">场数</span>
                  <span class="stat-value">{{ leftPlayer.total_matches }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">胜率</span>
                  <span class="stat-value">{{ leftPlayer.wins }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 中间VS区域及匹配时间 -->
      <div class="vs-wrapper">
        <div class="match-status-bar" v-if="isMatching">
          <div class="status-content">
            <div class="status-row">
              <div class="loader-small">
                <div class="loader-dot"></div>
                <div class="loader-dot"></div>
                <div class="loader-dot"></div>
              </div>
              <span class="status-text">匹配中</span>
            </div>


            <div class="status-row">
              <div class="match-time-display">
                <span class="time-value">{{ formattedMatchTime }}</span>
              </div>
            </div>

            <div class="status-row">
              <div class="players-count">
                <span class="players-label">已找到:</span>
                <span class="players-value">{{ foundPlayers }}/2</span>
              </div>
            </div>

          </div>
        </div>
        
        <div class="vs-container">
          <div class="vs-background"></div>
          <div class="vs-text">VS</div>
        </div>
      </div>
      
      <!-- 右侧玩家区域 -->
      <div class="player-container" >
        <div class="effect-wrapper" :class="{ 'hover-active': isRightHovered && !isMatching }">
          <div class="player-box" 
               :style="playerBoxStyle"
               @mouseenter="handleRightEnter" 
               @mouseleave="handleRightLeave">
            <!-- 右侧玩家信息 -->
            <div class="player-info-container">
              <!-- 玩家头像 -->
              <div class="avatar-wrapper">
                <img :src="rightPlayer.avatar" :alt="rightPlayer.name" class="player-avatar">
                <div class="player-level-badge">{{ rightPlayer.level }}</div>
              </div>
              
              <!-- 玩家基本信息 -->
              <div class="player-basic-info">
                <h3 class="player-name">{{ rightPlayer.name }}</h3>
                <div class="player-rating">
                  <i class="rating-icon">🏆</i>
                  <span class="rating-value">{{ rightPlayer.rating }}</span>
                </div>
              </div>
              
              <!-- 玩家统计数据 -->
              <div class="player-stats">
                <div class="stat-item">
                  <span class="stat-label">场数</span>
                  <span class="stat-value">{{ rightPlayer.total_matches }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">胜率</span>
                  <span class="stat-value">{{ rightPlayer.wins }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 底部按钮区域 -->
    <div class="bottom-area">
      <button 
        class="action-btn" 
        :class="isMatching ? 'matching-btn cancel-match-btn' : (battleType === '天人对战' ? 'friend-btn' : 'match-btn')" 
        @click="handleMatchOrCancel"
      >

        <i :class="isMatching ? 'icon-loading' : (battleType === '好友对战' ? 'icon-friend' : 'icon-game')"></i>
        <span>
          {{ isMatching 
            ? '取消匹配'  // 匹配中显示“取消匹配”
            : (battleType === '好友对战' ? '邀请好友' : '开始匹配') 
          }}
        </span>
      </button>
      <button class="action-btn back-btn" @click="handleBackToMenu">
        <i class="icon-back"></i>
        <span>返回菜单</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watchEffect, computed } from 'vue';
import api from '@/api/index.js'
import imgDefault from "@/assets/1.png";
import { useStore } from 'vuex';
import { useWebSocketContext } from '@/composables/useWebSocket.js'

// 接收外部传入的对战类型
const props = defineProps({
  battleType: {
    type: String,
    required: true
  },
});

// 定义对外暴露的事件
const emit = defineEmits(['back-to-menu', 'update_match_success', 'to-battle-game']);

// 匹配状态管理
const isMatching = ref(false);
const matchTimeSeconds = ref(0);
const foundPlayers = ref(0);
let matchTimer = null;
let playerFoundTimer = null;

// 匹配成功特效相关变量
const showMatchSuccess = ref(false);
const isFadingOut = ref(false);


const store = useStore();
// 左右玩家数据
const leftPlayer = ref({
  "avatar": computed(() => store.getters['user/userAvatar']),
  "name": computed(() => store.getters['user/userName']),
  "level": "",
  "rating": 0,
  "total_matches": 0,
  "wins": 0,
});

onMounted(async() => { 
  const resp = await api.getUserSaberStats(props.postId)
  if (resp.code === 0) {
    let data = resp.data
    
    leftPlayer.value.rating = data.rating
    leftPlayer.value.level = data.level
    leftPlayer.value.total_matches = data.total_matches
    leftPlayer.value.wins = data.wins
  } else {

  }
})

const rightPlayer = ref({
  "avatar": "",
  "name": "",
  "level": "",
  "rating": 0,
  "total_matches": 0,
  "wins": 0,
});

const { registerMatchCallback } = useWebSocketContext()


const unregister = registerMatchCallback((msg) => {
  console.log("Code Editor: ", msg)
  handleMatchSuccess(msg)
})

const handleMatchSuccess = (msg) => {
  rightPlayer.value.avatar = msg.opponent.avatar
  rightPlayer.value.name = msg.opponent.user_name
  rightPlayer.value.level = msg.opponent.level
  rightPlayer.value.rating = msg.opponent.rating
  rightPlayer.value.total_matches = msg.opponent.total_matches
  rightPlayer.value.wins = msg.opponent.wins

  foundPlayers.value = 2

  // 触发匹配成功特效
  triggerMatchSuccessEffect();
  // 延迟发送匹配成功事件，等待特效展示完成
  setTimeout(() => {
    emit('to-battle-game', msg.room_id, msg.problem_id)
  }, 5000);
}

// 触发匹配成功特效
const triggerMatchSuccessEffect = () => {
  showMatchSuccess.value = true;
  isFadingOut.value = false;
  stopMatchProcess();
  
  // 2.5秒后开始淡出效果
  setTimeout(() => {
    isFadingOut.value = true;
  }, 4000);
  
  // 3秒后隐藏整个提示
  setTimeout(() => {
    showMatchSuccess.value = false;
  }, 5000);
}


// 格式化匹配时间为 MM:SS
const formattedMatchTime = computed(() => {
  const minutes = Math.floor(matchTimeSeconds.value / 60);
  const seconds = matchTimeSeconds.value % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

// 返回菜单事件
const handleBackToMenu = () => {
  stopMatchProcess();
  emit('back-to-menu');
  console.log('返回菜单按钮被点击');
};

// 开始匹配事件
const handleMatchOrCancel = async() => {
  if (isMatching.value) { 
    stopMatchProcess();
    console.log('取消匹配');
    return
  }
  
  isMatching.value = true;
  matchTimeSeconds.value = 0;
  foundPlayers.value = 1;
  
  // 启动匹配计时器
  matchTimer = setInterval(() => {
    matchTimeSeconds.value++;
  }, 1000);

  let resp = await api.match()
  if (resp.code === 0) { 
    console.log("发送匹配请求成功！")
  } else {
    console.log("发送匹配请求失败：", resp.message)
  }
  
  console.log('开始匹配');
};

// 停止匹配流程（清除计时器）
const stopMatchProcess = () => {
  isMatching.value = false;
  if (matchTimer) {
    clearInterval(matchTimer);
    matchTimer = null;
  }
  if (playerFoundTimer) {
    clearTimeout(playerFoundTimer);
    playerFoundTimer = null;
  }
};

// 玩家区域悬停状态管理
const middleAreaRef = ref(null);
const playerBoxStyle = ref({ width: '0px', height: '0px' });
const isLeftHovered = ref(false);
const isRightHovered = ref(false);

// 左侧玩家悬停进入
const handleLeftEnter = () => {
  if (!isMatching.value) {
    isLeftHovered.value = true;
    console.log('左侧玩家区域悬停进入');
  }
};

// 左侧玩家悬停离开
const handleLeftLeave = () => {
  isLeftHovered.value = false;
  console.log('左侧玩家区域悬停离开');
};

// 右侧玩家悬停进入
const handleRightEnter = () => {
  if (!isMatching.value) {
    isRightHovered.value = true;
    console.log('右侧玩家区域悬停进入');
  }
};

// 右侧玩家悬停离开
const handleRightLeave = () => {
  isRightHovered.value = false;
  console.log('右侧玩家区域悬停离开');
};

// 计算玩家框尺寸（自适应中间区域大小）
const calculatePlayerBoxSize = () => {
  if (!middleAreaRef.value) return;
  const middleArea = middleAreaRef.value;
  const middleWidth = middleArea.clientWidth;
  const middleHeight = middleArea.clientHeight;
  const vsAreaTotalWidth = 100; // VS区域宽度
  
  // 计算单个玩家区域最大可用宽度
  const maxAvailableWidthPerPlayer = (middleWidth - vsAreaTotalWidth) / 2;
  // 按 3:4 宽高比计算高度
  const heightBasedOnWidth = maxAvailableWidthPerPlayer * 4 / 3;
  // 中间区域最大可用高度（90%）
  const maxAvailableHeight = middleHeight * 0.9;
  
  let finalWidth, finalHeight;
  // 优先按宽度计算，若高度超出则按高度反算宽度
  if (heightBasedOnWidth <= maxAvailableHeight) {
    finalWidth = maxAvailableWidthPerPlayer;
    finalHeight = heightBasedOnWidth;
  } else {
    finalHeight = maxAvailableHeight;
    finalWidth = finalHeight * 3 / 4;
  }
  
  // 限制最大尺寸（避免过大）
  finalWidth = Math.min(270, finalWidth);
  finalHeight = Math.min(360, finalHeight);
  playerBoxStyle.value = { width: `${finalWidth}px`, height: `${finalHeight}px` };
};

// 组件挂载时初始化尺寸，并监听窗口 resize
onMounted(() => {
  calculatePlayerBoxSize();
  const handleResize = () => calculatePlayerBoxSize();
  window.addEventListener('resize', handleResize);
  
  // 组件卸载时清理
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
    stopMatchProcess(); // 确保计时器被清除
  });
  
  // 监听中间区域变化，重新计算尺寸
  watchEffect(() => middleAreaRef.value && calculatePlayerBoxSize());
});
</script>

<style scoped>
/* 全局容器样式 */
.layout-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  background: transparent;
  pointer-events: auto;
  position: relative; /* 新增：作为特效的定位父元素 */
}

/* 匹配成功特效样式 - 修改为框内显示 */
.match-success-overlay {
  position: absolute; /* 改为绝对定位，相对于布局容器 */
  top: 80px; /* 顶部标题栏高度 */
  bottom: 70px; /* 底部按钮栏高度 */
  left: 0;
  right: 0;
  /* background-color: rgba(214, 217, 219, 0); */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  opacity: 1;
  transition: opacity 0.5s ease-out;
  animation: pulseBackground 4s infinite alternate;
  border-radius: 8px; /* 添加边框圆角 */
  margin: 10px; /* 与容器保持距离 */
  /* box-shadow: 0 0 20px rgba(58, 134, 255, 0.3); 添加内阴影增强边框感 */
}

.match-success-overlay.fade-out {
  opacity: 0;
}

.success-content {
  text-align: center;
  transform: scale(0.8);
  animation: popIn 0.5s forwards, float 4s ease-in-out;
}

.success-icon {
  font-size: 60px;
  color: #4ade80;
  margin-bottom: 20px;
  text-shadow: 0 0 15px rgba(74, 222, 128, 0.8);
  animation: spin 5s linear infinite;
}

.success-text {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 10px;
  text-shadow: 0 0 10px rgba(58, 134, 255, 0.8);
  
  /* 渐变背景设置 */
  background: linear-gradient(90deg, 
    rgba(58, 134, 255, 0) 0%,  /* 开始透明 */
    #3a86ff 25%,              /* 蓝色 */
    #8338ec 50%,              /* 紫色 */
    #4ade80 75%,              /* 绿色 */
    rgba(74, 222, 128, 0) 100% /* 结束透明 */
  );
  background-size: 200% auto; /* 扩展背景尺寸以实现流畅动画 */
  
  /* 文字裁剪 */
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  
  /* 应用动画 */
  animation: textGradientFlow 5s linear infinite;
}

.success-subtext {
  font-size: 20px;
  color: #e0e7ff;
  text-shadow: 0 0 5px rgba(58, 134, 255, 0.5);
}

/* 匹配成功特效动画 */
@keyframes popIn {
  from { transform: scale(0.5); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes spin {
  from { transform: rotate(360deg); }
  to { transform: rotate(0deg); }
}

@keyframes pulseBackground {
  
  from { background-color: rgba(223,244,255, 0.5); }
  to { background-color: rgba(223,244,255, 0.8); }
}

@keyframes textShine {
  0% { 
    background-position: -100% center; /* 起始位置在左侧完全不可见 */
  }
  100% { 
    background-position: 100% center; /* 结束位置在右侧完全不可可见 */
  }
}

@keyframes textGradientFlow {
  0% {
    background-position: 0% 50%; /* 起始位置在最左侧 */
  }
  100% {
    background-position: 100% 50%; /* 结束位置在最右侧 */
  }
}

/* 顶部标题区域 */
.top-area {
  height: 80px;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  background: transparent;
  z-index: 10; /* 确保在特效下方 */
}

.action-btn.cancel-match-btn {
  background-color: #ff4d4f; /* 红色系，代表取消/危险操作 */
  border-color: #ff4d4f;
}
.action-btn.cancel-match-btn:hover {
  background-color: #ff7875;
}

.top-content {
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  background: linear-gradient(90deg, #3a86ff, #8338ec);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: 1px;
  transition: font-size 0.3s ease;
}

/* 中间玩家+VS区域 */
.middle-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  box-sizing: border-box;
  position: relative;
  z-index: 1;
}

.player-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 10px;
  position: relative;
  z-index: 2;
  background: transparent;
}

/* VS区域样式 */
.vs-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  background: transparent;
}

/* 匹配状态条（匹配中显示） */
.match-status-bar {
  display: flex;
  flex-direction: column;
  gap: 8px; /* 行与行之间的间距 */

  align-items: center;

  padding: 3px 8px;
  background-color: rgba(15, 52, 96, 0.5);
  border-radius: 6px;
  border: 1px solid rgba(58, 134, 255, 0.3);
  white-space: nowrap;
  animation: slideDown 0.3s ease-out;
  z-index: 5;
  margin-bottom: 5px;
}

.status-content {
  /* 使内容垂直排列 */
  display: flex;
  flex-direction: column;
  gap: 8px; /* 行与行之间的间距 */
  align-items: center; /* 水平居中对齐 */
}

.status-row {
  display: flex;
  align-items: center;
  gap: 8px; /* 元素之间的间距 */
}

.loader-small {
  display: flex;
  gap: 4px;
}

@keyframes slideDown {
  from { transform: translateY(-15px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* 加载动画（三个点） */
.loader-small {
  display: flex;
  gap: 3px;
  align-items: center;
  height: 14px;
}

.loader-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #3a86ff;
  animation: bounceSmall 1.5s infinite ease-in-out;
}

.loader-dot:nth-child(2) {
  animation-delay: 0.2s;
  background-color: #8338ec;
}

.loader-dot:nth-child(3) {
  animation-delay: 0.4s;
  background-color: #4ade80;
}

@keyframes bounceSmall {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

.status-text {
  color: #e0e7ff;
  font-size: 12px;
  white-space: nowrap;
}

/* 匹配时间显示 */
.match-time-display {
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 1px 4px;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.time-label {
  color: #94a3b8;
  font-size: 11px;
}

.time-value {
  color: #409eff;
  font-size: 24px; 
  font-weight: 600;
  font-family: 'Courier New', monospace;
  min-width: 40px;
  text-align: center;
  text-shadow: 0 0 5px rgba(58, 134, 255, 0.3);
  animation: pulse 2s infinite alternate;
}

@keyframes pulse {
  from { opacity: 0.9; }
  to { opacity: 1; }
}

/* 玩家计数显示 */
.players-count {
  display: flex;
  align-items: center;
  gap: 3px;
}

.players-label {
  color: #94a3b8;
  font-size: 11px;
}

.players-value {
  color: #4ade80;
  font-weight: 600;
  font-size: 12px;
}

/* 取消匹配小按钮 */
.cancel-btn-small {
  background-color: rgba(233, 69, 96, 0.2);
  color: #e94560;
  border: 1px solid rgba(233, 69, 96, 0.4);
  border-radius: 3px;
  padding: 1px 8px;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn-small:hover {
  background-color: rgba(233, 69, 96, 0.3);
  color: #ff3a3a;
  border-color: rgba(233, 69, 96, 0.6);
}

/* 玩家区域样式 */
.effect-wrapper {
  padding: 4px;
  border-radius: 10px;
  transition: all 0.3s ease;
  position: relative;
  z-index: 3;
  background: transparent;
}

.player-box {
  background-color: rgba(15, 52, 96, 0.6);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(58, 134, 255, 0.3);
  position: relative;
  z-index: 4;
  cursor: default; /* 非点击状态，鼠标默认样式 */
}

/* 玩家信息容器（自适应内部布局） */
.player-info-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 8%;
  box-sizing: border-box;
  color: white;
  position: relative;
}

/* 头像区域 */
.avatar-wrapper {
  position: relative;
  width: 45%;
  aspect-ratio: 1/1; /* 保持正方形 */
  margin-bottom: 5%;
}

.player-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid rgba(58, 134, 255, 0.5);
  box-shadow: 0 0 10px rgba(58, 134, 255, 0.3);
  transition: all 0.3s ease;
}

/* 悬停时头像放大+增强阴影 */
.effect-wrapper.hover-active .player-avatar {
  transform: scale(1.05);
  box-shadow: 0 0 15px rgba(58, 134, 255, 0.5);
}

/* 等级徽章（头像右下角） */
.player-level-badge {
  position: absolute;
  bottom: -5%;
  right: -5%;
  background: linear-gradient(135deg, #3a86ff, #8338ec);
  color: white;
  font-size: clamp(0.7rem, 4vw, 0.9rem);
  font-weight: bold;
  padding: 2% 6%;
  border-radius: 50px;
  border: 2px solid rgba(15, 52, 96, 0.8);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  white-space: nowrap;
}

/* 玩家基本信息（名称+评分） */
.player-basic-info {
  text-align: center;
  width: 100%;
  margin-bottom: 5%;
}

.player-name {
  font-size: clamp(1rem, 6vw, 1.3rem);
  font-weight: 600;
  margin: 0 0 3% 0;
  color: #e0f2fe;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.player-rating {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: #fde68a;
  font-size: clamp(0.8rem, 4vw, 1rem);
}

.rating-icon {
  font-size: 1.1em;
}

.rating-value {
  font-weight: 500;
}

/* 玩家统计数据（场数+胜率） */
.player-stats {
  display: flex;
  justify-content: space-around;
  width: 100%;
  padding-top: 5%;
  border-top: 1px solid rgba(58, 134, 255, 0.2);
}

.stat-item {
  text-align: center;
  flex: 1;
}

.stat-label {
  display: block;
  font-size: clamp(0.7rem, 3vw, 0.8rem);
  color: #94a3b8;
  margin-bottom: 2px;
}

.stat-value {
  font-size: clamp(0.8rem, 4vw, 1rem);
  font-weight: 600;
  color: #e0e7ff;
}

/* VS文字区域 */
.vs-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 80px;
  height: 80px;
  z-index: 4;
  background: transparent;
}

.vs-background {
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, #ff3a3a 0%, #e94560 50%, rgba(233, 69, 96, 0.2) 100%);
  border-radius: 50%;
  box-shadow: 0 0 15px rgba(255, 58, 58, 0.6), 
              inset 0 0 10px rgba(255, 255, 255, 0.3);
  animation: vsPulse 2s infinite alternate;
  z-index: 1;
}

.vs-text {
  position: relative;
  color: white;
  font-size: 28px;
  font-weight: 800;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.8),
               0 0 12px rgba(255, 58, 58, 0.6);
  z-index: 2;
  letter-spacing: -1px;
  animation: vsFloat 3s infinite ease-in-out;
}

@keyframes vsPulse {
  0% { transform: scale(0.9); box-shadow: 0 0 15px rgba(255, 58, 58, 0.6); }
  100% { transform: scale(1.05); box-shadow: 0 0 25px rgba(255, 58, 58, 0.8); }
}

@keyframes vsFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

/* 玩家区域悬停效果 */
.effect-wrapper::before {
  content: "";
  position: absolute;
  inset: 2px;
  border-radius: 8px;
  background: linear-gradient(45deg, rgba(58, 134, 255, 0.2), rgba(131, 56, 236, 0.15));
  opacity: 0.3;
  filter: blur(3px);
  z-index: 2;
  transition: all 0.3s ease;
}

.effect-wrapper.hover-active {
  transform: translateY(-2px) scale(1.01);
}

.effect-wrapper.hover-active::before {
  background: linear-gradient(45deg, #3a86ff, #8338ec);
  opacity: 0.6;
  filter: blur(6px);
  box-shadow: 0 0 10px rgba(58, 134, 255, 0.5);
}

.effect-wrapper.hover-active .player-box {
  border-color: rgba(58, 134, 255, 0.8);
  background-color: rgba(18, 69, 128, 0.7);
}

/* 底部按钮区域 */
.bottom-area {
  height: 70px;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
  padding: 0 20px;
  position: relative;
  z-index: 10; /* 确保在特效下方 */
  background: transparent;
}

/* 通用按钮样式 */
.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 28px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  position: relative;
  z-index: 11;
  overflow: hidden;
}

/* 开始匹配按钮 */
.match-btn {
  background-color: rgba(58, 134, 255, 0.8);
  color: white;
  box-shadow: 0 4px 15px rgba(58, 134, 255, 0.2);
}

.match-btn:hover {
  background-color: rgba(37, 99, 235, 0.9);
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(58, 134, 255, 0.4);
}

/* 邀请好友按钮 */
.friend-btn {
  background-color: rgba(74, 222, 128, 0.8);
  color: #064e3b;
  box-shadow: 0 4px 15px rgba(74, 222, 128, 0.2);
}

.friend-btn:hover {
  background-color: rgba(34, 197, 94, 0.9);
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(74, 222, 128, 0.4);
}

/* 匹配中按钮（不可点击） */
.matching-btn {
  background-color: rgba(148, 163, 184, 0.8);
  color: #1e293b;
  box-shadow: 0 4px 15px rgba(148, 163, 184, 0.2);
  cursor: default;
}

.matching-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(148, 163, 184, 0.3);
}

/* 按钮图标 */
.icon-game::before { content: "🎮"; }
.icon-friend::before { content: "👥"; }
.icon-loading::before { content: "🔄"; animation: spin 1.5s linear infinite; }
.icon-back::before { content: "↩"; }

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 按钮点击反馈 */
.match-btn:active {
  transform: translateY(-1px);
  box-shadow: 0 3px 10px rgba(58, 134, 255, 0.3);
}

/* 返回菜单按钮 */
.back-btn {
  background-color: rgba(30, 58, 138, 0.8);
  color: #e0e7ff;
  box-shadow: 0 4px 15px rgba(30, 58, 138, 0.2);
}

.back-btn:hover {
  background-color: rgba(30, 64, 175, 0.9);
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(30, 58, 138, 0.4);
  color: white;
}

.back-btn:active {
  transform: translateY(-1px);
  box-shadow: 0 3px 10px rgba(30, 58, 138, 0.3);
}

/* 响应式适配 - 小屏幕 */
@media (max-width: 768px) {
  .page-title {
    font-size: 26px;
  }
  
  .match-status-bar {
    gap: 6px;
    padding: 2px 6px;
  }
  
  .status-text, .players-value {
    font-size: 11px;
  }
  
  .time-label, .players-label {
    font-size: 10px;
  }
  
  .cancel-btn-small {
    padding: 1px 6px;
    font-size: 10px;
  }
  
  .player-stats {
    flex-direction: column;
    gap: 8px;
  }
  
  .stat-item {
    display: flex;
    justify-content: space-between;
  }
  
  /* 匹配成功响应式调整 */
  .success-text {
    font-size: 36px;
  }
  
  .success-icon {
    font-size: 48px;
  }
  
  .success-subtext {
    font-size: 16px;
  }
}

@media (max-width: 576px) {
  .top-area { 
    padding: 8px 10px;
    height: 60px;
  }
  
  .page-title {
    font-size: 22px;
  }
  
  .match-status-bar {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .bottom-area { 
    height: 60px; 
    gap: 12px; 
    padding: 0 10px;
  }
  
  .vs-container {
    width: 60px;
    height: 60px;
  }
  
  .vs-text {
    font-size: 22px;
  }
  
  .player-container { padding: 0 5px; }
  
  .action-btn {
    padding: 8px 18px;
    font-size: 14px;
  }
  
  .avatar-wrapper {
    width: 50%;
  }
  
  /* 匹配成功响应式调整 */
  .success-text {
    font-size: 28px;
  }
  
  .success-icon {
    font-size: 40px;
  }
}
</style>
