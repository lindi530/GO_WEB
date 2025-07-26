// src/views/CodingView.vue
<template>
  <div
  class="container-fluid px-5 py-4 page-container"
  style="height: 90vh; overflow-y: auto; padding-bottom: 0; margin-bottom: 0;"
>
    <div class="row justify-content-center">
      <div class="col-12">
        <div class="d-flex" style="gap: 24px;">
          <!-- 左侧题目区域 -->
          <div class="flex-fill" style="max-width: 50%;">
            <ProblemDetail v-if="problem" :problem="problem" />
          </div>

          <!-- 右侧编辑器+测试 -->
          <div class="flex-fill" style="max-width: 50%;">
            <CodeEditor v-model:lang="lang" v-model:code="code" />
            <SampleTest
              :sample-input="sampleInput"
              :output="sampleOutput"
              :status="runStatus"
              :run-function="runSampleTest"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ProblemDetail from '@/components/coding/ProblemDetail.vue'
import CodeEditor from '@/components/coding/CodeEditor.vue'
import SampleTest from '@/components/coding/SampleTest.vue'
import api from '@/api'

// 当前题目
const problem = ref(null)
const loading = ref(true)
const route = useRoute()

// 从 URL 获取 problemID
const problemID = 1 //route.params.problemID

onMounted(async () => {
  try {
    const res = await api.getProblemDetail(problemID)
    if (res.code === 0) {
      problem.value = res.data
      console.log(problem.value)
    } else {
      console.error('获取题目失败:', res.data)
    }
  } catch (err) {
    console.error('请求错误:', err)
  } finally {
    loading.value = false
  }
})

// 编辑器语言和代码
const lang = ref('cpp')
const code = ref(`#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n  return 0;\n}`)

// 样例测试
const sampleInput = ref(`2 7 11 15\n9`)
const sampleOutput = ref('')
const runStatus = ref('未运行')

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
    } catch {
      sampleOutput.value = '运行错误：输入格式不正确'
      runStatus.value = '运行失败'
    }
  }, 800)
}
</script>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}
.container-fluid {
  height: 100vh;
  overflow-y: auto;
}

.page-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

</style>