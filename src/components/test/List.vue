<template>
  <n-space vertical class="container content-box">
    <n-card title="用户列表" size="medium">
        <input
        v-model="searchQuery"
        type="text"
        class="form-control mb-3"
        placeholder="搜同学姓名、昵称"
      />
      <ul class="list-group">
        <li
            v-for="(user, index) in filteredUsers"
            :key="user.id"
            :class="[
                'list-group-item d-flex justify-content-between align-items-center',
                index % 2 === 1 ? 'color-odd' : 'color-even'
            ]"
            >
        
            <router-link
                :to="`/users/${user.id}`"
                class="d-flex align-items-center text-decoration-none text-dark"
                >
                <img :src="user.avatar" class="rounded-circle me-3" alt="avatar" width="48" height="48" />
                <div class="d-flex align-items-center">
                    <div class="fw-bold text-primary me-2">{{ user.name }}</div>
                    <div class="d-flex align-items-center">
                    <i
                        :class="[
                        'bi',
                        user.gender === 'male' ? 'bi-person-fill text-primary' : 'bi-person-fill text-danger'
                        ]"
                    ></i>
                    </div>
                </div>
                </router-link>

          
          <div
            :class="user.online ? 'text-success' : 'text-muted'"
            class="d-flex align-items-center"
          >
            {{ user.online ? '在线' : '离线' }}
            <i
              :class="user.online ? 'bi bi-check-circle-fill' : 'bi bi-x-circle'"
              class="ms-1"
            ></i>
          </div>
        </li>
      </ul>

    </n-card>
  </n-space>
</template>





<script>
export default {
  name: 'List',
  data() {
    return {
      searchQuery: '', 
      users: [
        {
          id: 1969930454962176,
          name: '刘浩林',
          gender: 'male',
          avatar: 'https://i.pravatar.cc/48?img=12',
          online: true
        },
        {
          id: 2,
          name: '郭雨',
          gender: 'female',
          avatar: 'https://i.pravatar.cc/48?img=65',
          online: true
        }
      ]
    }
  },
  computed: {
    filteredUsers() {
      const q = this.searchQuery.toLowerCase()
      return this.users.filter(user =>
        user.name.toLowerCase().includes(q)
      )
    }
  }
}
</script>

<style>
.page-wrapper {
  display: flex;
  justify-content: center;
  padding: 2rem;
}

.content-box {
  width: 100%;
  max-width: 900px; /* 原来是 700px，现在调宽一点 */
}
.color-odd {
  background-color: #d4f2e7;
}
.color-even {
    background-color: #d3e0f3;
}

.bi {
  font-size: 1.2rem;
}
</style>
