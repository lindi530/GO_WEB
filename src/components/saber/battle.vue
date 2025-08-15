<template>
  <div class="layout-container">
    <div class="top-area">
      <div class="top-content">
        <div class="page-title">{{ battleType }}</div>
      </div>
    </div>
    
    <div class="middle-area" ref="middleAreaRef">
      <!-- 左侧玩家区域 -->
      <div class="player-container">
        <div class="effect-wrapper" :class="{ 'hover-active': isLeftHovered && !isMatching }">
          <div class="player-box" 
               :style="playerBoxStyle"
               @mouseenter="handleLeftEnter" 
               @mouseleave="handleLeftLeave"
               @click="handleLeftClick">
            <div class="player-content">
              {{ isLeftHovered ? '选择左侧玩家' : '左侧玩家区域' }}
            </div>
          </div>
        </div>
      </div>
      
      <!-- 中间VS区域及匹配时间 -->
      <div class="vs-wrapper">
        <!-- 匹配状态和时间显示（仅在匹配中显示） -->
        <div class="match-status-bar" v-if="isMatching">
          <div class="loader-small">
            <div class="loader-dot"></div>
            <div class="loader-dot"></div>
            <div class="loader-dot"></div>
          </div>
          <span class="status-text">正在寻找对手...</span>
          <div class="match-time-display">
            <span class="time-label">匹配时间:</span>
            <span class="time-value">{{ formattedMatchTime }}</span>
          </div>
          <div class="players-count">
            <span class="players-label">已找到:</span>
            <span class="players-value">{{ foundPlayers }}/2</span>
          </div>
          <button class="cancel-btn-small" @click="cancelMatch">
            取消
          </button>
        </div>
        
        <!-- VS区域 -->
        <div class="vs-container">
          <div class="vs-background"></div>
          <div class="vs-text">VS</div>
        </div>
      </div>
      
      <!-- 右侧玩家区域 -->
      <div class="player-container">
        <div class="effect-wrapper" :class="{ 'hover-active': isRightHovered && !isMatching }">
          <div class="player-box" 
               :style="playerBoxStyle"
               @mouseenter="handleRightEnter" 
               @mouseleave="handleRightLeave"
               @click="handleRightClick">
            <div class="player-content">
              {{ isRightHovered ? '选择右侧玩家' : '右侧玩家区域' }}
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 底部按钮区域 -->
    <div class="bottom-area">
      <button class="action-btn" 
          :class="isMatching ? 'matching-btn' : battleType === '天人对战' ? 'friend-btn' : 'match-btn'" 
          @click="handleMatch">
        <i :class="isMatching ? 'icon-loading' : battleType === '好友对战' ? 'icon-friend' : 'icon-game'"></i>
        <span>
          {{ isMatching 
            ? '匹配中...' 
            : battleType === '好友对战' 
              ? '邀请好友' 
              : '开始匹配' 
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

const props = defineProps({
  battleType: {
    type: String,
    required: true
  },
})
// 定义事件发射器
const emit = defineEmits(['back-to-menu', 'match', 'select-left', 'select-right', 'cancel-match']);

// 匹配状态相关
const isMatching = ref(false);
const matchTimeSeconds = ref(0);
const foundPlayers = ref(0);
let matchTimer = null;
let playerFoundTimer = null;

// 格式化匹配时间为 MM:SS 格式
const formattedMatchTime = computed(() => {
  const minutes = Math.floor(matchTimeSeconds.value / 60);
  const seconds = matchTimeSeconds.value % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

// 按钮点击事件处理
const handleBackToMenu = () => {
  emit('back-to-menu');
  console.log('返回菜单按钮被点击');
};

const handleMatch = () => {
  if (isMatching.value) return;
  
  // 开始匹配流程
  isMatching.value = true;
  matchTimeSeconds.value = 0;
  foundPlayers.value = 1; // 自己算作已找到的玩家
  
  // 启动匹配计时器
  matchTimer = setInterval(() => {
    matchTimeSeconds.value++;
  }, 1000);
  
  // 模拟随机找到其他玩家
  simulateFindingPlayers();
  
  emit('match');
  console.log('匹配按钮被点击，开始匹配');
};

// 取消匹配
const cancelMatch = () => {
  stopMatchProcess();
  emit('cancel-match');
  console.log('取消匹配');
};

// 停止匹配流程
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

// 模拟寻找玩家过程
const simulateFindingPlayers = () => {
  // 随机在3-10秒内找到另一个玩家
  const randomDelay = Math.floor(Math.random() * 8000) + 3000;
  
  playerFoundTimer = setTimeout(() => {
    foundPlayers.value = 2;
    
    // 找到所有玩家后，2秒后结束匹配（模拟进入游戏）
    setTimeout(() => {
      stopMatchProcess();
      console.log('匹配成功，进入游戏');
    }, 2000);
  }, randomDelay);
};

// 玩家区域点击事件
const handleLeftClick = () => {
  if (isMatching.value) return;
  emit('select-left');
  console.log('左侧玩家区域被点击');
};

const handleRightClick = () => {
  if (isMatching.value) return;
  emit('select-right');
  console.log('右侧玩家区域被点击');
};

// 引用和状态
const middleAreaRef = ref(null);
const playerBoxStyle = ref({ width: '0px', height: '0px' });
const isLeftHovered = ref(false);
const isRightHovered = ref(false);

// 悬停处理函数
const handleLeftEnter = () => {
  if (!isMatching.value) {
    isLeftHovered.value = true;
    console.log('左侧玩家区域悬停进入');
  }
};

const handleLeftLeave = () => {
  isLeftHovered.value = false;
  console.log('左侧玩家区域悬停离开');
};

const handleRightEnter = () => {
  if (!isMatching.value) {
    isRightHovered.value = true;
    console.log('右侧玩家区域悬停进入');
  }
};

const handleRightLeave = () => {
  isRightHovered.value = false;
  console.log('右侧玩家区域悬停离开');
};

// 计算玩家框尺寸
const calculatePlayerBoxSize = () => {
  if (!middleAreaRef.value) return;
  const middleArea = middleAreaRef.value;
  const middleWidth = middleArea.clientWidth;
  const middleHeight = middleArea.clientHeight;
  const vsAreaTotalWidth = 100;
  
  const maxAvailableWidthPerPlayer = (middleWidth - vsAreaTotalWidth) / 2;
  const heightBasedOnWidth = maxAvailableWidthPerPlayer * 4 / 3;
  const maxAvailableHeight = middleHeight * 0.9;
  
  let finalWidth, finalHeight;
  if (heightBasedOnWidth <= maxAvailableHeight) {
    finalWidth = maxAvailableWidthPerPlayer;
    finalHeight = heightBasedOnWidth;
  } else {
    finalHeight = maxAvailableHeight;
    finalWidth = finalHeight * 3 / 4;
  }
  
  finalWidth = Math.min(270, finalWidth);
  finalHeight = Math.min(360, finalHeight);
  playerBoxStyle.value = { width: `${finalWidth}px`, height: `${finalHeight}px` };
};

// 初始化和监听
onMounted(() => {
  calculatePlayerBoxSize();
  const handleResize = () => calculatePlayerBoxSize();
  window.addEventListener('resize', handleResize);
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
    stopMatchProcess(); // 组件卸载时确保计时器被清除
  });
  watchEffect(() => middleAreaRef.value && calculatePlayerBoxSize());
});
</script>

<style scoped>
.layout-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  background: transparent; /* 保持透明，让父组件背景透过 */
  pointer-events: auto; /* 保证鼠标事件可用 */
}


/* 顶部区域样式 - 调整高度以适应更大的标题 */
.top-area {
  height: 80px; /* 增加顶部区域高度 */
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  background: transparent;
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
  font-size: 32px; /* 增大标题字体大小 */
  font-weight: 700; /* 加粗标题 */
  background: linear-gradient(90deg, #3a86ff, #8338ec);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: 1px; /* 增加字间距 */
  transition: font-size 0.3s ease; /* 平滑过渡效果 */
}

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

/* VS区域包装器 - 完全透明背景 */
.vs-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  background: transparent;
}

/* 匹配状态条样式 - 半透明背景以便阅读 */
.match-status-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 3px 8px;
  background-color: rgba(15, 52, 96, 0.5); /* 半透明背景确保文字可读 */
  border-radius: 6px;
  border: 1px solid rgba(58, 134, 255, 0.3);
  white-space: nowrap;
  animation: slideDown 0.3s ease-out;
  z-index: 5;
  margin-bottom: 5px;
}

@keyframes slideDown {
  from { transform: translateY(-15px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* 小型加载动画 */
.loader-small {
  display: flex;
  gap: 3px;
  align-items: center;
  height: 14px;
}

.loader-dot {
  width: 5px;
  height: 5px;
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

/* 匹配时间显示样式 */
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
  color: #3a86ff;
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

/* 小型取消按钮 */
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

/* 玩家区域样式 - 半透明以便区分 */
.effect-wrapper {
  padding: 4px;
  border-radius: 10px;
  transition: all 0.3s ease;
  position: relative;
  z-index: 3;
  background: transparent;
}

.player-box {
  background-color: rgba(15, 52, 96, 0.6); /* 半透明背景 */
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(58, 134, 255, 0.3);
  position: relative;
  z-index: 4;
  cursor: pointer;
}

.player-content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  padding: 10px;
  box-sizing: border-box;
  transition: all 0.3s ease;
  text-align: center;
  font-size: 16px;
  position: relative;
  z-index: 5;
}

/* VS区域样式保留以便识别 */
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

/* 玩家区域发光效果保留 */
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

.effect-wrapper.hover-active .player-content {
  transform: scale(1.03);
  color: #e0f2fe;
  font-weight: 500;
}

/* 底部按钮区域 - 完全透明 */
.bottom-area {
  height: 70px;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
  padding: 0 20px;
  position: relative;
  z-index: 10;
  background: transparent;
}

/* 通用按钮样式保留但增强透明度 */
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

/* 匹配按钮样式 - 半透明 */
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

/* 好友对战按钮样式 - 半透明 */
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

/* 按钮图标伪元素实现 */
.icon-game::before { content: "🎮"; }
.icon-friend::before { content: "👥"; }
.icon-loading::before { content: "🔄"; animation: spin 1.5s linear infinite; }
.icon-back::before { content: "↩"; }

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.match-btn:active {
  transform: translateY(-1px);
  box-shadow: 0 3px 10px rgba(58, 134, 255, 0.3);
}

/* 返回按钮样式 - 半透明 */
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

/* 确保没有元素阻止鼠标事件 */
* {
  pointer-events: auto !important;
}

/* 响应式调整 - 确保标题在小屏幕上不会过大 */
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
}

@media (max-width: 576px) {
  .top-area { 
    padding: 8px 10px;
    height: 60px; /* 小屏幕减小顶部区域高度 */
  }
  
  .page-title {
    font-size: 22px; /* 小屏幕减小标题大小 */
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
  .player-content { font-size: 14px; }
  
  .action-btn {
    padding: 8px 18px;
    font-size: 14px;
  }
  
  .action-btn i {
    font-size: 16px;
  }
}
</style>
