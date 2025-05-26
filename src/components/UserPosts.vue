<template>
  <main class="col-md-9 mb-4">
    <h4 class="mb-3">My Posts</h4>

    <div v-if="pagedPosts.length" class="list-group">
      <div
        v-for="post in pagedPosts"
        :key="post.post_id"
        class="list-group-item mb-2 shadow-sm"
      >
        <div class="d-flex justify-content-between align-items-start">
          <!-- 只有标题和摘要可点进详情 -->
          <router-link
            :to="`/posts/${post.post_id}`"
            class="flex-grow-1 text-decoration-none text-body"
          >
            <h6 class="mb-1">{{ post.title }}</h6>
            <p class="mb-0 text-truncate">{{ post.content }}</p>
            <small class="text-muted">{{ formattedDate(post.created_at) }}</small>
          </router-link>

          <!-- 单独的删除按钮，不会触发 router-link -->
          <button
            type="button"
            class="btn btn-link text-danger p-0 ms-3"
            @click="handleDelete(post.id, post.user_id)"
            title="Delete post"
          >
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>
    </div>

    <p v-else class="text-muted">You haven't posted anything yet.</p>

    <!-- Pagination Controls -->
    <nav v-if="totalPages > 1" aria-label="Posts pagination">
      <ul class="pagination justify-content-center mt-3">
        <li :class="['page-item', { disabled: currentPage === 1 }]">
          <button class="page-link" @click="changePage(currentPage - 1)">Previous</button>
        </li>
        <li
          v-for="page in totalPages"
          :key="page"
          :class="['page-item', { active: page === currentPage }]"
        >
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
import api from '@/api';
export default {
  name: 'UserPosts',
  props: {
    posts:    { type: Array, default: () => [] },
    pageSize: { type: Number, default: 3 }
  },
  data() {
     return { currentPage: 1 };
  },
  computed: {
    totalPages() { return Math.ceil(this.posts.length / this.pageSize); },
    pagedPosts() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.posts.slice(start, start + this.pageSize);
    }
  },
  methods: {
    changePage(page) {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;
      window.scrollTo(0, 0);
    },
    formattedDate(dateStr) {
      return new Date(dateStr).toLocaleDateString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric'
      });
    },
    async handleDelete(postId, userId) {
      if (!confirm("Are you sure you want to delete this post?")) return
      try {
        const response = await api.deletePost(userId, postId)
 
        if (response.code) throw new Error('Delete failed')
        
        // 从前端列表中移除已删除的帖子
        this.$emit('post-deleted', postId)
        // 如果需要可以添加成功提示
        alert('Post deleted successfully')
        
      } catch (error) {
        console.error('Delete error:', error)
        alert('Failed to delete post')
      }
    }
  }
};
</script>
