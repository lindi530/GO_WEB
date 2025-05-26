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
      </div>
    </div>
  </aside>
</template>


<script>

export default {
  name: 'UserInfo',
  props: {
    user: {
      type: Object,
      required: true,
    }
  },
  methods: {
    formattedDate(dateStr) {
      return new Date(dateStr).toLocaleDateString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric'
      });
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
  }
}
</script>