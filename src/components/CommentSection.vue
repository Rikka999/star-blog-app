<template>
  <div class="comment-section-container max-w-4xl mx-auto mt-16 px-4 border-t pt-6">
    <!-- 添加评论 -->
    <div class="mb-8" ref="commentBoxRef">
      <div v-if="replyToCommentId !== null" class="mb-2 text-sm text-gray-500">
        正在回复评论 # {{ replyToCommentNickname }}:{{ truncatedReplyContent }}
        <el-button size="small" type="warning" text @click="cancelReply">取消回复</el-button>
      </div>

      <el-input
        v-model="newComment"
        ref="commentInputRef"
        type="textarea"
        :rows="4"
        placeholder="说点什么吧..."
        class="comment-input mb-4"
      />
      <el-button type="primary" @click="submitComment" :loading="submitting">发表评论</el-button>
    </div>

    <!-- 评论列表 -->
    <div v-if="comments.length > 0" class="space-y-6">
      <div
        v-for="parent in comments"
        :key="parent.id"
        class="border border-gray-200 rounded-lg p-5 bg-white shadow-sm"
      >
        <!-- 父评论 -->
        <div class="flex items-center mb-3">
          <el-avatar :src="parent.profilePictureUrl" size="small" class="mr-3" />
          <span class="font-medium text-gray-800">{{ parent.nickname }}</span>
          <span class="text-gray-400 text-sm ml-auto">{{ formatDate(parent.createdTime) }}</span>
        </div>
        <div class="text-gray-700 leading-relaxed whitespace-pre-wrap mb-2">
          {{ parent.content }}
        </div>
        <el-button
          size="small"
          text
          type="primary"
          @click="replyTo(parent.id, parent.nickname, parent.profilePictureUrl, parent.content)"
          >回复</el-button
        >

        <!-- 子评论 -->
        <div
          v-if="parent.children && parent.children.length"
          class="mt-4 space-y-2 pl-6 border-l border-gray-100"
        >
          <div
            v-for="(child, index) in isExpanded(parent.id)
              ? parent.children
              : parent.children.slice(0, 5)"
            :key="child.id"
            class="text-sm text-gray-700"
          >
            <div class="flex items-center mb-1">
              <el-avatar :src="child.profilePictureUrl" size="small" class="mr-2" />
              <span class="text-gray-800 font-medium mr-1">{{ child.nickname }}</span>
              <span class="text-gray-500">回复</span>
              <span class="text-blue-600 font-medium ml-1">#{{ child.replyToNickname }}</span>
              <span class="text-gray-400 text-xs ml-auto">{{ formatDate(child.createdTime) }}</span>
            </div>
            <div class="ml-8 whitespace-pre-wrap">{{ child.content }}</div>
            <el-button
              size="small"
              text
              type="primary"
              class="ml-8"
              @click="replyTo(child.id, child.nickname, child.profilePictureUrl, child.content)"
              >回复</el-button
            >
          </div>

          <!-- 展开/收起按钮 -->
          <div v-if="parent.children.length > 5" class="ml-8 mt-2">
            <el-button size="small" text type="success" @click="toggleExpand(parent.id)">
              {{ isExpanded(parent.id) ? '收起' : `展开剩余 ${parent.children.length - 5} 条回复` }}
            </el-button>
          </div>
        </div>
      </div>

      <!-- 分页控件 -->
      <el-pagination
        class="mt-6 text-center"
        background
        layout="prev, pager, next"
        :current-page="page"
        :page-size="pageSize"
        :total="total"
        @current-change="handlePageChange"
      />
    </div>

    <el-empty v-else description="还没有评论哦～" class="mt-10" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import axiosUtil from '@/utils/axios';
import { userStore } from '@/stores/user';
import { nextTick } from 'vue';

interface Comment {
  id: number;
  userId: number;
  postId: number;
  parentId: number | null;
  content: string;
  nickname: string;
  profilePictureUrl: string;
  createdTime: string;
  replyToNickname?: string;
  children?: Comment[];
}

const userInfo = userStore();
const props = defineProps<{ postId: string | number }>();
const comments = ref<Comment[]>([]);
const total = ref(0);
const page = ref(1);
const pageSize = ref(5);
const commentInputRef = ref();

const newComment = ref('');
const submitting = ref(false);
const replyToCommentId = ref<number | null>(null);
const replyToCommentNickname = ref<string | null>(null);
const replyToCommentProfilePictureUrl = ref<string | null>(null);
const replyToCommentContent = ref<string | null>(null);
const currentUserId = userInfo.id;
const currentNickname = userInfo.nickname;
const currentProfilePictureUrl = userInfo.profilePictureUrl;

// 子评论展开状态
const expandedComments = reactive<Record<number, boolean>>({});

const isExpanded = (parentId: number) => {
  return !!expandedComments[parentId];
};

const toggleExpand = (parentId: number) => {
  expandedComments[parentId] = !expandedComments[parentId];
};

const truncatedReplyContent = computed(() => {
  const content = replyToCommentContent.value || '';
  return content.length > 20 ? content.slice(0, 20) + '...' : content;
});

const flattenReplies = (parent: Comment): Comment[] => {
  const result: Comment[] = [];

  const dfs = (node: Comment, parentMap: Map<number, Comment>) => {
    if (!node.children) return;

    for (const child of node.children) {
      const replyTo = parentMap.get(child.parentId!);
      child.replyToNickname = replyTo?.nickname || '';
      result.push({ ...child, children: undefined });
      parentMap.set(child.id, child);
      dfs(child, parentMap);
    }
  };

  const parentMap = new Map<number, Comment>();
  parentMap.set(parent.id, parent);
  dfs(parent, parentMap);

  return result;
};

const fetchComments = async () => {
  try {
    const { data } = await axiosUtil.get(`/api/posts/${props.postId}/comments`, {
      params: {
        page: page.value - 1,
        pageSize: pageSize.value
      }
    });

    const parentComments: Comment[] = data.data.content;

    for (const parent of parentComments) {
      parent.children = flattenReplies(parent);
    }

    comments.value = parentComments;
    total.value = data.data.totalElements;
  } catch (err) {
    ElMessage.error('获取评论失败');
  }
};

const submitComment = async () => {
  if (!newComment.value.trim()) {
    ElMessage.warning('评论内容不能为空');
    return;
  }

  submitting.value = true;
  try {
    await axiosUtil.post(`/api/posts/${props.postId}/comments`, {
      postId: props.postId,
      userId: currentUserId,
      content: newComment.value,
      parentId: replyToCommentId.value,
      nickname: currentNickname,
      profilePictureUrl: currentProfilePictureUrl
    });
    ElMessage.success({ message: '评论成功', duration: 2000 });
    newComment.value = '';
    cancelReply();
    page.value = 1;
    fetchComments();
  } catch (err) {
    ElMessage.error('评论失败');
  } finally {
    submitting.value = false;
  }
};

const replyTo = (
  commentId: number,
  nickname: string,
  profilePictureUrl: string,
  content: string
) => {
  replyToCommentId.value = commentId;
  replyToCommentNickname.value = nickname;
  replyToCommentProfilePictureUrl.value = profilePictureUrl;
  replyToCommentContent.value = content;

  nextTick(() => {
    commentInputRef.value?.focus?.();
  });
};

const cancelReply = () => {
  replyToCommentId.value = null;
  replyToCommentNickname.value = '';
  replyToCommentProfilePictureUrl.value = '';
  replyToCommentContent.value = '';
};

const handlePageChange = (newPage: number) => {
  page.value = newPage;
  fetchComments();
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('zh-CN');
};

onMounted(fetchComments);
</script>

<style scoped>
.comment-input :deep(textarea) {
  height: 120px !important;
  overflow-y: auto !important;
  resize: none !important;
}
</style>
