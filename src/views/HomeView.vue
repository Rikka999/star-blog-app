<template>
  <div class="p-4">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <PostCard v-for="post in posts" :key="post.id" :post="post" />
    </div>

    <div v-if="totalElements > pageSize" class="mt-6 flex justify-center">
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="pageSize"
        :current-page="page + 1"
        :total="totalElements"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import PostCard from '@/components/PostCard.vue';
import { ref, onMounted } from 'vue';
import axios from '@/utils/axios';
import type { Post } from '@/types/post';

const posts = ref<Post[]>([]);
const page = ref(0); // Spring 默认从 0 开始
const pageSize = 1;
const totalElements = ref(0);

const fetchPosts = async () => {
  try {
    const { data } = await axios.get('/api/posts/', {
      params: { page: page.value, pageSize }
    });

    if (data.code === 200) {
      posts.value = data.data.content;
      totalElements.value = data.data.totalElements;
      console.log('posts', posts.value[0].user.id);
    }
  } catch (err) {
    console.error('获取帖子失败:', err);
  }
};

const handlePageChange = (newPage: number) => {
  page.value = newPage - 1; // Element Plus 的页码从 1 开始，Spring 从 0 开始
  fetchPosts();
};

onMounted(fetchPosts);
</script>
