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
            <button type="button" class="nav-link btn btn-link px-3" @click="handleLinkClick(item)">
              {{ item.label }}
            </button>
          </li>
        </ul>
        <ul class="navbar-nav ms-auto mb-0">
  <template v-if="isLogin">
    <li class="nav-item">
      <router-link :to="`/users/${$store.getters['user/userId']}`" class="nav-link px-3">
        {{ userName }}
      </router-link>
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
  computed: {
    isLogin() {
      return this.$store.getters['user/isLogin'];
    },
    userName() {
      return this.$store.getters['user/userName'];
    },
    userId() {
      return this.$store.getters['user/userId']; // 你需要在 user 模块中定义这个 getter
    },
    leftLinks() {
      const links = [
        { label: '首页', to: '/' },
        { label: '帖子列表', to: '/posts/' },
        { label: '用户信息', to: 'user-info' } // 默认空，点击时再动态判断跳转
      ];
      return links;
    }
  },
  methods: {
    handleLinkClick(item) {
      console.log(this.isLogin + "    handleLinkClick    " + this.userId)
      if (item.label === '用户信息') {
        console.log("用户信息：")
        if (this.isLogin && this.userId) {
          this.$router.push(`/users/${this.userId}`);
          console.log("已登录")
        } else {
          this.loginVisible = true;
          this.pendingRoute = `/users/${this.userId}`;// 标记为用户信息页
        }
      } else {
        this.$router.push(item.to);
      }
    },
    logout() {
      this.$store.dispatch('user/logout');
    },
    handleLoginSuccess() {
      this.loginVisible = false;
      this.$nextTick(() => {
        if (this.pendingRoute && this.userId) {
          this.$router.push(`/users/${this.userId}`);
          this.pendingRoute = null;
        }
      });
    }
  }, 
  data() {
    return {
      isOpen: false,
      loginVisible: false,
      registerVisible: false,
      pendingRoute: null
    };
  }
};
</script>

<style scoped>
.nav-link { color: rgba(255,255,255,0.85)!important; position: relative; }
.nav-link::after { content: ''; position: absolute; bottom:0; left:50%; width:0; height:2px; background:#fff; transition:all 0.3s; }
.nav-link:hover { color:#fff!important; }
.nav-link:hover::after { left:25%; width:50%; }
</style>
