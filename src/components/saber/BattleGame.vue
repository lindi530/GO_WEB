<template>
  <div class="battle-game-container">
    <Edit 
      :room-id="roomId"
      :problem-id="problemId"
    />
  </div>
</template>

<script setup>
import Edit from '@/views/ProblemView.vue'

const props = defineProps({
  roomId: {
    type: String,
    required: true,
  },
  problemId: {
    type: Number,
    required: true,
  },
});
</script>

<style scoped>
.battle-game-container {
  /* 关键：确保内容容器占满弹窗高度，且不被裁剪 */
  height: 100%;
  width: 100%;
  overflow: hidden; /* 避免内部滚动与弹窗滚动冲突 */
  position: relative;
  z-index: 1; /* 确保在弹窗内容区内的层级 */
}
</style>
