import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PostsView from '../views/PostsView.vue'
import UsersView from '../views/UsersProfileView.vue'
import NotFound from '@/components/NotFound.vue'
import UserList from '@/views/UserListView.vue'
import Test from '@/components/test/Test.vue'
import Chat from '@/components/chat/zbase.vue'
import UserProfile from '@/components/setting/UserProfile.vue'
import PostDetail from '@/components/post/PostDetail.vue'
import Problem from '@/views/ProblemListView.vue'
import ProblemDetail from '@/views/ProblemView.vue'

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
    path: '/users/chat',
    name: 'Chat',
    component: Chat,
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
    path: '/posts/:post_id',
    name: 'PostDetail',
    component: PostDetail,
  },
  {
    path: '/problems',
    name: 'Problem',
    component: Problem,
  },
  {
    path: '/problems/:problem_id',
    name: 'ProblemDetail',
    component: ProblemDetail,
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
  history: createWebHashHistory(),
  routes
})

export default router
