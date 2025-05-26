import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PostsView from '../views/PostsView.vue'
import UsersView from '../views/UsersView.vue'
import NotFound from '@/components/NotFound.vue'
import UserList from '@/views/UserList.vue'
import Test from '@/components/test/Test.vue'
import UserProfile from '@/components/setting/UserProfile.vue'


const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/posts',
    name: 'Posts',
    component: PostsView
  },
  {
    path: '/users/userList',
    name: 'UserList',
    component: UserList
  },
  {
    path: '/users/:userId',
    name: 'UserInfo',
    component: UsersView
  },
  {
    path: '/user/profile',
    name: 'UserProfile',
    component: UserProfile
  },
  {
    path: '/test',
    name: 'test',
    component: Test
  },
  {
    path: '/404',
    name: '404',
    component: NotFound
  },
  { path: '/:pathMatch(.*)*', redirect: '/404' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
