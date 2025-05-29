<template>
  <section class="card shadow-sm p-4">
    <h5 class="mb-3">Create New Post</h5>
    <form @submit.prevent="submit">
      <div class="mb-3">
        <label for="title" class="form-label">Title</label>
        <input v-model="post.title" type="text" id="title" class="form-control" required>
      </div>
      <div class="mb-3">
        <label for="content" class="form-label">Content</label>
        <textarea v-model="post.content" id="content" class="form-control" rows="5" required></textarea>
      </div>
      <button type="submit" class="btn btn-primary">Post</button>
    </form>
  </section>
</template>
<script>
export default {
  name: 'NewPostForm',
  data() {
    return { post: { title: '', content: '' } };
  },
  emits: ['created'],
  methods: {
    submit() {
      const newPost = {
        ...this.post,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: 0,
        content: this.post.content.slice(0, 50)
      };
      console.log('newdata:', newPost)
      this.$emit('created', newPost);
      this.post.title = '';
      this.post.content = '';
    }
  }
};
</script>