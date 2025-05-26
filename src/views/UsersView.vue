<template>
  <div class="container my-4">
    <div class="row">
      <UserProfileInfo :user="userProfile" />
      <UserPosts :posts="posts.posts"
                 @post-deleted="handlePostDeleted"
       />
    </div>
      <NewPostForm @created="addPost" />
    </div>
</template>
<script>
import UserProfileInfo from '../components/UserProfileInfo.vue';
import UserPosts from '../components/UserPosts.vue';
import NewPostForm from '../components/NewPostForm.vue';
import api from '@/api';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

export default {
  name: 'UserView',
  components: { UserProfileInfo, UserPosts, NewPostForm},
  setup() {
    const userProfile = ref({})
    const posts = ref([])

    onMounted(async () => {
      const route = useRoute();
      const userId = parseInt(route.params.userId); // 示例
      const profileResp = await api.getUserProfileInfo(userId)
      if (profileResp.code === 0) {
        userProfile.value = profileResp.data
      }

      const postsResp = await api.getPostsByUserId(userId)
      if (postsResp.code === 0) {
        posts.value = postsResp.data
      }
      console.log("userProfile: ", userProfile.value)
      console.log("posts: ", posts.value)
    })
    return {
      userProfile,
      posts
    }
  },
  computed: {
    userId() {
      return this.$store.getters['user/userId'];
    },
    userInfo() {
      return this.$store.getters['user/userInfo'];
    }
  },
  async mounted() {
    // 1. 拉用户信息
    // const u = this.userInfo
    // this.user = u;
    // // 2. 拉帖子列表
    // await this.fetchPosts();
  },
  methods: {
    async addPost(post) {
      // 1) 可先 POST 到后端持久化
      const res = await api.createPost(this.userId, { "user_Id": this.userId, ...post });
      // 后端返回的真正对象
      const newPost = res.data.post;
      console.log("newPost: ", newPost)
      // 2) 把它 unshift 到父组件的 posts
      // console.log(res)
      this.posts.unshift(newPost);
      this.$toast?.success('Post created!');
    },
    handlePostDeleted(deletedPostId) {
      // 过滤掉被删除的帖子
      this.posts = this.posts.filter(post => post.post_id !== deletedPostId)
    }
  }
};
</script>

<style scoped>
.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
