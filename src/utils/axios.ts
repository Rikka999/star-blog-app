import axios from 'axios';
import { ElMessage } from 'element-plus';
import { userStore } from '@/stores/user';
import { router } from '@/router/router';

const instance = axios.create({
  baseURL: 'http://192.168.1.11:8080',
  timeout: 5000
});

const userInfo = userStore();

// 请求拦截器，添加 token
instance.interceptors.request.use(
  config => {
    if (!config.headers['noAuth']) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  response => response,
  error => {
    if (error.response.data?.status === 401) {
      ElMessage.warning('登录已过期，请重新登录');
      userInfo.clearUser();
      router.push('/').then(() => {
        location.reload();
      });
    } else {
      ElMessage.error(error.response?.data?.message || '请求失败');
    }
    return Promise.reject(error);
  }
);

export default instance;
