<template>
  <div class="layout-container">
    <div class="top-area">顶部区域</div>
    <div class="middle-area" ref="middleAreaRef">
      <!-- 左侧玩家区域 -->
      <div class="player-container">
        <div class="player-box" :style="playerBoxStyle">
          <div class="player-content">左侧玩家区域</div>
        </div>
      </div>
      
      <!-- VS区域 -->
      <div class="vs-area">VS</div>
      
      <!-- 右侧玩家区域 -->
      <div class="player-container">
        <div class="player-box" :style="playerBoxStyle">
          <div class="player-content">右侧玩家区域</div>
        </div>
      </div>
    </div>
    <div class="bottom-area">底部按钮区域</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watchEffect } from 'vue';

const emit = defineEmits(['back-to-menu']);
const handleBackToMenu = () => emit('back-to-menu');

// 引用和状态
const middleAreaRef = ref(null);
const playerBoxStyle = ref({
  width: '0px',
  height: '0px'
});

// 计算玩家框尺寸的核心函数
const calculatePlayerBoxSize = () => {
  if (!middleAreaRef.value) return;
  
  // 获取中间区域的可用空间
  const middleArea = middleAreaRef.value;
  const middleWidth = middleArea.clientWidth;
  const middleHeight = middleArea.clientHeight;
  
  // VS区域的宽度（固定60px + 两边间距10px）
  const vsAreaTotalWidth = 80;
  
  // 计算玩家框最大可用宽度（减去VS区域和间距）
  const maxAvailableWidthPerPlayer = (middleWidth - vsAreaTotalWidth) / 2;
  
  // 基于4:3比例（高度:宽度）计算对应高度
  const heightBasedOnWidth = maxAvailableWidthPerPlayer * 4 / 3;
  
  // 最大可用高度（中间区域高度的90%，留10%作为安全边际）
  const maxAvailableHeight = middleHeight * 0.9;
  
  // 确定最终尺寸（取宽度和高度限制中的较小值）
  let finalWidth, finalHeight;
  
  if (heightBasedOnWidth <= maxAvailableHeight) {
    // 宽度限制起作用
    finalWidth = maxAvailableWidthPerPlayer;
    finalHeight = heightBasedOnWidth;
  } else {
    // 高度限制起作用
    finalHeight = maxAvailableHeight;
    finalWidth = finalHeight * 3 / 4; // 保持4:3比例
  }
  
  // 设置最大尺寸，防止过大
  finalWidth = Math.min(270, finalWidth);
  finalHeight = Math.min(360, finalHeight);
  
  // 更新样式
  playerBoxStyle.value = {
    width: `${finalWidth}px`,
    height: `${finalHeight}px`
  };
};

// 初始化和监听
onMounted(() => {
  calculatePlayerBoxSize();
  
  const handleResize = () => {
    calculatePlayerBoxSize();
  };
  
  window.addEventListener('resize', handleResize);
  
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
  });
  
  watchEffect(() => {
    if (middleAreaRef.value) {
      calculatePlayerBoxSize();
    }
  });
});
</script>

<style scoped>
.layout-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #1a1a2e;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.top-area, .bottom-area {
  height: 50px;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  background-color: #16213e;
}

.middle-area {
  flex: 1;
  display: flex;
  align-items: center; /* 垂直居中所有内容 */
  justify-content: space-between; /* 左右玩家框均匀分布 */
  padding: 10px;
  box-sizing: border-box;
}

/* 玩家容器：确保占据足够空间并居中内容 */
.player-container {
  flex: 1; /* 平均分配可用空间 */
  display: flex;
  justify-content: center; /* 水平居中玩家框 */
  align-items: center; /* 垂直居中玩家框 */
  padding: 0 10px; /* 预留间距 */
}

.player-box {
  background-color: #0f3460;
  border-radius: 8px;
  overflow: hidden;
  transition: width 0.3s ease, height 0.3s ease;
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
}

.vs-area {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  background-color: #e94560;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  border-radius: 50%;
  margin: 0 10px; /* 增加间距，避免拥挤 */
}

/* 小屏幕适配 */
@media (max-width: 576px) {
  .top-area, .bottom-area {
    height: 40px;
  }
  .vs-area {
    width: 50px;
    height: 50px;
    font-size: 16px;
    margin: 0 5px;
  }
  .player-container {
    padding: 0 5px;
  }
}
</style>
