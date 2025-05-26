<template>
  <div class="container my-4">
    <UserList/>
  </div>
</template>

<script>
// import UserFeed from './UserFeed.vue'
import UserList from '../components/UserList.vue'

export default {
  components: { UserList },
  name: "Test",

}
</script>