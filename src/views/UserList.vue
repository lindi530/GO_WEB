<template>
  <div class="container mt-4">
    <h2 class="mb-4">用户列表</h2>

    <!-- 搜索框 -->
    <div class="row mb-3">
      <div class="col-12 text-end">
        <input 
          type="text" 
          v-model="searchQuery" 
          @input="fetchUsers" 
          placeholder="搜索用户..." 
          class="form-control w-25"
        />
      </div>
    </div>

    <!-- 用户卡片展示 -->
    <div class="row">
      <div 
        v-for="(user, index) in filteredUsers" 
        :key="user.id" 
        :class="['col-md-4', 'mb-4', index % 2 === 0 ? 'bg-light' : 'bg-secondary']"
      >
        <div class="card shadow-sm">
          <div class="card-body">
            <h5 class="card-title">{{ user.username }}</h5>
            <p class="card-text"><strong>邮箱：</strong>{{ user.email || '@qq.com' }}</p>
            <p class="card-text"><strong>创建时间：</strong>{{ user.update_time }}</p>
            <div class="d-flex justify-content-between">
              <button @click="editUser(user)" class="btn btn-warning btn-sm">编辑</button>
              <button @click="deleteUser(user.id)" class="btn btn-danger btn-sm">删除</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 加载中提示 -->
      <div v-if="loading" class="text-center col-12">
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> 加载中...
      </div>

      <!-- 错误提示 -->
      <div v-if="error" class="alert alert-danger mt-3 col-12" role="alert">
        加载失败，请稍后再试！
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api';

export default {
  data() {
    return {
      users: [],
      searchQuery: '',
      loading: false,
      error: false,
    };
  },
  computed: {
    filteredUsers() {
      if (!this.searchQuery) {
        return this.users;
      }
      return this.users.filter(user =>
        user.username.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  methods: {
    async fetchUsers() {
      this.loading = true;
      this.error = false;
      try {
        // 假设后端API是GET /api/users
        const response = await api.getUserList()
        
        this.users = response.data.userList;
        console.log("users: ", this.users)
      } catch (error) {
        this.error = true;
      } finally {
        this.loading = false;
      }
    },
    editUser(user) {
      // 这里你可以处理编辑用户的逻辑
      console.log('编辑用户', user);
    },
    deleteUser(userId) {
      // 这里你可以处理删除用户的逻辑
      console.log('删除用户', userId);
    }
  },
  mounted() {
    this.fetchUsers();
  }
};
</script>

<style scoped>
/* 自定义样式 */
.card {
  border-radius: 8px;
  overflow: hidden;
}

.card-title {
  font-size: 18px;
  font-weight: bold;
}

.card-text {
  font-size: 14px;
}

.card-body {
  padding: 15px;
}

.spinner-border {
  width: 2rem;
  height: 2rem;
}

.alert {
  margin-top: 20px;
}

.bg-light {
  background-color: #f8f9fa !important; /* 淡背景色 */
}

.bg-secondary {
  background-color: #e9ecef !important; /* 次背景色 */
}
</style>
