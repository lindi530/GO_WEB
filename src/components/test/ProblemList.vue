<template>
  <!-- 去掉 container 内边距，改成 container-fluid（宽度100%）或者 div 自定义 -->
   
  <div class="container-md mt-3">
    <div class="card shadow-sm rounded">
      <h2 class="text-center mt-4">题库</h2>
      <div class="card-body p-0"> 
        <!-- 搜索栏，去掉外层间距，改成紧凑排列 -->
        <div class="d-flex gap-2 p-3 border-bottom">
          <n-input
            v-model:value="searchText"
            placeholder="搜索题目..."
            clearable
            @input="filterProblems"
            style="flex: 1"
          />
          <n-button type="primary" @click="filterProblems">搜索</n-button>
        </div>

        <!-- 表格区域，不要padding -->
        <div class="table-responsive">
          <table class="table align-middle table-hover mb-0">
            <!-- ...表头和表体不变 -->
             <thead class="table-light">
                <tr>
                    <th style="width: 40px;"></th>
                    <th>题目名称</th>
                    <th>标签</th>
                    <th>难度</th>
                    <th>通过率</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="problem in pagedProblems" :key="problem.id">
                    <!-- 状态图标列 -->
                    <td class="text-center">
                    <template v-if="problem.solved">
                        <n-icon color="green" size="20"><CheckmarkCircle /></n-icon>
                    </template>
                    <template v-else-if="problem.submitted">
                        <n-icon color="red" size="20"><CloseCircle /></n-icon>
                    </template>
                    </td>

                    <!-- 题目名称（点击跳转） -->
                    <td>
                    <a href="javascript:;" @click="goToProblem(problem.id)" class="text-decoration-none">
                        {{ problem.title }}
                    </a>
                    </td>

                    <!-- 标签 -->
                    <td>
                    <n-space>
                        <n-tag
                        v-for="tag in problem.tags"
                        :key="tag"
                        type="info"
                        size="small"
                        chass="fixed-tag"
                        round
                        >
                        {{ tag }}
                        </n-tag>
                    </n-space>
                    </td>

                    <!-- 难度 -->
                    <td>
                    <n-tag :type="getDifficultyType(problem.difficulty)">
                        {{ problem.difficulty }}
                    </n-tag>
                    </td>

                    <!-- 通过率 -->
                    <td>{{ problem.passRate }}%</td>
                </tr>
                </tbody>
          </table>
        </div>

        <!-- 分页 -->
        <div class="d-flex justify-content-center p-3 border-top">
          <n-pagination
            v-model:page="page"
            :page-size="pageSize"
            :page-count="Math.ceil(filteredProblems.length / pageSize)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { NButton, NTag, NInput, NPagination, NSpace, NIcon } from "naive-ui";
import { CheckmarkCircle, CloseCircle } from "@vicons/ionicons5";
import { useRouter } from "vue-router";

const router = useRouter();

// 模拟数据
const problems = ref([
  { id: 1, title: "两数之和", difficulty: "简单", passRate: 89, solved: true, submitted: true, tags: ["数组", "哈希表"] },
  { id: 2, title: "最长回文子串", difficulty: "中等", passRate: 47, solved: false, submitted: true, tags: ["字符串", "动态规划"] },
  { id: 3, title: "合并K个排序链表", difficulty: "困难", passRate: 32, solved: false, submitted: false, tags: ["链表", "分治"] },
  { id: 4, title: "爬楼梯", difficulty: "简单", passRate: 91, solved: true, submitted: true, tags: ["动态规划"] },
  { id: 5, title: "LRU缓存机制", difficulty: "中等", passRate: 52, solved: false, submitted: false, tags: ["设计", "哈希表"] },
  { id: 6, title: "接雨水", difficulty: "困难", passRate: 41, solved: false, submitted: true, tags: ["双指针", "栈"] },
]);

// 搜索
const searchText = ref("");
const filteredProblems = ref([...problems.value]);

function filterProblems() {
  const keyword = searchText.value.trim().toLowerCase();
  filteredProblems.value = problems.value.filter((p) =>
    p.title.toLowerCase().includes(keyword)
  );
}

// 分页
const page = ref(1);
const pageSize = 5;
const pagedProblems = computed(() => {
  const start = (page.value - 1) * pageSize;
  return filteredProblems.value.slice(start, start + pageSize);
});

// 难度颜色
function getDifficultyType(difficulty) {
  if (difficulty === "简单") return "success";
  if (difficulty === "中等") return "warning";
  return "error";
}

// 点击跳转
function goToProblem(id) {
  router.push(`/problem/${id}`);
}
</script>

<style scoped>
.table td, .table th {
  vertical-align: middle;
}

.fixed-tag {
  display: inline-block;
  min-width: 70px;   /* 保证宽度一致 */
  text-align: center;
}
</style>

<!-- json
{
  "id": 1,
  "title": "两数之和",
  "difficulty": "简单",
  "passRate": 89,
  "solved": true,
  "submitted": true,
  "tags": ["数组", "哈希表"]
} -->
