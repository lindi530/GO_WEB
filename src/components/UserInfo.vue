<template>
  <aside class="col-md-3 mb-4">
    <div class="card shadow-sm">
      <div class="card-body text-center">
        <img :src="userAvatar" alt="Avatar" class="rounded-circle mb-3" width="100" height="100">
        <h5 class="card-title">{{ userName }}</h5>
        <p class="text-muted">{{ userEmail }}</p>
        <p>Joined: {{ formattedDate(createTime) }}</p>
      </div>
    </div>
  </aside>
</template>
<script>

export default {
  name: 'UserInfo',
  computed: {
    userAvatar() {
      return this.$store.getters['user/userAvatar']; // 你需要定义这个 getter
    },
    createTime() {
      return this.$store.getters['user/createTime'];
    },
    userEmail() {
      return this.$store.getters['user/userEmail'];
    },
    userName() {
      return this.$store.getters['user/userName'];
    }
  },
  methods: {
    formattedDate(dateStr) {
      return new Date(dateStr).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    }
  }
};
</script>