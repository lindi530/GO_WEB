<template>
      <div class="w-100 h-100 d-flex flex-column items-center justify-content-center" style="position: relative; z-index: 101;">
        <h3 :style="{ color: 'white', fontSize: buttonFontSize * 1.5 + 'px' }">
        {{ battleType }}
        </h3>
        <div :style="{ margin: '20px 0', color: 'white' }">
        游戏进行中...
        </div>
        <button 
        class="content-text btn"
        :style="{
            minWidth: buttonWidth * 0.8 + 'px',
            minHeight: buttonHeight * 0.8 + 'px',
            fontSize: buttonFontSize * 0.9 + 'px',
            cursor: 'pointer',
            pointerEvents: 'auto'
        }"
        @click="$emit('back-to-menu')"
        >
        返回菜单
        </button>
    </div>
</template>

<script setup>
import { ref } from 'vue'

// 接收从父组件传递的参数
const props = defineProps({
  battleType: {
    type: String,
    required: true
  },
  buttonWidth: {
    type: Number,
    required: true
  },
  buttonHeight: {
    type: Number,
    required: true
  },
  buttonFontSize: {
    type: Number,
    required: true
  },
backgroundImage: {
type: String,
required: true
}
});

// 定义要发射的事件
const emit = defineEmits(['back-to-menu']);

const currentView = ref('menu'); // 新增 'game' 状态
const currentBattleType = ref(''); // 存储 'heaven' 或 'friend'

// 处理天人对战点击
const handleHeavenBattle = () => {
  currentBattleType.value = 'heaven';
  currentView.value = 'game'; // 直接进入游戏视图
};

// 处理好友对战点击
const handleFriendBattle = () => {
  currentBattleType.value = 'friend';
  currentView.value = 'game'; // 直接进入游戏视图
};
</script>

<style scoped>
.content-text {
  color: #ffffff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
  font-weight: 500;
}

:deep(.content-text.btn) {
  background-color: rgba(255, 255, 255, 0.3) !important;
  border: 2px solid rgba(255, 255, 255, 0.7) !important;
  cursor: pointer !important;
  transition: all 0.3s ease !important;
  pointer-events: auto !important;
  position: relative !important;
  z-index: 10 !important;
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
</style>
