<template>
  <PostForm v-if="post" :postData="post" :onSubmit="handleUpdate" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axiosUtil from '@/utils/axios';
import { ElMessage } from 'element-plus';
import PostForm from '@/components/PostForm.vue';

const route = useRoute();
const router = useRouter();
const postId = route.params.id as string;
const post = ref<any>(null);

onMounted(async () => {
  const res = await axiosUtil.get(`/api/posts/${postId}`);
  post.value = res.data.data;
  document.title = '星星树洞⭐' + post.value.title + '(编辑)' || '星星树洞⭐编辑';
});

const handleUpdate = async (formData: any) => {
  await axiosUtil.put(`/api/posts/${postId}`, formData);
  ElMessage.success('修改成功');
  router.push(`/post/${postId}`);
};
</script>
