import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import { router } from './router/router';
import 'element-plus/dist/index.css';
import 'uno.css';
// import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue';

router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem('token');

  if (to.meta.title) {
    document.title = to.meta.title as string;
  }

  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login');
  } else if (to.meta.guestOnly && isLoggedIn) {
    next('/');
  } else {
    next();
  }
});

const app = createApp(App);
const pinia = createPinia();

app.use(ElementPlus);
app.use(pinia);
app.use(router);
app.mount('#app');
