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

    <MonacoEditor
      v-if="editorVisible"
      :key="monacoKey"
      v-model:value="internalCode"
      :language="internalLang"
      :theme="theme"
      :height="400"
      :options="editorOptions"
      class="editor mb-3"
    />

    <div class="d-flex justify-content-between">
      <n-button @click="resetCode">重置代码</n-button>
      <n-button type="primary" @click="submitCode">提交</n-button>
    </div>
  </n-card>
</template>

<script setup>
import { ref, watch, defineAsyncComponent } from 'vue'
import { NCard, NSelect, NButton, NSpace, useMessage } from 'naive-ui'
import api from '@/api'

const MonacoEditor = defineAsyncComponent(() => import('monaco-editor-vue3'))

// props + emit
const props = defineProps({
  problemId: Number
})

const langOptions = [
  { label: 'C++', value: 'cpp' },
  { label: 'Python3', value: 'python' },
  { label: 'Java', value: 'java' }
]

const internalLang = ref('cpp')
const internalCode = ref(defaultCode(internalLang.value))
const editorVisible = ref(true)
const monacoKey = ref(0)
const theme = ref('vs-light')
const userEdited = ref(false)
const message = useMessage()


function defaultCode(lang) {
  return {
    cpp: `#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n  return 0;\n}`,
    python: `class Solution:\n    def twoSum(self, nums, target):\n        pass`,
    java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        return new int[]{};\n    }\n}`
  }[lang] || ''
}

function resetCode() {
  internalCode.value = defaultCode(internalLang.value)
  userEdited.value = false
  message.info('代码已重置')
}

function toggleTheme() {
  theme.value = theme.value === 'vs-light' ? 'vs-dark' : 'vs-light'
}

async function submitCode() {
  try {
    console.log({
      "problem_id": props.problemId,
      "language": internalLang.value,
      "code": internalCode.value,
    })

    const resp = await api.submitCode({
      "problem_id": props.problemId,
      "language": internalLang.value,
      "code": internalCode.value,
    })

    if (resp.code === 1) { 
      console.log("得到返回结果")
    }
  } catch { 

  }

  message.success('✅ 模拟提交成功')
  console.log('提交内容：', {
    lang: internalLang.value,
    code: internalCode.value
  })
}

watch(internalLang, (newLang, oldLang) => {
  if (!userEdited.value) {
    internalCode.value = defaultCode(newLang)
  }
})

const editorOptions = {
  minimap: { enabled: false },
  automaticLayout: true
}
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
.editor {
  width: 100%;
}
</style>
