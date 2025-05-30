<template>
  <div class="post-detail-container p-6 max-w-4xl mx-auto space-y-12">
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

      <template #default>
        <!-- 返回按钮 -->
        <el-button type="primary" link class="mb-4" @click="$router.go(-1)">
          <i class="el-icon-back"></i>
          ← 返回
        </el-button>

        <!-- 文章标题 -->
        <h1 class="text-3xl font-bold mb-6">{{ post.title }}</h1>

        <!-- 信息 -->
        <div class="meta-info flex items-center text-gray-500 text-sm mb-6 flex-wrap gap-2">
          <span class="mr-4">
            <i class="el-icon-user"></i>
            {{ post.user?.nickname || '匿名用户' }}
          </span>
          <span class="mr-4">
            <i class="el-icon-time"></i>
            发布于: {{ formatDate(post.createdTime) }}
          </span>
          <span class="mr-4">
            <i class="el-icon-time"></i>
            修改于: {{ formatDate(post.updatedTime) }}
          </span>
          <span>
            <i class="el-icon-view"></i>
            浏览量: {{ post.viewCount || 0 }}
          </span>

          <el-button
            v-if="isAuthor"
            type="primary"
            link
            class="mr-4"
            @click="$router.push(`/post/${postId}/edit`)"
          >
            <i class="el-icon-edit"></i>
            编辑文章
          </el-button>
          <el-button v-if="isAuthor" type="primary" link class="mr-4" @click="handleDelete">
            <i class="el-icon-delete"></i>
            删除文章
          </el-button>
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

        <!-- 分割线 -->
        <hr class="my-6 border-t border-gray-200" />

        <!-- 评论组件 -->
        <CommentSection :postId="postId" />
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
import CommentSection from '@/components/CommentSection.vue';

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

// 当前登录用户 ID
const currentUserId = localStorage.getItem('id');
const isAuthor = computed(() => post.value.user?.id === Number(currentUserId));

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('zh-CN', options);
};

const fetchPost = async () => {
  try {
    loading.value = true;
    error.value = false;
    const { data } = await axiosUtil.get(`/api/posts/${postId}`);
    post.value = data.data;
    document.title = '星星树洞⭐' + post.value.title || '星星树洞⭐详情';
  } catch (err) {
    error.value = true;
    ElMessage.error({ message: '获取文章详情失败', duration: 2000 });
  } finally {
    loading.value = false;
  }
};

const handleDelete = async () => {
  try {
    await ElMessageBox.confirm('确定要删除这篇文章吗？', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });

    await axiosUtil.delete(`/api/posts/${postId}`);
    ElMessage.success({ message: '删除成功', duration: 2000 });
    router.push('/');
  } catch (err) {
    // 取消不做处理
  }
};

onMounted(() => {
  fetchPost();
});
</script>

<style scoped>
.quill-content {
  max-width: none;
}

/* 图片样式 */
.quill-content :deep(img) {
  display: block;
  max-width: 100%;
  height: auto;
  max-height: 500px;
  margin: 1rem auto;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  object-fit: contain;
}

/* 代码块 */
.quill-content :deep(pre) {
  padding: 1rem;
  background-color: #1f2937;
  color: #f3f4f6;
  border-radius: 0.5rem;
  overflow-x: auto;
}

/* 引用块 */
.quill-content :deep(blockquote) {
  border-left: 4px solid #d1d5db;
  padding-left: 1rem;
  color: #4b5563;
  font-style: italic;
}

.image-error {
  background: #f5f7fa;
}
</style>
