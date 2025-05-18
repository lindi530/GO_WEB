<template>
  <aside class="col-md-3 mb-4">
    <div class="card shadow-sm">
      <div class="card-body text-center">
        <img :src="user.avatar" alt="Avatar" class="rounded-circle mb-3" width="100" height="100">
        <h5 class="card-title">{{ user.name }}</h5>
        <p class="text-muted">{{ user.email }}</p>
        <p>Joined: {{ formattedDate(user.joined) }}</p>
      </div>
    </div>
  </aside>
</template>
<script>
export default {
  name: 'UserInfo',
  props: {
    user: { type: Object, required: true }
  },
  methods: {
    formattedDate(dateStr) {
      return new Date(dateStr).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    }
  }
};
</script>