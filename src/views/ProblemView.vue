// src/views/ProblemView.vue
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
            <CodeEditor 
              :problem-id="problemID"
            />
            <!-- <SampleTest
              :sample-input="sampleInput"
              :output="sampleOutput"
              :status="runStatus"
              :run-function="runSampleTest"
            /> -->
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
import api from '@/api'

// 当前题目
const problem = ref(null)
const loading = ref(true)
const route = useRoute()

// 从 URL 获取 problemID
const problemID = route.params.problem_id

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