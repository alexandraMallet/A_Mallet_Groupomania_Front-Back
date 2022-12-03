import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import CreatePostView from '@/views/CreatePostView.vue'
import OnePostView from '@/views/OnePostView.vue'
import ModifyPostView from '@/views/ModifyPostView.vue'
import OneUserView from '@/views/OneUserView.vue'
import ModifyUserView from '@/views/ModifyUserView.vue'
import UsersView from '@/views/UsersView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/connexion',
    name: 'LoginView',
    component: LoginView
  },
  {
    path: '/utilisateurices',
    name: 'UsersView',
    component: UsersView
  },
  {
    path: '/publier',
    name: 'createPost',
    component: CreatePostView
  },
  {
    path: '/publications/:id',
    name: 'OnePostView',
    component: OnePostView
  },
  {
    path: '/modifier-publication/:id',
    name: 'ModifyPostView',
    component: ModifyPostView
  },
  {
    path: '/utilisateurice/:id',
    name: 'OneUserView',
    component: OneUserView
  },
  {
    path: '/modifier-compte/:id',
    name: 'ModifyUserView',
    component: ModifyUserView
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})


router.beforeEach(async (to, from) => {

  const loggedIn = localStorage.getItem('userLogged');
  if (!loggedIn && to.name !== 'LoginView')  {
    return { name: 'LoginView' }
  }
})



export default router
