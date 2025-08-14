<template>
  <div class="d-flex gap-4" style="position: relative; z-index: 101;">
    <button 
      type="button" 
      class="content-text btn"
      :style="{
        minWidth: buttonWidth + 'px',
        maxWidth: 'calc(50% - 8px)',
        minHeight: buttonHeight + 'px',
        padding: buttonPadding + 'px',
        fontSize: buttonFontSize + 'px',
        cursor: 'pointer',
        pointerEvents: 'auto'
      }"
      @click="$emit('heaven-battle')"
    >
      天人对战
    </button>
    <button 
      type="button" 
      class="content-text btn"
      :style="{
        minWidth: buttonWidth + 'px',
        maxWidth: 'calc(50% - 8px)',
        minHeight: buttonHeight + 'px',
        padding: buttonPadding + 'px',
        fontSize: buttonFontSize + 'px',
        cursor: 'pointer',
        pointerEvents: 'auto'
      }"
      @click="$emit('friend-battle')"
    >
      好友对战
    </button>
  </div>
</template>

<script setup>
// 接收从父组件传递的样式参数
const props = defineProps({
  buttonWidth: {
    type: Number,
    required: true
  },
  buttonHeight: {
    type: Number,
    required: true
  },
  buttonPadding: {
    type: Number,
    required: true
  },
  buttonFontSize: {
    type: Number,
    required: true
  }
});

// 定义要发射的事件
const emit = defineEmits(['heaven-battle', 'friend-battle']);
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
