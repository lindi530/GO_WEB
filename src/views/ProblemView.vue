<template>
  <div
    class="container-fluid px-5 py-4 page-container"
    style="height: 100%; overflow-y: auto; padding-bottom: 0; margin-bottom: 0;"
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

const props = defineProps({
  problemId: {
    type: Number,
    required: true,
  },
})

// 修复：统一转换为Number类型，避免类型不匹配
const problemID = ref(
  typeof route.params.problem_id !== 'undefined' 
    ? Number(route.params.problem_id) 
    : props.problemId
);

onMounted(async () => {
  try {
    const res = await api.getProblemDetail(problemID.value)
    if (res.code === 0) {
      problem.value = res.data
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
/* 移除全局样式污染，避免影响父组件 */
.page-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative; /* 确保在父级堆叠上下文中 */
  z-index: 1; /* 提升自身层级 */
}

/* 确保内容区域不被裁剪 */
.container-fluid {
  padding: 0;
  margin: 0;
  height: 100%;
}
</style>
