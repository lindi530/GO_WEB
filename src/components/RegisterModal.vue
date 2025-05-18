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
          <h5 class="modal-title">用户注册</h5>
          <button type="button" class="btn-close" @click="close" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submit">
            <div class="mb-3">
              <label for="regUsername" class="form-label">用户名</label>
              <input
                type="text"
                class="form-control"
                id="regUsername"
                v-model="form.username"
                required
              />
            </div>
            <div class="mb-3">
              <label for="regEmail" class="form-label">邮箱</label>
              <input
                type="email"
                class="form-control"
                id="regEmail"
                v-model="form.email"
                required
              />
            </div>
            <div class="mb-3">
              <label for="regPassword" class="form-label">密码</label>
              <input
                type="password"
                class="form-control"
                id="regPassword"
                v-model="form.password"
                required
              />
            </div>
            <button type="submit" class="btn btn-success">注册</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RegisterModal',
  props: {
    visible: { type: Boolean, default: false }
  },
  data() {
    return { form: { username: '', email: '', password: '' } };
  },
  methods: {
    close() {
      this.$emit('update:visible', false);
      this.reset();
    },
    submit() {
      console.log('Register:', this.form);
      this.close();
    },
    reset() {
      this.form.username = '';
      this.form.email = '';
      this.form.password = '';
    }
  }
};
</script>

<style scoped>
.modal.fade { transition: none; }
.modal.show { background-color: rgba(0, 0, 0, 0.5); }
</style>
