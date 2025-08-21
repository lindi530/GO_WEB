<template>
  <div class="layout-container">
    <!-- 匹配成功特效提示 -->
    <MatchSuccessOverlay 
      :show="showMatchSuccess" 
      :is-fading-out="isFadingOut"
    />
    
    <!-- 顶部标题区域 -->
    <TopBar :battle-type="battleType" />
    
    <!-- 中间玩家+VS区域 -->
    <div class="middle-area" ref="middleAreaRef">
      <!-- 左侧玩家区域 -->
      <PlayerCard 
        :player="leftPlayer" 
        :is-hovered="isLeftHovered" 
        :is-matching="isMatching"
        :box-style="playerBoxStyle"
        @mouse-enter="handleLeftEnter"
        @mouse-leave="handleLeftLeave"
      />
      
      <!-- 中间VS区域及匹配时间 -->
      <VSCard 
        :is-matching="isMatching"
        :match-time="formattedMatchTime"
        :found-players="foundPlayers"
      />
      
      <!-- 右侧玩家区域 -->
      <PlayerCard 
        :player="rightPlayer" 
        :is-hovered="isRightHovered" 
        :is-matching="isMatching"
        :box-style="playerBoxStyle"
        @mouse-enter="handleRightEnter"
        @mouse-leave="handleRightLeave"
      />
    </div>
    
    <!-- 底部按钮区域 -->
    <BottomControls 
      :is-matching="isMatching"
      :battle-type="battleType"
      @match-or-cancel="handleMatchOrCancel"
      @back-to-menu="handleBackToMenu"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watchEffect, computed } from 'vue';
import api from '@/api/index.js'
import { useStore } from 'vuex';
import { useWebSocketContext } from '@/composables/useWebSocket.js'

// 导入子组件
import MatchSuccessOverlay from './MatchSuccessOverlay.vue';
import TopBar from './TopBar.vue';
import PlayerCard from './PlayerCard.vue';
import VSCard from './VSCard.vue';
import BottomControls from './BottomControls.vue';

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
    // 处理错误
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
    unregister(); // 取消WebSocket回调注册
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
  position: relative;
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
</style>
