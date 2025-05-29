import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import { router } from './router/router';
import 'element-plus/dist/index.css';
import 'uno.css';
// import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue';

// 路由守卫
router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem('token'); // 或使用你的登录状态逻辑

  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title as string;
  }

  // 禁止已登录访问 login/register
  // if (to.meta.guestOnly && isLoggedIn) {
  //   next({ path: '/' });
  //   return;
  // }

  // 需要登录的页面
  // if (to.meta.requiresAuth && !isLoggedIn) {
  //   next({ path: '/login' });
  //   return;
  // }

  next();
});

const app = createApp(App);
const pinia = createPinia();

app.use(ElementPlus);
app.use(pinia);
app.use(router);
app.mount('#app');
