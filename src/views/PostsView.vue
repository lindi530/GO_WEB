<template>
  <main class="col-md-9 mb-4 container">
    <h4 class="mb-3">All Posts</h4>
    <div v-if="posts.length" >
      <div v-for="post in posts" :key="post.post_id">
        <SimplePost :post="post"/>
      </div>
    </div>
    <p v-else class="text-muted">No posts available.</p>
  </main>
</template>

<script>
import SimplePost from '@/components/post/PostSimple.vue';
import api from '@/api';
export default {
  components: {SimplePost},
  name: 'AllPosts',
  data() {
    return {
      posts: []
    };
  },
  async mounted() {
    await this.fetchPosts();
  },
  methods: {
    async fetchPosts() {
      try {
        console.log("api response")
        const response = await api.getAllPosts();
        console.log("response: ", response)
        if (response.code) throw new Error('Fetch failed');
        this.posts = response.data;
      } catch (error) {
            console.log("error")
         // 网络层抛出的错误，axios 会把它包装成 AxiosError
            console.error("Fetch error (toJSON):", error.toJSON());
            if (error.response) {
            // 服务端返回了非 2xx 状态
            console.error("  response.data:", error.response.data);
            console.error("  status:", error.response.status);
            } else if (error.request) {
            // 请求发出了，但没有收到响应（很可能是 CORS / 网络断连）
            console.error("  no response, request was:", error.request);
            } else {
            // 其他代码错误
            console.error("  something else happened:", error.message);
            }
            alert('Failed to load posts');
        }
    },
    formattedDate(dateStr) {
      return new Date(dateStr).toLocaleDateString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric'
      });
    }
  }
};
</script>

<style scoped>
/* 可根据需要添加样式 */
</style>
