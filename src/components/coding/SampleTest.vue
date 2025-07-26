<template>
  <n-card title="样例测试" size="small" :segmented="{ content: true }">
    <n-input
      v-model:value="input"
      type="textarea"
      rows="3"
      placeholder="请输入测试用例，如：2 7 11 15\n9"
      class="mb-2"
    />
    <div class="d-flex justify-content-between mb-2">
      <n-button type="success" @click="runFunction">运行</n-button>
      <small class="text-muted">状态：{{ status }}</small>
    </div>

    <n-card
      :title="statusTitle"
      :class="statusClass"
      size="small"
      :segmented="{ content: true }"
      style="max-height: 120px; overflow: auto"
    >
      <pre class="result-text">{{ output }}</pre>
    </n-card>
  </n-card>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { NCard, NInput, NButton } from 'naive-ui'

const props = defineProps({
  sampleInput: String,
  runFunction: Function,
  output: String,
  status: String
})

const input = ref(props.sampleInput)
watch(input, val => {
  // 如果父组件需要同步 sampleInput，可以 emit，这里先保留本地逻辑
})

const statusTitle = computed(() => {
  if (props.status === '运行成功') return '✅ 输出结果'
  if (props.status === '运行失败') return '❌ 运行失败'
  if (props.status === '运行中...') return '⏳ 正在运行...'
  return '运行状态'
})

const statusClass = computed(() => ({
  'n-card--success': props.status === '运行成功',
  'n-card--fail': props.status === '运行失败'
}))
</script>

<style scoped>
.result-text {
  white-space: pre-wrap;
  word-break: break-word;
  margin: 0;
  font-size: 13px;
}
.d-flex {
  display: flex;
}
.justify-content-between {
  justify-content: space-between;
}
.mb-2 {
  margin-bottom: 8px;
}
.n-card--success :deep(.n-card__header) {
  color: #2e7d32;
}
.n-card--fail :deep(.n-card__header) {
  color: #c62828;
}
</style>
