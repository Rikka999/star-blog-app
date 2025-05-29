import { createWebHistory, createRouter } from 'vue-router';

const routes = [
  {
    path: '/',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: '星星树洞⭐首页' }
  },
  {
    path: '/login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: '星星树洞⭐登录', guestOnly: true }
  },
  {
    path: '/register',
    component: () => import('@/views/RegisterView.vue'),
    meta: { title: '星星树洞⭐注册', guestOnly: true }
  },
  {
    path: '/tarot',
    component: () => import('@/views/tarot/TarotView.vue'),
    meta: { title: '星星树洞⭐塔罗', requiresAuth: true }
  },
  {
    path: '/post/create',
    component: () => import('@/views/PostCreateView.vue'),
    meta: { title: '星星树洞⭐发布', requiresAuth: true }
  },
  {
    path: '/post/:id',
    name: 'PostDetail',
    component: () => import('@/views/PostDetailView.vue'),
    meta: { title: '星星树洞⭐详情' },
    props: true
  },
  {
    path: '/post/:id/edit',
    name: 'PostEdit',
    component: () => import('@/views/PostEditView.vue'),
    meta: { title: '星星树洞⭐编辑', requiresAuth: true },
    props: true
  }
];

export const router = createRouter({
  history: createWebHistory(),
  routes
});
