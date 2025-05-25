// 文件: components/LoginModal.vue
<template>
  <div
    class="modal fade"
    tabindex="-1"
    :class="{ show: visible }"
    :style="visible ? 'display: block;' : ''"
    @click.self="close"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">用户登录</h5>
          <button type="button" class="btn-close" @click="close" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submit">
            <div class="mb-3">
              <label for="loginUsername" class="form-label">用户名</label>
              <input
                type="text"
                class="form-control"
                id="loginUsername"
                v-model="form.username"
                required
              />
            </div>
            <div class="mb-3">
              <label for="loginPassword" class="form-label">密码</label>
              <input
                type="password"
                class="form-control"
                id="loginPassword"
                v-model="form.password"
                required
              />
            </div>
            <div class="d-flex align-items-center">
              <button type="submit" class="btn btn-primary">登录</button>
              <!-- 新增的错误提示区域 -->
              <transition name="fade">
                <div v-if="errorMessage" class="text-danger ms-3">
                  <i class="bi bi-exclamation-circle-fill me-1"></i>
                  {{ errorMessage }}
                </div>
              </transition>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api';

export default {
  name: 'LoginModal',
  props: {
    visible: { type: Boolean, default: false }
  },
  data() {
    return { 
      form: { 
        username: '',
        password: ''
      },
      errorMessage: ''
    };
  },
  methods: {
    close() {
      this.$emit('update:visible', false);
      this.reset();
    },
    async submit() {
      this.errorMessage = '';
      try {
        await this.Login({
          username: this.form.username,
          password: this.form.password
        })
      } catch (err) {
        alert(err.response?.data?.message || '登录失败，请重试');
      }
    },
    async Login(data) {
      try {
        const loginRes = await api.login (data, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (loginRes.code) {
          this.errorMessage = loginRes.message
          return
        }
        const { accessToken, refreshToken, user } = loginRes.data;
        // 存储到 Vuex
        this.$store.commit('user/SET_ACCESSTOKEN', accessToken);
        this.$store.commit('user/SET_REFRESHTOKEN', refreshToken);
        this.$store.commit('user/SET_PROFILE', user);
        console.log("user: ", user)
        this.$emit('login-success', user);
      } catch(err) {
          alert(err.response?.data?.message || '登录失败，请重试');
      }
    },
    reset() {
      this.form.username = '';
      this.form.password = '';
    }
  }
};
</script>

<style scoped>
.modal.fade { transition: none; }
.modal.show { background-color: rgba(0, 0, 0, 0.5); }

/* 错误提示的过渡动画 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* 错误提示样式 */
.text-danger {
  color: #dc3545;
  font-size: 0.875rem;
}
</style>
