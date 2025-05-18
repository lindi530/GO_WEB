<template>
  <main class="col-md-9 mb-4">
    <h4 class="mb-3">My Posts</h4>
    <div v-if="pagedPosts.length" class="list-group">
      <router-link
        v-for="post in pagedPosts"
        :key="post.id"
        :to="`/posts/${post.id}`"
        class="list-group-item list-group-item-action mb-2 shadow-sm"
      >
        <div class="d-flex justify-content-between align-items-start">
          <div>
            <h6 class="mb-1">{{ post.title }}</h6>
            <p class="mb-0 text-truncate">{{ post.excerpt }}</p>
          </div>
          <small class="text-muted ms-3">{{ formattedDate(post.date) }}</small>
        </div>
      </router-link>
    </div>
    <p v-else class="text-muted">You haven't posted anything yet.</p>

    <!-- Pagination Controls -->
    <nav v-if="totalPages > 1" aria-label="Posts pagination">
      <ul class="pagination justify-content-center mt-3">
        <li :class="['page-item', { disabled: currentPage === 1 }]">
          <button class="page-link" @click="changePage(currentPage - 1)">Previous</button>
        </li>
        <li v-for="page in totalPages" :key="page" :class="['page-item', { active: page === currentPage }]">
          <button class="page-link" @click="changePage(page)">{{ page }}</button>
        </li>
        <li :class="['page-item', { disabled: currentPage === totalPages }]">
          <button class="page-link" @click="changePage(currentPage + 1)">Next</button>
        </li>
      </ul>
    </nav>
  </main>
</template>

<script>
export default {
  name: 'UserPosts',
  props: {
    posts: { type: Array, required: true },
    pageSize: { type: Number, default: 5 }
  },
  data() {
    return { currentPage: 1 };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.posts.length / this.pageSize);
    },
    pagedPosts() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.posts.slice(start, start + this.pageSize);
    }
  },
  methods: {
    formattedDate(dateStr) {
      return new Date(dateStr).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    },
    changePage(page) {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;
    }
  }
};
</script>