<template>
  <PostList api="/api/posts/search" :queryParams="{ keyword: route.query.q }" />
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import PostList from '@/components/PostList.vue';

const route = useRoute();
document.title = '星星树洞⭐ "' + route.query.q + '" 搜索结果';
</script>
