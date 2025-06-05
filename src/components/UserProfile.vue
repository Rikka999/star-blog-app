<template>
  <div class="p-4 max-w-5xl mx-auto">
    <!-- 用户信息卡片 -->
    <el-card class="mb-4">
      <div class="flex items-center">
        <el-avatar :src="user.profilePictureUrl" size="large" class="mr-4" />
        <div>
          <h2 class="text-xl font-bold">{{ user.nickname }}</h2>
          <p class="text-gray-500">{{ user.slogan || '这个人很神秘，没有留下简介。' }}</p>
          <div class="flex gap-4 text-sm text-gray-600 mt-2">
            <span>性别：{{ getSexLabel(user.sex) }}</span>
            <span>邮箱：{{ user.email || '未公开' }}</span>
            <el-button
              v-if="isCurrentUser"
              type="primary"
              link
              class="mr-4"
              @click="$router.push(`/user/${userId}/edit`)"
            >
              <i class="el-icon-edit"></i>
              编辑信息
            </el-button>
            <el-button
              v-if="isCurrentUser"
              type="primary"
              link
              class="mr-4"
              @click="$router.push(`/user/${userId}/edit/change-password`)"
            >
              <i class="el-icon-edit"></i>
              修改密码
            </el-button>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 博客列表分页 -->
    <el-card>
      <template #header>
        <span class="font-bold">{{ isCurrentUser ? '我的帖子' : 'Ta的帖子' }}</span>
      </template>

      <PostList :api="`/api/users/${userId}/posts`" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import axios from '@/utils/axios';
import PostList from '@/components/PostList.vue';

const getSexLabel = (sex: number) => {
  return (
    {
      1: '男',
      2: '女',
      3: '其他',
      4: '保密'
    }[sex] || '未知'
  );
};

interface User {
  id: number;
  nickname: string;
  profilePictureUrl: string;
  homepagePictureUrl: string;
  slogan: string;
  maskedPhoneNumber: string;
  sex: number;
  email: string;
}

const route = useRoute();
const userId = route.params.id as string;
const currentUserId = localStorage.getItem('id');
const isCurrentUser = computed(() => userId === currentUserId);
const user = ref<User>({
  id: 0,
  nickname: '',
  profilePictureUrl: '',
  homepagePictureUrl: '',
  slogan: '',
  email: '',
  maskedPhoneNumber: '',
  sex: 4
});

onMounted(async () => {
  try {
    const userRes = await axios.get(`/api/users/${userId}`);
    user.value = userRes.data.data;
  } catch (error) {
    console.error('获取用户信息失败:', error);
  }
});
</script>
