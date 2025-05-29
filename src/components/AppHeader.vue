<template>
  <header class="w-auto h-16 bg-white shadow px-6 flex items-center justify-between">
    <!-- 导航 -->
    <nav class="flex items-center space-x-6">
      <RouterLink to="/" class="font-semibold hover:text-blue-600">主页</RouterLink>
      <RouterLink to="/post/create" class="font-semibold hover:text-blue-600">文章</RouterLink>
      <RouterLink to="/tarot" class="font-semibold hover:text-blue-600">塔罗</RouterLink>
    </nav>
    <!-- 搜索框） -->
    <div class="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-2">
      <el-input
        v-model="searchKeyword"
        @keyup.enter="enterSearch"
        class="w-64 max-w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
        placeholder="搜索"
      />
      <el-button :icon="Search" circle @click="searchPosts" />
    </div>

    <!-- 用户区域 -->
    <div
      class="flex items-center space-x-4 min-w-[200px] justify-end relative"
      @mouseleave="hideCard"
    >
      <el-button type="primary" plain v-if="!isLogged" @click="goToLogin">登陆</el-button>

      <div v-else class="relative" @mouseenter="showCard">
        <!-- 用户头像与昵称 -->
        <div class="flex items-center space-x-2 cursor-pointer">
          <img :src="profilePictureUrl" class="w-8 h-8 rounded-full object-cover" />
          <span class="whitespace-nowrap">{{ userInfo.nickname }}</span>
        </div>

        <!-- 用户资料卡 -->
        <div
          v-if="showProfile"
          class="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-md p-4 text-sm z-50"
          @mouseenter="cancelHide"
          @mouseleave="hideCard"
        >
          <div><strong>用户名：</strong>{{ userInfo.username }}</div>
          <div><strong>昵称：</strong>{{ userInfo.nickname }}</div>
          <div class="text-right mt-4">
            <el-button type="info" plain @click="logout">退出登录</el-button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { Search } from '@element-plus/icons-vue';

const router = useRouter();
const userInfo = useUserStore();

const profilePictureUrl = computed(() => userInfo.profilePictureUrl || '');

const isLogged = computed(() => !!userInfo.token);
const searchKeyword = ref('');

function enterSearch() {
  searchPosts();
}

function searchPosts() {
  router.push({ path: '/search', query: { q: searchKeyword.value } });
}

function goToLogin() {
  router.push('/login');
}

function logout() {
  userInfo.clearUser();
  router.push('/').then(() => {
    location.reload();
  });
}

const showProfile = ref(false);
let hideTimer: ReturnType<typeof setTimeout> | null = null;

function showCard() {
  if (hideTimer) clearTimeout(hideTimer);
  showProfile.value = true;
}

function hideCard() {
  hideTimer = setTimeout(() => {
    showProfile.value = false;
  }, 200);
}

function cancelHide() {
  if (hideTimer) clearTimeout(hideTimer);
}
</script>

<style scoped>
.group-hover\:block {
  display: none;
}
.group:hover .group-hover\:block {
  display: block;
}
</style>
