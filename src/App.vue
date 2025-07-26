<template>
    <n-message-provider>
      <NavBar/>
      <router-view/>
    </n-message-provider>
</template>

<script>
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import 'highlight.js/styles/github.css'
import NavBar from "./components/NavBar";


export default {
  name: "App",
  components: {
    NavBar
  }
}
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden; /* 禁止 body 自身滚动 */
}
</style>
