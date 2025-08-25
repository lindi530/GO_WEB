<template>
  <n-card title="限制条件" class="mb-4">
    <div class="row g-3">
      <div class="col-md-4">
        <label class="form-label">时间限制 (毫秒)</label>
        <n-input-number
          v-model:value="localTimeLimit"
          :min="100"
          :step="100"
          placeholder="时间限制"
        />
      </div>
      
      <div class="col-md-4">
        <label class="form-label">内存限制 (MB)</label>
        <n-input-number
          v-model:value="localMemoryLimit"
          :min="1"
          :step="1"
          placeholder="内存限制"
        />
      </div>
      
      <div class="col-md-4">
        <label class="form-label">最大提交次数</label>
        <n-input-number
          v-model:value="localMaxSubmissions"
          :min="1"
          :step="1"
          placeholder="提交次数限制"
        />
      </div>
    </div>
  </n-card>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue';
import { NCard, NInputNumber } from 'naive-ui';

// 定义属性
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      timeLimit: 1000,
      memoryLimit: 256,
      maxSubmissions: 10
    })
  }
});

// 定义事件
const emit = defineEmits(['update:modelValue']);

// 本地状态
const localTimeLimit = ref(props.modelValue.timeLimit);
const localMemoryLimit = ref(props.modelValue.memoryLimit);
const localMaxSubmissions = ref(props.modelValue.maxSubmissions);

// 同步到父组件
const syncToParent = () => {
  emit('update:modelValue', {
    timeLimit: localTimeLimit.value,
    memoryLimit: localMemoryLimit.value,
    maxSubmissions: localMaxSubmissions.value
  });
};

// 监听本地数据变化
watch(localTimeLimit, syncToParent);
watch(localMemoryLimit, syncToParent);
watch(localMaxSubmissions, syncToParent);

// 监听父组件数据变化
watch(
  () => props.modelValue,
  (newVal) => {
    localTimeLimit.value = newVal.timeLimit;
    localMemoryLimit.value = newVal.memoryLimit;
    localMaxSubmissions.value = newVal.maxSubmissions;
  },
  { deep: true }
);
</script>
