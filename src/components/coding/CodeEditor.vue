<template>
  <n-card title="在线提交">
    <template #header-extra>
      <n-space align="center" style="gap: 12px">
        <n-select
          v-model:value="internalLang"
          :options="langOptions"
          style="width: 120px"
          size="small"
        />
        <n-button size="small" @click="toggleTheme" tertiary>
          {{ theme === 'vs-light' ? '切换深色' : '切换浅色' }}
        </n-button>
      </n-space>
    </template>

    <div ref="editorContainer" class="editor-container mb-3">
      <MonacoEditor
        v-if="editorReady"
        v-model:value="internalCode"
        :language="internalLang"
        :theme="theme"
        :height="editorHeight"
        :options="editorOptions"
      />
    </div>

    <div class="d-flex justify-content-between">
      <n-button @click="resetCode">重置代码</n-button>
      <n-button 
        type="primary" 
        @click="submitCode"
        :disabled="isLoading"
        :class="{ 'opacity-50 cursor-not-allowed': isLoading }"
      >
        {{ isLoading ? '提交中...' : '提交' }}
      </n-button>
    </div>

    <SampleTest
      :activeStatus="activeStatus"
      :testSample="testSample"
      :outputValue="outputValue"
      @handleActiveStatus="handleActiveStatus"
      @handleTestSample="handleTestSample"
      @handleRunExample="handleRunExample"
    />
  </n-card>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick, defineAsyncComponent } from 'vue'
import { NCard, NSelect, NButton, NSpace, useMessage } from 'naive-ui'
import { useIntersectionObserver } from '@vueuse/core' // 从 vueuse 导入
import api from '@/api'
import SampleTest from './SampleTest.vue'
import { useWebSocketContext } from '@/composables/useWebSocket.js'

const MonacoEditor = defineAsyncComponent(() => import('monaco-editor-vue3'))

// props + emit
const props = defineProps({
  problemId: Number
})

const langOptions = [
  { label: 'C++', value: 'cpp' },
  { label: 'Python3', value: 'python' },
  { label: 'Go', value: 'go' }
]

const internalLang = ref('cpp')
const internalCode = ref('')
const editorReady = ref(false)
const editorContainer = ref(null)
const editorHeight = ref(400)
const theme = ref('vs-light')
const userEdited = ref(false)
const message = useMessage()
const isEditorVisible = ref(true)
const testSample = ref(true)
const isLoading = ref(false)
const activeStatus = ref('')
const outputValue = ref('')
const { registerSubmitCodeCallback } = useWebSocketContext()


// 存储 ResizeObserver 实例
let resizeObserver = null

function defaultCode(lang) {
  return {
    cpp: `#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n  return 0;\n}`,
    python: `class Solution:\n    def twoSum(self, nums, target):\n        pass`,
    go: `package main\n\nimport(\n  \"fmt\"\n)\n\nfunc main() {\n}`
  }[lang] || ''
}

const handleTestSample = (value) => {
  testSample.value = value
}

const handleActiveStatus = (value) => { 
  activeStatus.value = value
}

const handleRunExample = async (value) => { 
  const resp = await api.submitExample(
    props.problemId, 
    {
      "input": value,
      "language": internalLang.value,
      "code": internalCode.value,
    }
  )
  if (resp.code === 0) {
    console.log("得到样例输出")
    outputValue.value = resp.data.output;
  } else {

  }

}

const unregister = registerSubmitCodeCallback((msg) => {
  // 根据 msg 中的信息，决定要设置的状态值
  // 假设 msg 中有 content 字段（如 'pending'、'running'、'accepted' 等）
  console.log("Code Editor: ", msg)
  if (msg.content) {
    handleActiveStatus(msg.content) // 调用组件内的更新函数
  }
})

function resetCode() {
  internalCode.value = defaultCode(internalLang.value)
  userEdited.value = false
  message.info('代码已重置')
}

function toggleTheme() {
  theme.value = theme.value === 'vs-light' ? 'vs-dark' : 'vs-light'
}

async function submitCode() {
  if (isLoading.value) return

  isLoading.value = true
  handleTestSample(false)
  handleActiveStatus("")
  try {
    const resp = await api.submitCode(
      props.problemId,
      {
        "language": internalLang.value,
        "code": internalCode.value,
      })

    if (resp.code === 0) { 
      console.log("得到返回结果")
    } else {
    }
  } catch (error) {
    message.error('提交失败：' + error.message)
  } finally {
    isLoading.value = false  // 无论成功或失败都重置加载状态
  }

}

watch(internalLang, (newLang, oldLang) => {
  internalCode.value = defaultCode(newLang)
})

// 监听代码变化，标记用户是否编辑过
watch(internalCode, () => {
  if (!userEdited.value) {
    userEdited.value = true
  }
})

const editorOptions = {
  minimap: { enabled: false },
  automaticLayout: false, // 禁用自动布局，改用手动控制
  scrollBeyondLastLine: false
}

onMounted(async () => {
  // 初始设置默认代码
  internalCode.value = defaultCode(internalLang.value)
  
  // 等待容器渲染完成后再初始化编辑器
  await nextTick()
  
  // 初始化 ResizeObserver 监听容器尺寸变化
  if ('ResizeObserver' in window) {
    resizeObserver = new ResizeObserver(entries => {
      // 使用 requestAnimationFrame 避免布局抖动
      requestAnimationFrame(() => {
        if (entries[0] && entries[0].contentRect) {
          // 更新编辑器高度（可选）
          editorHeight.value = entries[0].contentRect.height
        }
      })
    })
    
    // 开始监听容器尺寸变化
    if (editorContainer.value) {
      resizeObserver.observe(editorContainer.value)
    }
  }
  
  // 使用 IntersectionObserver 检测编辑器是否在视口中
  const { stop } = useIntersectionObserver(
    editorContainer,
    ([{ isIntersecting }]) => {
      isEditorVisible.value = isIntersecting
      
      // 当编辑器进入视口时延迟初始化
      if (isIntersecting && !editorReady.value) {
        setTimeout(() => {
          editorReady.value = true
        }, 100)
      }
    }
  )
  
  // 组件销毁时停止观察
  onUnmounted(() => {
    stop()
  },

  )
})

onUnmounted(() => {
  // 清理 ResizeObserver
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
})
</script>

<style scoped>
.d-flex {
  display: flex;
}
.justify-content-between {
  justify-content: space-between;
}
.mb-3 {
  margin-bottom: 12px;
}
.editor-container {
  width: 100%;
  height: 400px; /* 默认高度，会被 ResizeObserver 更新 */
}
</style>