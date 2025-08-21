<template>
  <div v-if="showDialog" class="saber-app-root">
    <teleport to="body">
      <!-- 背景遮罩 -->
      <div 
        :class="['modal-backdrop fade', showDialog ? 'show' : '']"
      ></div>
      
      <!-- 弹窗内容 -->
      <div 
        ref="dialogRef"
        :style="{
          width: dialogSize.width + 'px',
          height: dialogSize.height + 'px',
          left: dialogLeft + 'px',
          top: dialogTop + 'px',
          zIndex: 1060,
          transform: 'none !important'
        }"
        class="modal-dialog position-absolute bg-white rounded shadow-lg"
      >
        <!-- 弹窗头部 -->
        <div 
          class="modal-header custom-header cursor-move d-flex justify-content-between align-items-center"
          :style="{
            padding: headerPadding + 'px',
            minHeight: 'auto'
          }"
          @mousedown="startDrag"
        >
          <h5 class="modal-title text-dark mb-0" :style="{
            fontSize: titleFontSize + 'px',
            lineHeight: '1',
            padding: '0',
            marginLeft: titleMarginLeft + 'px'
          }">
            {{ currentView === 'menu' ? 'Saber' : '好友对战 - 游戏中' }}
          </h5>
          <button 
            type="button" 
            class="btn-close btn-close-dark " 
            :style="{
              width: closeBtnSize + 'px',
              height: closeBtnSize + 'px'
            }"
            @click="closeDialog"
          ></button>
        </div>
        
        <!-- 内容区：根据当前视图切换显示 -->
        <div class="modal-body content-with-bg" 
             :style="{
               padding: bodyPadding + 'px',
               position: 'relative',
               zIndex: '100',
               height: 'calc(100% - ' + headerPadding * 2 + 'px)'
             }">
          
          <!-- 1. 菜单视图 -->
          <div v-if="currentView === 'menu'" class="d-flex align-items-center justify-content-center" :style="{ gap: buttonGap + 'px', height: '100%' }">
            <button 
              type="button" 
              class="content-text btn"
              :style="buttonStyle"
              @click.stop="handleHeavenBattle"
            >
              天人之战
            </button>
            <button 
              type="button" 
              class="content-text btn"
              :style="buttonStyle"
              @click.stop="enterFriendBattle"
            >
              好友对战
            </button>
          </div>
          
          <!-- 2. 游戏视图 -->
          <div v-if="currentView === 'game'" :style="{ width: '100%', height: '100%', position: 'relative' }">
            <!-- 游戏画布 -->
            <canvas 
              ref="gameCanvas" 
              :width="gameSize.width" 
              :height="gameSize.height"
              :style="{ 
                width: '100%', 
                height: '100%', 
                background: '#1a1a2e' 
              }"
            ></canvas>
            
            <!-- 游戏信息（分数、状态） -->
            <div class="game-info" :style="{
              position: 'absolute',
              top: '10px',
              left: '10px',
              color: 'white',
              fontSize: buttonFontSize + 'px',
              zIndex: 102
            }">
              分数: {{ gameScore }} | 回合: {{ gameRound }}
            </div>
            
            <!-- 返回菜单按钮 -->
            <button 
              type="button" 
              class="content-text btn"
              :style="{
                ...buttonStyle,
                position: 'absolute',
                bottom: '10px',
                right: '10px',
                zIndex: 102
              }"
              @click.stop="backToMenu"
            >
              返回菜单
            </button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch, computed } from 'vue';

// 接收visible props
const props = defineProps({
  visible: { type: Boolean, required: true, default: false }
})

// 状态管理
const showDialog = ref(true);
const emit = defineEmits(['update:visible']);
const currentView = ref('menu'); // 视图状态：menu/game

// 弹窗位置与尺寸
const dialogPositionRatio = ref({ x: 0.5, y: 0.5 });
const dialogLeft = ref(0);
const dialogTop = ref(0);
const dialogRef = ref(null);
const baseRatio = 16 / 9;
const baseWidth = 1024;
const baseHeight = 576;
const minWidth = 320;
const minHeight = 180;
const dialogSize = ref({ width: baseWidth, height: baseHeight });

// 元素尺寸配置
const elementSizes = ref({
  headerPadding: 6,
  titleFontSize: 16,
  titleMarginLeft: 16,
  closeBtnSize: 24,
  bodyPadding: 16,
  buttonWidth: 180,
  buttonHeight: 60,
  buttonPadding: 12,
  buttonFontSize: 20,
  buttonGap: 24
});

// 计算属性：按钮样式（复用）
const buttonStyle = computed(() => ({
  minWidth: buttonWidth.value + 'px',
  minHeight: buttonHeight.value + 'px',
  padding: buttonPadding.value + 'px',
  fontSize: buttonFontSize.value + 'px',
  position: 'relative',
  zIndex: '101'
}));

// 缩放后的元素尺寸
const [
  headerPadding, titleFontSize, titleMarginLeft,
  closeBtnSize, bodyPadding, buttonWidth,
  buttonHeight, buttonPadding, buttonFontSize,
  buttonGap
] = [
  'headerPadding', 'titleFontSize', 'titleMarginLeft',
  'closeBtnSize', 'bodyPadding', 'buttonWidth',
  'buttonHeight', 'buttonPadding', 'buttonFontSize',
  'buttonGap'
].map(key => ref(elementSizes.value[key]));

// 游戏相关状态
const gameCanvas = ref(null);
const gameSize = ref({ width: 0, height: 0 }); // 画布尺寸
const gameScore = ref(0);
const gameRound = ref(1);
const gameLoop = ref(null); // 游戏循环计时器
const gameState = ref({
  // 示例：游戏对象（可根据实际游戏扩展）
  player1: { x: 50, y: 200, width: 40, height: 60, color: '#e63946' },
  player2: { x: 800, y: 200, width: 40, height: 60, color: '#457b9d' },
  ball: { x: 400, y: 200, radius: 10, dx: 5, dy: 3, color: '#f1faee' }
});

const backToMenu = () => {
  currentView.value = 'menu';
  if (gameLoop.value) {
    clearInterval(gameLoop.value); // 停止游戏循环
    gameLoop.value = null;
  }
};
// 同步显示状态
watch(() => props.visible, (val) => {
  if (val) {
    showDialog.value = true;
    nextTick(centerDialog);
  } else {
    showDialog.value = false;
    backToMenu(); // 隐藏时重置到菜单
  }
}, { immediate: true });

// 计算尺寸
const calculateSizes = () => {
  const viewportWidth = window.innerWidth * 0.9;
  const viewportHeight = window.innerHeight * 0.9;
  let calcWidth, calcHeight;
  
  if (viewportWidth / baseRatio <= viewportHeight) {
    calcWidth = viewportWidth;
    calcHeight = viewportWidth / baseRatio;
  } else {
    calcHeight = viewportHeight;
    calcWidth = viewportHeight * baseRatio;
  }
  
  calcWidth = Math.max(minWidth, Math.min(baseWidth, calcWidth));
  calcHeight = Math.max(minHeight, Math.min(baseHeight, calcHeight));
  const scaleRatio = calcWidth / baseWidth;
  
  // 更新所有元素尺寸
  Object.keys(elementSizes.value).forEach(key => {
    const refValue = {
      headerPadding, titleFontSize, titleMarginLeft,
      closeBtnSize, bodyPadding, buttonWidth,
      buttonHeight, buttonPadding, buttonFontSize,
      buttonGap
    }[key];
    refValue.value = elementSizes.value[key] * scaleRatio;
  });
  
  // 更新游戏画布尺寸（减去头部高度）
  gameSize.value = {
    width: calcWidth - bodyPadding.value * 2,
    height: calcHeight - headerPadding.value * 2 - bodyPadding.value * 2
  };
  
  return { width: calcWidth, height: calcHeight };
};

// 位置计算
const calculatePositionFromRatio = () => {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const availableWidth = viewportWidth - dialogSize.value.width;
  const availableHeight = viewportHeight - dialogSize.value.height;
  
  dialogLeft.value = dialogPositionRatio.value.x * availableWidth;
  dialogTop.value = dialogPositionRatio.value.y * availableHeight;
};

const centerDialog = () => {
  dialogPositionRatio.value = { x: 0.5, y: 0.5 };
  dialogSize.value = calculateSizes();
  calculatePositionFromRatio();
};

// 拖拽逻辑（保持不变）
const isDragging = ref(false);
const startX = ref(0);
const startY = ref(0);

const startDrag = (e) => {
  if (e.button !== 0) return;
  isDragging.value = true;
  startX.value = e.clientX;
  startY.value = e.clientY;
  document.body.style.cursor = 'move';
  e.stopPropagation();
  e.preventDefault();
};

const handleDragMove = (e) => {
  if (!isDragging.value) return;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const availableWidth = viewportWidth - dialogSize.value.width;
  const availableHeight = viewportHeight - dialogSize.value.height;
  
  dialogLeft.value = Math.max(0, Math.min(dialogLeft.value + (e.clientX - startX.value), availableWidth));
  dialogTop.value = Math.max(0, Math.min(dialogTop.value + (e.clientY - startY.value), availableHeight));
  
  dialogPositionRatio.value.x = availableWidth > 0 ? dialogLeft.value / availableWidth : 0.5;
  dialogPositionRatio.value.y = availableHeight > 0 ? dialogTop.value / availableHeight : 0.5;
  
  startX.value = e.clientX;
  startY.value = e.clientY;
};

const endDrag = () => {
  if (isDragging.value) {
    isDragging.value = false;
    document.body.style.cursor = '';
  }
};

// 窗口大小变化
const handleWindowResize = () => {
  if (showDialog.value && !isDragging.value) {
    dialogSize.value = calculateSizes();
    calculatePositionFromRatio();
    // 调整游戏画布
    if (currentView === 'game' && gameCanvas.value) {
      const canvas = gameCanvas.value;
      canvas.width = gameSize.value.width;
      canvas.height = gameSize.value.height;
    }
  }
};

// 游戏核心逻辑
const initGame = () => {
  // 初始化画布
  const canvas = gameCanvas.value;
  if (!canvas) return;
  
  canvas.width = gameSize.value.width;
  canvas.height = gameSize.value.height;
  
  // 重置游戏状态
  gameScore.value = 0;
  gameRound.value = 1;
  gameState.value = {
    player1: { x: 50, y: canvas.height / 2, width: 40, height: 60, color: '#e63946' },
    player2: { x: canvas.width - 90, y: canvas.height / 2, width: 40, height: 60, color: '#457b9d' },
    ball: { x: canvas.width / 2, y: canvas.height / 2, radius: 10, dx: 5, dy: 3, color: '#f1faee' }
  };
  
  // 启动游戏循环
  startGameLoop();
};

const startGameLoop = () => {
  // 清除之前的循环
  if (gameLoop.value) clearInterval(gameLoop.value);
  
  // 每16ms更新一次（约60fps）
  gameLoop.value = setInterval(() => {
    updateGame();
    renderGame();
  }, 16);
};

const updateGame = () => {
  const { player1, player2, ball } = gameState.value;
  const canvas = gameCanvas.value;
  
  // 球的移动
  ball.x += ball.dx;
  ball.y += ball.dy;
  
  // 碰撞检测（边界）
  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    ball.dy = -ball.dy; // 垂直反弹
  }
  
  // 碰撞检测（玩家）
  if (
    ball.x - ball.radius < player1.x + player1.width &&
    ball.y > player1.y &&
    ball.y < player1.y + player1.height
  ) {
    ball.dx = -ball.dx; // 水平反弹
    gameScore.value += 10;
  }
  
  if (
    ball.x + ball.radius > player2.x &&
    ball.y > player2.y &&
    ball.y < player2.y + player2.height
  ) {
    ball.dx = -ball.dx; // 水平反弹
    gameScore.value += 10;
  }
  
  // 得分/回合逻辑（球出界）
  if (ball.x < 0 || ball.x > canvas.width) {
    gameRound.value += 1;
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = 5 * (Math.random() > 0.5 ? 1 : -1); // 随机方向
  }
};

const renderGame = () => {
  const canvas = gameCanvas.value;
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height); // 清空画布
  
  // 绘制玩家
  const { player1, player2, ball } = gameState.value;
  
  ctx.fillStyle = player1.color;
  ctx.fillRect(player1.x, player1.y, player1.width, player1.height);
  
  ctx.fillStyle = player2.color;
  ctx.fillRect(player2.x, player2.y, player2.width, player2.height);
  
  // 绘制球
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = ball.color;
  ctx.fill();
  ctx.closePath();
};

// 游戏控制（键盘监听）
const handleKeydown = (e) => {
  const { player1, player2 } = gameState.value;
  const speed = 8;
  
  // 玩家1控制：W/S
  if (e.key === 'w' && player1.y > 0) {
    player1.y -= speed;
  }
  if (e.key === 's' && player1.y + player1.height < gameSize.value.height) {
    player1.y += speed;
  }
  
  // 玩家2控制：上/下箭头
  if (e.key === 'ArrowUp' && player2.y > 0) {
    player2.y -= speed;
  }
  if (e.key === 'ArrowDown' && player2.y + player2.height < gameSize.value.height) {
    player2.y += speed;
  }
};

// 视图切换方法
const enterFriendBattle = () => {
  currentView.value = 'game';
  nextTick(initGame); // 初始化游戏
};



const closeDialog = () => {
  showDialog.value = false;
  emit('update:visible', false);
  backToMenu();
};

const handleHeavenBattle = () => {
  console.log('天人之战（待实现）');
};

// 生命周期
onMounted(() => {
  document.addEventListener('mousemove', handleDragMove);
  document.addEventListener('mouseup', endDrag);
  window.addEventListener('resize', handleWindowResize);
  window.addEventListener('keydown', handleKeydown); // 监听键盘
});

onUnmounted(() => {
  document.removeEventListener('mousemove', handleDragMove);
  document.removeEventListener('mouseup', endDrag);
  window.removeEventListener('resize', handleWindowResize);
  window.removeEventListener('keydown', handleKeydown);
  if (gameLoop.value) clearInterval(gameLoop.value);
});
</script>

<style scoped>
/* 基础样式保持不变 */
.saber-app-root {
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
  z-index: -1;
}

* {
  -webkit-text-size-adjust: none !important;
  text-size-adjust: none !important;
  box-sizing: border-box !important;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1050;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s linear;
}

.modal-backdrop.show {
  opacity: 1;
  pointer-events: auto;
}

.modal-dialog {
  margin: 0;
  transition: transform 0.3s ease-out;
  overflow: visible;
  transform: none !important;
  transform-origin: 0 0 !important;
}

.modal-header {
  user-select: none;
  pointer-events: auto;
  margin: 0 !important;
  padding: 0 !important;
}

.custom-header {
  background-color: #F5F5F5;
}

.content-with-bg {
  height: 100%;
  margin: 0 !important;
  padding: 0 !important;
  overflow: hidden; /* 隐藏画布外内容 */
  background-image: url('@/assets/background.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
}

.content-text {
  color: #ffffff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
  font-weight: 500;
}

/* 按钮样式增强 */
:deep(.content-text.btn) {
  background-color: rgba(255, 255, 255, 0.3) !important;
  border: 2px solid rgba(255, 255, 255, 0.7) !important;
  cursor: pointer !important;
  transition: all 0.3s ease !important;
}

:deep(.content-text.btn:hover) {
  background-color: rgba(255, 255, 255, 0.4) !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2) !important;
}

:deep(.content-text.btn:active) {
  transform: translateY(0) !important;
  box-shadow: none !important;
}

/* 标题样式 */
:deep(.modal-title) {
  margin-left: var(--title-margin) !important;
}

:deep(.modal-header), :deep(.modal-body) {
  margin: 0 !important;
  padding: 0 !important;
}
</style>
    