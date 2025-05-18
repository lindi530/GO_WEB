import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PostsView from '../views/PostsView.vue'
import UsersView from '../views/UsersView.vue'


const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/posts',
    name: 'posts',
    component: PostsView
  },
  {
    path: '/users',
    name: 'users',
    component: UsersView
  }, 
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
