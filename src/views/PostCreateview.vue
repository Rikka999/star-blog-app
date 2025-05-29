<template>
  <PostForm :onSubmit="handleCreate" />
</template>

<script setup lang="ts">
import PostForm from '@/components/PostForm.vue';
import { ElMessage } from 'element-plus';
import axiosUtil from '@/utils/axios';
import { useRouter } from 'vue-router';

const router = useRouter();

const handleCreate = async (formData: any) => {
  await axiosUtil.post('/api/posts', formData);
  ElMessage.success('发布成功');
  router.push('/');
};
</script>
