<template>
  <div class="post-detail-container p-6 max-w-4xl mx-auto">
    <!-- 加载状态 -->
    <el-skeleton :loading="loading" animated>
      <template #template>
        <el-skeleton-item variant="h1" class="w-1/3 mb-4" />
        <el-skeleton-item variant="image" class="h-48 mb-6" />
        <div class="space-y-2">
          <el-skeleton-item variant="p" class="w-full" />
          <el-skeleton-item variant="p" class="w-2/3" />
        </div>
      </template>

      <!-- 正常内容 -->
      <template #default>
        <!-- 返回按钮 -->
        <el-button type="primary" link class="mb-4" @click="$router.go(-1)">
          <i class="el-icon-back"></i>
          返回列表
        </el-button>

        <!-- 文章标题 -->
        <h1 class="text-3xl font-bold mb-6">{{ post.title }}</h1>

        <!-- 元信息 -->
        <div class="meta-info flex items-center text-gray-500 text-sm mb-6">
          <span class="mr-4">
            <i class="el-icon-user"></i>
            {{ post.user?.nickname || '匿名用户' }}
          </span>
          <span class="mr-4">
            <i class="el-icon-time"></i>
            发布于:
            {{ formatDate(post.createdTime) }}
          </span>
          <span class="mr-4">
            <i class="el-icon-time"></i>
            修改于:
            {{ formatDate(post.updatedTime) }}
          </span>
          <span>
            <i class="el-icon-view"></i>
            浏览量:
            {{ post.viewCount || 0 }}
          </span>
        </div>

        <!-- 封面图 -->
        <div v-if="post.coverImage" class="cover-image mb-8">
          <el-image :src="post.coverImage" fit="cover" class="w-full h-full rounded-lg shadow-lg">
            <template #error>
              <div class="image-error flex items-center justify-center h-full">
                <i class="el-icon-picture-outline text-4xl text-gray-300"></i>
              </div>
            </template>
          </el-image>
        </div>

        <!-- 正文内容 -->
        <div class="content-wrapper border-t pt-6 relative overflow-hidden">
          <div class="quill-content" v-html="post.content"></div>
        </div>

        <!-- 操作按钮 -->
        <div class="action-buttons mt-8 flex gap-4">
          <el-button type="primary" v-if="isAuthor" @click="$router.push(`/post/${postId}/edit`)">
            编辑文章
          </el-button>
          <el-button type="danger" v-if="isAuthor" @click="handleDelete"> 删除文章 </el-button>
        </div>
      </template>
    </el-skeleton>

    <!-- 错误提示 -->
    <el-empty v-if="error" description="文章加载失败" class="mt-12">
      <template #extra>
        <el-button @click="fetchPost">重试</el-button>
      </template>
    </el-empty>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import axiosUtil from '@/utils/axios';

interface Post {
  id: string;
  title: string;
  content: string;
  coverImage: string;
  userId: Number;
  user: {
    id: Number;
    nickname: string;
    profilePictureUrl: string;
  };
  createdTime: string;
  updatedTime: string;
  viewCount: number;
  allowComment: boolean;
  visibility: number;
}

const route = useRoute();
const router = useRouter();
const postId = route.params.id as string;
const loading = ref(true);
const error = ref(false);
const post = ref<Post>({} as Post);

// 获取当前登录用户ID
const currentUserId = localStorage.getItem('id');

// 判断当前用户是否是作者
const isAuthor = computed(() => {
  return post.value.user?.id === Number(currentUserId);
});

// 日期格式化
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  return new Date(dateString).toLocaleDateString('zh-CN', options);
};

// 获取文章详情
const fetchPost = async () => {
  try {
    loading.value = true;
    error.value = false;
    const { data } = await axiosUtil.get(`/api/posts/${postId}`);
    post.value = data.data;
    document.title = '星星树洞⭐' + post.value.title || '星星树洞⭐详情';
  } catch (err) {
    error.value = true;
    ElMessage.error('获取文章详情失败');
  } finally {
    loading.value = false;
  }
};

// 删除文章
const handleDelete = async () => {
  try {
    await ElMessageBox.confirm('确定要删除这篇文章吗？', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });

    await axiosUtil.delete(`/api/posts/${postId}`);
    ElMessage.success('删除成功');
    router.push('/');
  } catch (err) {
    // 用户取消删除时不处理
  }
};

// 初始化加载
onMounted(() => {
  fetchPost();
});
</script>

<style scoped>
.post-detail-container {
  min-height: calc(100vh - 128px);
}

.quill-content {
  @apply prose max-w-none;
}

.quill-content :deep(img) {
  @apply block max-w-full h-auto max-h-[500px] my-4 mx-auto rounded-lg shadow-md;
  object-fit: contain;
  width: auto !important;
  height: auto !important;
  max-width: 100% !important;
  max-height: 500px !important;
}

.quill-content :deep(pre) {
  @apply p-4 bg-gray-800 text-gray-100 rounded-lg overflow-x-auto;
}

.quill-content :deep(blockquote) {
  @apply border-l-4 border-gray-300 pl-4 text-gray-600 italic;
}

.image-error {
  background: #f5f7fa;
}
</style>
