<template>
  <div style="width: 30%; border-right: 1px solid #ddd; padding: 10px; overflow-y: auto;">
    <n-list bordered>
      <n-list-item
  v-for="user in followedUsers"
  :key="user.user_id"
  :class="['cursor-pointer', user.user_id === selectedUserId ? 'bg-primary text-white' : '']"
  @click="$emit('select', user.user_id)"
>
  <div style="display: flex; justify-content: space-between; align-items: center;">
    <!-- 左侧：头像和昵称 -->
    <div style="display: flex; align-items: center;">
      <img
        :src="user.avatar"
        class="rounded-circle me-3"
        alt="avatar"
        width="42"
        height="42"
      />
      <span>{{ user.user_name }}</span>
    </div>

    <!-- 右侧：在线状态 -->
    <div
      :class="user.online_state ? 'text-success' : 'text-muted'"
      style="display: flex; align-items: center; font-size: 0.9rem;"
    >
      {{ user.online_state ? '在线' : '离线' }}
      <i
        :class="user.online_state ? 'bi bi-check-circle-fill' : 'bi bi-x-circle'"
        class="ms-1"
      ></i>
    </div>
  </div>
</n-list-item>
    </n-list>
  </div>
</template>

<script setup>
const props = defineProps({
  followedUsers: {
    type: Array,
    required: true
  },
  selectedUserId: {
    type: Number,
    required: true
  }
})
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
.bg-primary {
  background-color: #0eb840 !important;
}
.text-white {
  color: white !important;
}
.n-list-item:hover {
  background-color: #f0f0f0;
}
</style>
