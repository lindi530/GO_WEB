<template>
<div style="padding: 16px 24px; background-color: #f9f9f9;">
    <n-card :bordered="false" size="small" style="margin-bottom: 16px;">
      <template #header>
        <div class="d-flex justify-space-between align-center">
          <h2 class="mb-0">{{ problem.title }}</h2>
        </div>
      </template>
      <template #header-extra>
        <n-space>
          <n-tag :type="levelTagType(problem.level)" size="small">
            {{ problem.level }}
          </n-tag>
          <n-tag
            v-for="tag in problem.tags"
            :key="tag"
            type="info"
            size="small"
          >
            {{ tag }}
          </n-tag>
        </n-space>
      </template>
    </n-card>

    <!-- 描述模块 -->
    <n-card title="题目描述" size="small" class="mb-3">
      <div v-html="problem.description" />
    </n-card>

    <!-- 输入描述 -->
    <n-card title="输入描述" size="small" class="mb-3">
      <p>{{ problem.input_desc }}</p>
    </n-card>

    <!-- 输出描述 -->
    <n-card title="输出描述" size="small" class="mb-3">
      <p>{{ problem.output_desc }}</p>
    </n-card>

    <!-- 示例部分 -->
    <n-card title="示例" size="small">
      <div
        v-for="(ex, idx) in problem.examples"
        :key="idx"
        class="example-block"
      >
        <pre><code>输入: {{ ex.input }}{{"\n"}}输出: {{ ex.output }}</code></pre>
      </div>
    </n-card>
</div>
</template>

<script setup>
const props = defineProps({
  problem: {
    type: Object,
    required: true
  }
})

console.log("ProblemDetail: ", props.problem)

function levelTagType(level) {
  switch (level) {
    case '简单':
      return 'success'
    case '中等':
      return 'warning'
    case '困难':
      return 'error'
    default:
      return 'default'
  }
}
</script>

<style scoped>
.d-flex {
  display: flex;
}
.justify-space-between {
  justify-content: space-between;
}
.align-center {
  align-items: center;
}
.mb-0 {
  margin-bottom: 0;
}
.mb-3 {
  margin-bottom: 16px;
}

.example-block {
  background-color: #f5f5f5;
  padding: 12px;
  margin-bottom: 8px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 14px;
  white-space: pre-wrap;
}

* {
  box-sizing: border-box;
}
</style>
