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

const MonacoEditor = defineAsyncComponent(() => import('monaco-editor-vue3'))

// props + emit
const props = defineProps({
  lang: String,
  code: String
})
const emit = defineEmits(['update:lang', 'update:code'])

const langOptions = [
  { label: 'C++', value: 'cpp' },
  { label: 'Python3', value: 'py' },
  { label: 'Java', value: 'java' }
]

const internalLang = ref(props.lang)
const internalCode = ref(props.code)
const editorVisible = ref(true)
const monacoKey = ref(0)
const theme = ref('vs-light')
const userEdited = ref(false)
const message = useMessage()

watch(() => props.lang, val => (internalLang.value = val))
watch(() => props.code, val => (internalCode.value = val))

watch(internalCode, val => {
  userEdited.value = true
  emit('update:code', val)
})
watch(internalLang, (newLang, oldLang) => {
  if (!userEdited.value) {
    editorVisible.value = false
    setTimeout(() => {
      internalCode.value = defaultCode(newLang)
      monacoKey.value++
      editorVisible.value = true
      emit('update:lang', newLang)
    }, 50)
  } else {
    if (window.confirm('切换语言将重置代码，确定？')) {
      internalCode.value = defaultCode(newLang)
      emit('update:lang', newLang)
      userEdited.value = false
    } else {
      internalLang.value = oldLang
    }
  }
})

function defaultCode(lang) {
  return {
    cpp: `#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n  return 0;\n}`,
    py: `class Solution:\n    def twoSum(self, nums, target):\n        pass`,
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

function submitCode() {
  message.success('✅ 模拟提交成功')
  console.log('提交内容：', {
    lang: internalLang.value,
    code: internalCode.value
  })
}

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
