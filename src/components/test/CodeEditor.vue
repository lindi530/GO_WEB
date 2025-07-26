<template>
  <n-layout has-sider style="height: 90vh">
    <!-- 左侧题面 -->
    <n-layout-sider
      bordered
      width="50%"
      content-style="padding: 24px; overflow-y: auto;"
    >
      <h2 class="mb-2">两数之和</h2>
      <n-tag type="success" size="small" class="me-2">简单</n-tag>
      <n-tag type="info" size="small">数组</n-tag>
      <n-divider />

      <p>
        给定一个整数数组 <code>nums</code> 和一个目标值 <code>target</code>，请你在该数组中找出和为目标值的两个整数，并返回它们的数组下标。
      </p>

      <n-divider title-placement="left">输入描述</n-divider>
      <p>输入一个整数数组和一个目标整数。</p>

      <n-divider title-placement="left">输出描述</n-divider>
      <p>返回两个整数的下标，满足它们的和为目标值。</p>

      <n-divider title-placement="left">示例</n-divider>
      <pre><code>输入: nums = [2,7,11,15], target = 9
输出: [0,1]</code></pre>
    </n-layout-sider>

    <!-- 右侧提交与运行区 -->
    <n-layout>
      <n-layout-content content-style="padding: 24px; overflow-y: auto;">
        <n-space vertical size="large">
          <!-- 提交卡片 -->
          <n-card title="在线提交">
            <template #header-extra>
              <n-space align="center" style="gap: 12px;">
                <n-select
                  v-model:value="lang"
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
              v-model:value="code"
              :language="lang"
              :theme="theme"
              :height="400"
              class="mb-3"
            />

            <div class="d-flex justify-content-between">
              <n-button @click="resetCode">重置代码</n-button>
              <n-button type="primary" :loading="loading" @click="handleSubmit">
                提交
              </n-button>
            </div>
          </n-card>

          <!-- 样例测试卡片 -->
          <n-card title="样例测试" size="small" :segmented="{ content: true }">
            <n-input
              v-model:value="sampleInput"
              type="textarea"
              rows="3"
              placeholder="请输入测试用例，如：2 7 11 15\n9"
              class="mb-2"
            />
            <div class="d-flex justify-content-between mb-2">
              <n-button type="success" @click="runSampleTest">运行</n-button>
              <small class="text-muted">状态：{{ runStatus }}</small>
            </div>

            <n-card
              :title="runStatusHeader"
              :class="runStatusClass"
              size="small"
              :segmented="{ content: true }"
              style="max-height: 120px; overflow: auto;"
            >
              <pre class="result-text">{{ sampleOutput }}</pre>
            </n-card>
          </n-card>
        </n-space>
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<script setup>
import { ref, defineAsyncComponent, computed, watch } from 'vue'
import {
  NLayout,
  NLayoutSider,
  NLayoutContent,
  NCard,
  NSelect,
  NButton,
  NInput,
  NTag,
  NDivider,
  useMessage
} from 'naive-ui'

const MonacoEditor = defineAsyncComponent(() =>
  import('monaco-editor-vue3')
)

const lang = ref('cpp')
const code = ref('')
const loading = ref(false)
const message = useMessage()
const theme = ref('vs-light')

const editorVisible = ref(true)
const monacoKey = ref(0)

const langOptions = [
  { label: 'C++', value: 'cpp' },
  { label: 'Python3', value: 'py' },
  { label: 'Java', value: 'java' }
]

function defaultCode(lang) {
  return {
    cpp: `#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n  return 0;\n}`,
    py: `class Solution:\n    def twoSum(self, nums, target):\n        pass`,
    java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        return new int[]{};\n    }\n}`
  }[lang] || ''
}

code.value = defaultCode(lang.value)

const userEdited = ref(false)

watch(code, () => {
  userEdited.value = true
})

watch(lang, (newLang, oldLang) => {
  if (!userEdited.value) {
    editorVisible.value = false
    setTimeout(() => {
      code.value = defaultCode(newLang)
      monacoKey.value++
      editorVisible.value = true
    }, 50)
  } else {
    if (window.confirm('切换语言会重置当前代码，确定要切换吗？')) {
      editorVisible.value = false
      setTimeout(() => {
        code.value = defaultCode(newLang)
        userEdited.value = false
        monacoKey.value++
        editorVisible.value = true
      }, 50)
    } else {
      lang.value = oldLang
    }
  }
})

function resetCode() {
  code.value = defaultCode(lang.value)
  userEdited.value = false
  message.info('代码已重置')
  editorVisible.value = false
  setTimeout(() => {
    monacoKey.value++
    editorVisible.value = true
  }, 50)
}

function handleSubmit() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    message.success('✅ 代码提交成功！')
    console.log('提交内容:', {
      lang: lang.value,
      code: code.value
    })
  }, 1000)
}

function toggleTheme() {
  theme.value = theme.value === 'vs-light' ? 'vs-dark' : 'vs-light'
}

const sampleInput = ref(`2 7 11 15\n9`)
const sampleOutput = ref('')
const runStatus = ref('未运行')

const runStatusHeader = computed(() => {
  if (runStatus.value === '运行成功') return '✅ 输出结果'
  if (runStatus.value === '运行失败') return '❌ 运行失败'
  if (runStatus.value === '运行中...') return '⏳ 正在运行...'
  return '运行状态'
})

const runStatusClass = computed(() => {
  return {
    'n-card--success': runStatus.value === '运行成功',
    'n-card--fail': runStatus.value === '运行失败',
  }
})

function runSampleTest() {
  runStatus.value = '运行中...'
  sampleOutput.value = ''

  setTimeout(() => {
    try {
      const lines = sampleInput.value.trim().split('\n')
      const nums = lines[0].split(/\s+/).map(Number)
      const target = Number(lines[1])

      let res = [-1, -1]
      for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
          if (nums[i] + nums[j] === target) {
            res = [i, j]
            break
          }
        }
      }

      sampleOutput.value = `输出结果: [${res[0]}, ${res[1]}]`
      runStatus.value = '运行成功'
    } catch (e) {
      sampleOutput.value = '运行错误：输入格式不正确'
      runStatus.value = '运行失败'
    }
  }, 800)
}
</script>

<style scoped>
.result-text {
  white-space: pre-wrap;
  word-break: break-word;
  margin: 0;
  font-size: 13px;
}

.n-card--success :deep(.n-card__header) {
  color: #2e7d32;
}
.n-card--fail :deep(.n-card__header) {
  color: #c62828;
}

.d-flex {
  display: flex;
}
.justify-content-between {
  justify-content: space-between;
}
.me-2 {
  margin-right: 8px;
}
.mb-2 {
  margin-bottom: 8px;
}
.mb-3 {
  margin-bottom: 12px;
}
</style>
