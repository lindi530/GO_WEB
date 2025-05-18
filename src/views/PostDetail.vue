<template>
  <div class="container my-4">
    <div v-if="post" class="card shadow-sm">
      <div class="card-body">
        <h2 class="card-title">{{ post.title }}</h2>
        <p class="text-muted">{{ formattedDate(post.date) }}</p>
        <hr />
        <div v-html="post.content"></div>
      </div>
    </div>
    <p v-else class="text-center text-muted">Post not found.</p>
  </div>
</template>
<script>

export default {
  name: 'PostDetail',
  data() {
    return { post: null };
  },
  methods: {
    formattedDate(dateStr) {
      return new Date(dateStr).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    },
    fetchPost() {
      const id = this.$route.params.id;
      // 这里你可以替换为真实 API 调用
      const found = this.$root.posts.find(p => p.id === Number(id));
      this.post = found || null;
    }
  },
  created() {
    this.fetchPost();
  }
};
</script>

<style scoped>
.card-title {
  margin-bottom: 0.5rem;
}
</style>
