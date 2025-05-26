<template>
  <aside class="col-md-3 mb-4">
    <div class="card shadow-sm">
      <div class="card-body text-center">
        <img
          :src=" user.avatar"
          alt="Avatar"
          class="rounded-circle mb-3"
          width="100"
          height="100"
          style="cursor: pointer"
        >
        <h5 class="card-title">{{ user.user_name }}</h5>
        <p class="text-muted">{{ user.email }}</p>
        <p class="text-muted">{{ "个性签名：" + user.quote }}</p>
        <p>Joined: {{ formattedDate(user.update_time) }}</p>
        <n-button
          v-if="shouldShowFollowButton"
          size="small"
          type="primary"
          @click="toggleFollow"
        >
          {{ isFollowing ? '取消关注' : '关注' }}
        </n-button>
      </div>
    </div>
  </aside>
</template>


<script setup>
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import api from '@/api';

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
});

const route = useRoute();
const store = useStore();
const user = ref(props.user || null);

const currentUserId = computed(() => store.getters['user/userId']); // 当前登录用户 ID，可按实际情况调整
const targetUserId = parseInt(route.params.userId);
const isFollowing = ref(false);


onMounted(async () => {
  if (isEmptyObject(user.value)) {
    const resp = await api.getUserProfileInfo(targetUserId);
    if (resp.code === 0) {
      user.value = resp.data;
      console.log("resp: ", resp.data)
    }
  }
});

const checkFollowing = async () => {
  const resp = await api.checkFollowing(targetUserId);
  if (resp.code === 0) {
    isFollowing.value = resp.data.isFollowing;
  }
};

const shouldShowFollowButton = computed(() => {
  return currentUserId.value !== targetUserId;
});

// 初始化检查
checkFollowing();

// 切换关注状态
const toggleFollow = async () => {
  console.log("toggleFollow: ", isFollowing.value)
  if (isFollowing.value) {
    const resp = await api.unFollowUser(targetUserId);
    if (resp.code === 0) {
      isFollowing.value = false;
    }
  } else {
    const resp = await api.followUser(targetUserId);
    if (resp.code === 0) {
      isFollowing.value = true;
    }
  }
};

// 格式化日期函数
const formattedDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

function isEmptyObject(obj) {
  return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
}
</script>