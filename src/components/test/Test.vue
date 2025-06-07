<template>
  <div class="container my-4">
    <UserChat/>
  </div>
</template>

<script>
import UserFeed from './UserFeed.vue'
import UserChat from './UserChat.vue';

export default {
  components: { UserChat },
  name: "Test",

}
</script>