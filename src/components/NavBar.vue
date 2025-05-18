<template>
  <nav class="navbar navbar-expand-md navbar-dark bg-primary bg-gradient shadow-sm py-2">
    <div class="container">
      <router-link class="navbar-brand fw-bold fs-4" to="/">My Blog</router-link>
      <button class="navbar-toggler" @click="isOpen = !isOpen" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" :class="{ show: isOpen }">
        <ul class="navbar-nav me-auto mb-0">
          <li v-for="item in leftLinks" :key="item.to" class="nav-item">
            <router-link class="nav-link px-3" :to="item.to">{{ item.label }}</router-link>
          </li>
        </ul>
        <ul class="navbar-nav ms-auto mb-0">
  <template v-if="isLogin">
    <li class="nav-item">
      <span class="nav-link px-3">{{ userName }}</span>
    </li>
    <li class="nav-item">
      <a href="#" class="nav-link px-3" @click.prevent="logout">登出</a>
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

<script>
import LoginModal from './LoginModal.vue';
import RegisterModal from './RegisterModal.vue';

export default {
  name: 'NavBar',
  components: { LoginModal, RegisterModal },
  data() {
    return {
      isOpen: false,
      loginVisible: false,
      registerVisible: false,
      leftLinks: [
        { label: '首页', to: '/' },
        { label: '用户信息', to: '/users' },
        { label: '帖子列表', to: '/posts' }
      ]
    };
  },
  computed: {
    isLogin() {
      return this.$store.getters['user/isLogin'];
    },
    userName() {
      return this.$store.getters['user/userName'];
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('user/logout');
    },
    handleLoginSuccess(user) {
      console.log('登录成功的用户:', user);
      this.loginVisible = false;
      // 可选：如果你想显示欢迎信息也可以设置本地 userProfile
      this.userProfile = user;
    }
  }
};
</script>

<style scoped>
.nav-link { color: rgba(255,255,255,0.85)!important; position: relative; }
.nav-link::after { content: ''; position: absolute; bottom:0; left:50%; width:0; height:2px; background:#fff; transition:all 0.3s; }
.nav-link:hover { color:#fff!important; }
.nav-link:hover::after { left:25%; width:50%; }
</style>
