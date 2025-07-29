<template>
  <n-card size="small" :segmented="{ content: true }">
    <template #header>
      <div class="header-content">
        <span class="title-text">
          {{ testSample === true ? '样例测试状态' : '代码提交状态' }}：
        </span>

        <span 
          :class="statusClass"
          class="status-value"
        >
          {{ activeStatus }}
        </span>
      </div>
    </template>
    <n-input
      v-model:value="input"
      type="textarea"
      rows="3"
      placeholder=""
      class="mb-2"
    />
    <div class="d-flex justify-content-between mb-2">
      <n-button type="success" @click="runFunction">运行</n-button>
    </div>

    <n-card
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
  testSample: Boolean,
  sampleInput: String,
  activeStatus: String,
  output: String,
  status: String
})

const emit = defineEmits(['handleTestSample', "handleActiveStatus"])

const input = ref(props.sampleInput)
watch(input, val => {
  // 如果父组件需要同步 sampleInput，可以 emit，这里先保留本地逻辑
})

// 样例提交
const runFunction = async () => {
  console.log("提交中...")
  emit('handleTestSample', true)
  emit('handleActiveStatus', "")
  try {
    // 模拟异步提交
    console.log("提交成功...")
    emit('handleActiveStatus', "Finished")

  } catch (error) {
    resultOutput.value = error.message
  }
}

const statusTitle = computed(() => {
  if (props.status === '运行成功') return '✅ 输出结果'
  if (props.status === '运行失败') return '❌ 运行失败'
  if (props.status === '运行中...') return '⏳ 正在运行...'
  return '运行状态'
})


const statusClass = computed(() => {
  switch (props.activeStatus) {
    case 'Finished':
      return 'status-success';
    default:
      return 'status-error';
  }
});
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

.status-value {
  font-size: 15px;
}

/* 不同状态的颜色 */

.status-success {
  color: #18a058; /* 成功绿色 */
}
.status-error {
  color: #d03050; /* 错误红色 */
}

</style>
