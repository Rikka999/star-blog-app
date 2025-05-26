import { createWebHistory, createRouter } from 'vue-router';

import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import TarotView from '@/views/tarot/TarotView.vue';
import PostCreateView from '@/views/PostCreateView.vue';
import PostDetailView from '@/views/PostDetailView.vue';

// 定义路由规则
const routes = [
  {
    path: '/',
    component: HomeView,
    meta: { title: '首页' }
  },
  {
    path: '/login',
    component: LoginView,
    meta: { title: '登录', guestOnly: true }
  },
  {
    path: '/register',
    component: RegisterView,
    meta: { title: '注册', guestOnly: true }
  },
  {
    path: '/tarot',
    component: TarotView,
    meta: { title: '塔罗', requiresAuth: true }
  },
  {
    path: '/post/create',
    component: PostCreateView,
    meta: { title: '发表', requiresAuth: true }
  },
  {
    path: '/post/:id',
    name: 'PostDetail',
    component: PostDetailView,
    meta: { title: '详情' },
    props: true
  }
];

export const router = createRouter({
  history: createWebHistory(),
  routes
});
