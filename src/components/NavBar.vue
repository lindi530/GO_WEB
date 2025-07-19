<template>
  <ChatModel v-model:visible="chatVisible" />
  <nav class="navbar navbar-expand-md navbar-dark bg-primary bg-gradient shadow-sm py-2">
    <div class="container">
      <RouterLink class="navbar-brand fw-bold fs-4" to="/">My Blog</RouterLink>
      <button class="navbar-toggler" @click="isOpen = !isOpen" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" :class="{ show: isOpen }">
        <ul class="navbar-nav me-auto mb-0">
          <li v-for="item in leftLinks" :key="item.to" class="nav-item">
            <button type="button" class="nav-link btn btn-link px-3" @click="handleLinkClick(item)">
              {{ item.label }}
            </button>
          </li>
        </ul>

        <ul class="navbar-nav ms-auto mb-0">
          <template v-if="isLogin">
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle user-menu"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img :src="userAvatar" alt="Avatar" class="rounded-circle me-2" width="28" height="28" />
                {{ userName }}
              </a>
              <ul class="dropdown-menu dropdown-menu-end shadow animated-dropdown">
                <li>
                  <RouterLink class="dropdown-item" :to="`/users/${userId}`">
                    <i class="bi bi-person me-2"></i> 用户信息
                  </RouterLink>
                </li>
                <li>
                  <RouterLink class="dropdown-item" to="/user/profile">
                    <i class="bi bi-gear me-2"></i> 设置
                  </RouterLink>
                </li>
                <li><hr class="dropdown-divider" /></li>
                <li>
                  <a class="dropdown-item text-danger" href="#" @click.prevent="logout">
                    <i class="bi bi-box-arrow-right me-2"></i> 登出
                  </a>
                </li>
              </ul>
            </li>
          </template>
          <template v-else>
            <li class="nav-item">
              <a href="#" class="nav-link px-3" @click.prevent="loginVisible = true">登录</a>
            </li>
            <li class="nav-item">
              <a href="#" class="nav-link px-3" @click.prevent="registerVisible = true">注册</a>
            </li>
          </template>
        </ul>
      </div>

      <LoginModal v-model:visible="loginVisible" @login-success="handleLoginSuccess" />
      <RegisterModal v-model:visible="registerVisible" />
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import LoginModal from './account/LoginModal.vue';
import RegisterModal from './account/RegisterModal.vue';
import ChatModel from './chat/UserChat.vue'
import api from '@/api';

const router = useRouter();
const store = useStore();

const isOpen = ref(false);
const loginVisible = ref(false);
const registerVisible = ref(false);
const chatVisible = ref(false);
const pendingRoute = ref(null);

const refreshToken = computed(() => store.getters['user/refreshToken']);
const accessToken = computed(() => store.getters['user/accessToken']);
const isLogin = computed(() => store.getters['user/isLogin']);
const userName = computed(() => store.getters['user/userName']);
const userId = computed(() => store.getters['user/userId']);
const userAvatar = computed(() => store.getters['user/userAvatar'] || '/default-avatar.png');

const leftLinks = computed(() => [
  { label: '首页', to: '/' },
  { label: '帖子列表', to: '/posts' },  
  { label: '用户信息', to: '/user-info' },
  { label: '用户列表', to: '/users/userList' },
  { label: '聊天', to: '/users/chat'},
  { label: '测试', to: '/test'}
]);

function handleLinkClick(item) {
  if (item.label === '用户信息') {
    if (isLogin.value && userId.value) {
      router.push(`/users/${userId.value}`);
    } else {
      loginVisible.value = true;
      pendingRoute.value = `/users/${userId.value}`;
    }
  } else if (item.label === '聊天') {
    chatVisible.value = true;
   } else {
    router.push(item.to);
  }
}

async function logout() {
  try {
    const resp = await api.logout({ refresh_token: refreshToken.value });
    if (resp.code === 0) {
      store.commit('user/SET_ACCESSTOKEN', '');
      store.commit('user/SET_REFRESHTOKEN', '');
      store.commit('user/SET_PROFILE', {});
      store.commit('user/LOGOUT');
    }
  } catch (err) {
    console.error("登出失败：", err);
  }
}

function handleLoginSuccess() {
  loginVisible.value = false;
  nextTick(() => {
    if (pendingRoute.value && userId.value) {
      router.push(`/users/${userId.value}`);
      pendingRoute.value = null;
    }
  });
}

</script>

<style scoped>
.user-menu {
  text-decoration: none !important;
  display: flex;
  align-items: center;
  font-weight: 500;
}

.animated-dropdown {
  animation: fadeInDown 0.2s ease-out;
}

.navbar-dark .nav-link,
.user-menu,
.dropdown-item {
  color: #ffffff !important;
}

.dropdown-menu {
  background-color: #ffffff;
  color: #333333;
}

.dropdown-item {
  color: #333333 !important;
}

.dropdown-item:hover {
  background-color: #f1f1f1;
  color: #000000 !important;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
