import { createWebHistory, createRouter } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import TarotView from '@/views/tarot/TarotView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/login', component: LoginView },
  { path: '/register', component: RegisterView},
  { path: '/tarot', component: TarotView }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
