<template>
  <div 
    class="w-100 h-100 d-flex flex-column items-center justify-content-center relative"
    :style="{ 
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      zIndex: 101
    }"
  >
    <!-- 对战标题 -->
    <h3 :style="{ 
      color: 'white', 
      fontSize: buttonFontSize * 1.5 + 'px',
      textShadow: '0 2px 4px rgba(0,0,0,0.8)',
      marginBottom: '20px'
    }">
      {{ battleType === 'heaven' ? '天人对战' : '好友对战' }}
    </h3>

    <!-- 游戏状态提示 -->
    <div :style="{ 
      color: 'white',
      fontSize: buttonFontSize + 'px',
      textShadow: '0 1px 2px rgba(0,0,0,0.8)',
      margin: '20px 0'
    }">
      {{ battleType === 'heaven' ? '正在与AI对战...' : '正在与好友对战...' }}
    </div>

    <!-- 操作按钮区 -->
    <div class="d-flex gap-3 mt-4">
      <button 
        class="content-text btn"
        :style="{
          minWidth: buttonWidth * 0.8 + 'px',
          minHeight: buttonHeight * 0.8 + 'px',
          fontSize: buttonFontSize * 0.9 + 'px',
          cursor: 'pointer'
        }"
        @click="$emit('back-to-battle')"
      >
        返回选择
      </button>
      <button 
        class="content-text btn"
        :style="{
          minWidth: buttonWidth * 0.8 + 'px',
          minHeight: buttonHeight * 0.8 + 'px',
          fontSize: buttonFontSize * 0.9 + 'px',
          cursor: 'pointer'
        }"
        @click="$emit('back-to-menu')"
      >
        返回菜单
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

// 接收对战类型和样式参数
const props = defineProps({
  // 对战类型：'heaven' 天人对战，'friend' 好友对战
  battleType: {
    type: String,
    required: true,
    validator: (value) => {
      return ['heaven', 'friend'].includes(value);
    }
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
  // 允许父组件自定义背景图（可选）
  customHeavenBg: {
    type: String,
    default: ''
  },
  customFriendBg: {
    type: String,
    default: ''
  }
});

// 根据对战类型计算背景图片
const backgroundImage = computed(() => {
  // 如果父组件提供了自定义背景图，则优先使用
  if (props.battleType === 'heaven' && props.customHeavenBg) {
    return props.customHeavenBg;
  }
  if (props.battleType === 'friend' && props.customFriendBg) {
    return props.customFriendBg;
  }

  // 默认背景图（实际项目中替换为你的图片路径）
  return props.battleType === 'heaven' 
    ? '/images/heaven-battle-bg.jpg'  // 天人对战背景
    : '/images/friend-battle-bg.jpg'; // 好友对战背景
});

// 定义事件
const emit = defineEmits([
  'back-to-menu',   // 返回主菜单
  'back-to-battle'  // 返回对战选择页
]);
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
  transition: all 0.3s ease !important;
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
