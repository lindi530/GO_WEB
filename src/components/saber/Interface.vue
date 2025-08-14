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
          zIndex: 9999,
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
          <h5 class="modal-title text-dark mb-0" 
              :style="[
                {
                  fontSize: titleFontSize + 'px',
                  lineHeight: '1',
                  padding: '0'
                },
                { marginLeft: titleMarginLeft + 'px !important' }
              ]">
            Saber
          </h5>
          <button 
            type="button" 
            class="btn-close btn-close-dark " 
            aria-label="Close"
            :style="{
              width: closeBtnSize + 'px',
              height: closeBtnSize + 'px'
            }"
            @click="closeDialog"
          ></button>
        </div>
        
        <!-- 弹窗内容区：根据当前视图加载对应组件 -->
        <div class="modal-body content-with-bg d-flex align-items-center justify-content-center button-container" 
             :style="{
               padding: bodyPadding + 'px',
               position: 'relative',
               zIndex: '100',
               gap: buttonGap + 'px',
               height: `calc(100% - ${headerPadding * 2}px)`,
               overflow: 'hidden',
               backgroundImage: `url(${bgImage})`,
               backgroundSize: 'cover',
               backgroundPosition: 'center'
             }">
          <MenuView 
            v-if="currentView === 'menu'"
            :button-width="buttonWidth"
            :button-height="buttonHeight"
            :button-padding="buttonPadding"
            :button-font-size="buttonFontSize"
            @heaven-battle="handleHeavenBattle"
            @friend-battle="handleFriendBattle"
          />
          
          <BattleView 
            v-if="currentView === 'battle'"
            :battle-type="currentBattleType"
            :button-width="buttonWidth"
            :button-height="buttonHeight"
            :button-font-size="buttonFontSize"
            @back-to-menu="handleBackToMenu"
          />
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import BattleBg from '@/assets/1.png'; 
import menuBg from '@/assets/background.jpg'; 
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue';
import MenuView from './menu.vue';
import BattleView from './battle.vue'

// 接收显示状态props
const props = defineProps({
  visible: { 
    type: Boolean, 
    required: true,
    default: false
  }
})



// 组件内部状态
const showDialog = ref(false);
const currentView = ref('menu'); // 视图状态：menu/battle
const currentBattleType = ref(''); // 记录当前对战类型
const emit = defineEmits(['update:visible'])

// 同步显示状态
watch(() => props.visible, (val) => {
  if (val) {
    showDialog.value = true;
    nextTick(centerDialog);
  } else {
    showDialog.value = false;
    currentView.value = 'menu'; // 隐藏时重置视图
  }
}, { immediate: true })

// 弹窗位置与尺寸配置
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

// 缩放后的元素尺寸
const headerPadding = ref(elementSizes.value.headerPadding);
const titleFontSize = ref(elementSizes.value.titleFontSize);
const titleMarginLeft = ref(elementSizes.value.titleMarginLeft)
const closeBtnSize = ref(elementSizes.value.closeBtnSize);
const bodyPadding = ref(elementSizes.value.bodyPadding);
const buttonWidth = ref(elementSizes.value.buttonWidth);
const buttonHeight = ref(elementSizes.value.buttonHeight);
const buttonPadding = ref(elementSizes.value.buttonPadding);
const buttonFontSize = ref(elementSizes.value.buttonFontSize);
const buttonGap = ref(elementSizes.value.buttonGap);

// 拖拽相关变量
const isDragging = ref(false);
const startX = ref(0);
const startY = ref(0);

// 关闭弹窗
const closeDialog = () => {
  showDialog.value = false;
  emit('update:visible', false);
};


const bgImage = ref(menuBg);

const handleBackToMenu = () => { 
  currentView.value = "menu";
  bgImage.value = menuBg;
}

// 按钮点击事件 - 切换到对战视图
const handleHeavenBattle = () => {
  currentBattleType.value = '天人对战';
  currentView.value = 'battle';
  bgImage.value = BattleBg;
};

const handleFriendBattle = () => {
  currentBattleType.value = '好友对战';
  currentView.value = 'battle';
  bgImage.value = BattleBg;
};

// 计算弹窗尺寸
const calculateSizes = () => {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  const availableWidth = viewportWidth * 0.9;
  const availableHeight = viewportHeight * 0.9;
  
  let calcWidth, calcHeight;
  const heightByWidth = availableWidth / baseRatio;
  
  if (heightByWidth <= availableHeight) {
    calcWidth = availableWidth;
    calcHeight = heightByWidth;
  } else {
    calcHeight = availableHeight;
    calcWidth = availableHeight * baseRatio;
  }
  
  calcWidth = Math.max(minWidth, Math.min(baseWidth, calcWidth));
  calcHeight = Math.max(minHeight, Math.min(baseHeight, calcHeight));
  const scaleRatio = calcWidth / baseWidth;
  
  // 按比例更新所有元素尺寸
  headerPadding.value = elementSizes.value.headerPadding * scaleRatio;
  titleFontSize.value = elementSizes.value.titleFontSize * scaleRatio;
  closeBtnSize.value = elementSizes.value.closeBtnSize * scaleRatio;
  bodyPadding.value = elementSizes.value.bodyPadding * scaleRatio;
  buttonWidth.value = elementSizes.value.buttonWidth * scaleRatio;
  buttonHeight.value = elementSizes.value.buttonHeight * scaleRatio;
  buttonPadding.value = elementSizes.value.buttonPadding * scaleRatio;
  buttonFontSize.value = elementSizes.value.buttonFontSize * scaleRatio;
  titleMarginLeft.value = elementSizes.value.titleMarginLeft * scaleRatio;
  buttonGap.value = elementSizes.value.buttonGap * scaleRatio;
  
  return { width: calcWidth, height: calcHeight };
};

// 计算弹窗位置
const calculatePositionFromRatio = () => {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const availableWidth = viewportWidth - dialogSize.value.width;
  const availableHeight = viewportHeight - dialogSize.value.height;
  
  dialogLeft.value = dialogPositionRatio.value.x * availableWidth;
  dialogTop.value = dialogPositionRatio.value.y * availableHeight;
};

// 居中弹窗
const centerDialog = () => {
  dialogPositionRatio.value = { x: 0.5, y: 0.5 };
  dialogSize.value = calculateSizes();
  calculatePositionFromRatio();
};

// 拖拽事件处理
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

// 窗口大小变化处理
const handleWindowResize = () => {
  if (showDialog.value && !isDragging.value) {
    dialogSize.value = calculateSizes();
    calculatePositionFromRatio();
  }
};

// 生命周期管理
onMounted(() => {
  document.addEventListener('mousemove', handleDragMove);
  document.addEventListener('mouseup', endDrag);
  window.addEventListener('resize', handleWindowResize);
});

onUnmounted(() => {
  document.removeEventListener('mousemove', handleDragMove);
  document.removeEventListener('mouseup', endDrag);
  window.removeEventListener('resize', handleWindowResize);
});
</script>

<style scoped>
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
  z-index: 9998;
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
  overflow: hidden;
  transform: none !important;
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
  position: relative;
  z-index: 1;
}

.button-container {
  flex-wrap: wrap;
}

:deep(.modal-title) {
  margin-left: var(--title-margin) !important;
}

:deep(.modal-header), :deep(.modal-body) {
  margin: 0 !important;
  padding: 0 !important;
}
</style>
