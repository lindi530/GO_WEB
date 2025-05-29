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

        <!-- 登录后用户菜单 -->
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
                <img
                :src="userAvatar"
                alt="Avatar"
                class="rounded-circle me-2"
                width="28"
                height="28"
              />
                {{ userName }}
              </a>
              <ul class="dropdown-menu dropdown-menu-end shadow animated-dropdown">
                <li>
                  <router-link
                    class="dropdown-item"
                    :to="`/users/${$store.getters['user/userId']}`"
                  >
                    <i class="bi bi-person me-2"></i> 用户信息
                  </router-link>
                </li>
                <li>
                  <router-link class="dropdown-item" to="/user/profile">
                    <i class="bi bi-gear me-2"></i> 设置
                  </router-link>
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

          <!-- 未登录状态 -->
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
import LoginModal from './account/LoginModal.vue';
import RegisterModal from './account/RegisterModal.vue';

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
    userAvatar() {
      return this.$store.getters['user/userAvatar'] || '/default-avatar.png';
    },
    leftLinks() {
      const links = [
        { label: '首页', to: '/' },
        { label: '帖子列表', to: '/posts' },  
        { label: '用户信息', to: 'user-info' }, // 默认空，点击时再动态判断跳转
        { label: '用户列表', to: '/users/userList'},
        { label: '测试', to: '/test'}
      ];
      return links;
    }
  },
  methods: {
    handleLinkClick(item) {
      if (item.label === '用户信息') {
        console.log("用户信息：", this.userId)
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
      // this.$router.push('/');
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
