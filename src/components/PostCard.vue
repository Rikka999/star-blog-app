<template>
  <div
    class="rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition"
  >
    <div class="flex items-center gap-2 mb-2">
      <img :src="post.user.profilePictureUrl" alt="头像" class="w-6 h-6 rounded-full" />
      <span class="text-sm text-gray-800">{{ post.user.nickname }}</span>
    </div>
    <img
      v-if="post.coverImage"
      :src="post.coverImage"
      class="w-full h-40 object-cover"
      alt="封面图"
    />
    <div class="p-4">
      <h2 class="text-xl font-bold mb-2 line-clamp-2">{{ post.title }}</h2>
      <p class="text-gray-600 text-sm mb-3 line-clamp-3">{{ post.summary }}</p>

      <div class="flex justify-between text-xs text-gray-500">
        <span>浏览： {{ post.viewCount }}</span>
        <span>点赞： {{ post.likeCount }}</span>
        <span>评论： {{ post.commentCount }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Post } from '@/types/post';
defineProps<{ post: Post }>();
</script>
