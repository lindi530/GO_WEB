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
            <button type="submit" class="btn btn-primary">登录</button>
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
    return { form: { username: '', password: '' } };
  },
  methods: {
    close() {
      this.$emit('update:visible', false);
      this.reset();
    },
    async submit() {
      console.log('onSubmit', this.form);
      try {
        // 确保后端路由为 /users/login
        const res = await api.login ({
          username: this.form.username,
          password: this.form.password
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const { accessToken, refreshToken, user } = res.data;
        // 存储到 Vuex
        this.$store.commit('user/SET_ACCESSTOKEN', accessToken);
        this.$store.commit('user/SET_REFRESHTOKEN', refreshToken);
        this.$store.commit('user/SET_PROFILE', user);


        console.log("username: " + this.$store.getters['user/userName'])

        this.$emit('login-success', user);
        this.close();
      } catch (err) {
        console.error('Login error:', err);
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
</style>
