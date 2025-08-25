<template>
  <div class="container mt-4 mb-5">
    <h2 class="mb-4">题目上传</h2>
    
    <ProblemBasicInfo 
      v-model="problemData.basicInfo" 
    />
    
    <ProblemEditor 
      v-model="problemData.description" 
    />
    
    <TestCasesUpload 
      v-model="problemData.testCases" 
    />
    
    <ProblemConstraints 
      v-model="problemData.constraints" 
    />
    
    <SubmitActions 
      @saveDraft="handleSaveDraft"
      @submitForReview="handleSubmitForReview"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ProblemBasicInfo from '@/components/ProblemUpload/ProblemBasicInfo.vue';
import ProblemEditor from '@/components/ProblemUpload/ProblemEditor.vue';
import TestCasesUpload from '@/components/ProblemUpload/TestCasesUpload.vue';
import ProblemConstraints from '@/components/ProblemUpload/ProblemConstraints.vue';
import SubmitActions from '@/components/ProblemUpload/SubmitActions.vue';
import { onMounted } from 'vue'

// 主数据存储
const problemData = ref({
  basicInfo: {
    title: '',
    difficulty: '',
    tags: []
  },
  description: {
    description: '',
    inputFormat: '',
    outputFormat: '',
    hint: ''
  },
  testCases: [],
  constraints: {
    timeLimit: 1000,
    memoryLimit: 256,
    maxSubmissions: 10
  }
});

// 移除可能导致递归的深层watch，只在需要时手动处理

const handleSaveDraft = () => {
  const draft = {
    data: problemData.value,
    savedAt: Date.now()
  }
    localStorage.setItem('problem-draft', JSON.stringify(draft))
  console.log("Save:", problemData.value)
  alert('草稿已保存到本地')
}

// 页面加载时恢复
onMounted(() => {
  const draft = localStorage.getItem('problem-draft')
  if (draft) {
    const { data, savedAt } = JSON.parse(draft)
    if (Date.now() - savedAt < 60 * 60 * 1000) { // 1小时
      problemData.value = data
    } else {
      localStorage.removeItem('problem-draft') // 超时清理
    }
    }
  console.log("problemData", problemData.value)
})

const handleSubmitForReview = () => {
  console.log('提交审核:', problemData.value);
  localStorage.removeItem('problem-draft')
  alert('已提交审核');
};
</script>