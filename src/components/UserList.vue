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
            v-for="(user, index) in users"
            :key="user.user_id"
            :class="[
                'list-group-item d-flex justify-content-between align-items-center',
                index % 2 === 1 ? 'color-odd' : 'color-even'
            ]"
            >
        
            <router-link
                :to="`/users/${user.user_id}`"
                class="d-flex align-items-center text-decoration-none text-dark"
                >
                <img :src="user.avatar" class="rounded-circle me-3" alt="avatar" width="48" height="48" />
                <div class="d-flex align-items-center">
                    <div class="fw-bold text-primary me-2">{{ user.user_name }}</div>
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
            :class="user.online_state ? 'text-success' : 'text-muted'"
            class="d-flex align-items-center"
          >
            {{ user.online_state ? '在线' : '离线' }}
            <i
              :class="user.online_state ? 'bi bi-check-circle-fill' : 'bi bi-x-circle'"
              class="ms-1"
            ></i>
          </div>
        </li>
      </ul>

    </n-card>
  </n-space>
</template>

<script>
import api from '@/api';
import { onMounted, ref } from 'vue';

export default {
  name: 'List',
  // data() { 
  //   return {
  //     users: [],
  //   }
  // },
  // async mounted() {
  //   const resp = await api.getUserList()
  //   if (resp.code == 0) {
  //       users.value = resp.data.userList
  //     }
  // },
  setup() {
    const users = ref([]);
    onMounted(async () => {
      const resp = await api.getUserList()
      console.log("resp: ", resp)
      if (resp.code == 0) {
        users.value = resp.data.userList
      }
    });
    return {
      users
    }
  },
  data() {
    return {
      searchQuery: '', 
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
