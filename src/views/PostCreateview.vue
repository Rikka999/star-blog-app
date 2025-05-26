<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">发表新帖子</h1>

    <el-form :model="form" :rules="rules" ref="formRef" label-position="top" class="space-y-4">
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title" placeholder="请输入标题" />
      </el-form-item>

      <el-form-item label="封面图" prop="coverImage">
        <el-upload
          fit="contain"
          class="max-h-[400px] w-full object-contain rounded-lg shadow-lg"
          :show-file-list="false"
          :auto-upload="false"
          accept="image/*"
          style="max-width: 100%; height: auto; object-fit: cover"
          @change="handleCoverSelect"
        >
          <img v-if="CoverUrl" :src="CoverUrl" class="w-full h-48 object-cover rounded" />
          <div
            v-else
            class="w-full h-48 flex items-center justify-center border border-dashed border-gray-300 rounded cursor-pointer"
          >
            <span class="text-gray-500">点击上传封面图</span>
          </div>
        </el-upload>
      </el-form-item>

      <el-form-item label="正文内容" prop="content">
        <QuillEditor
          v-model:content="form.content"
          content-type="html"
          toolbar="full"
          class="w-full"
          style="height: 50vh; min-height: 300px"
        />
      </el-form-item>

      <el-form-item label="是否允许评论" prop="allowComment">
        <el-radio-group v-model="form.allowComment">
          <el-radio value="true">允许</el-radio>
          <el-radio value="false">不允许</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="可见性" prop="visibility">
        <el-radio-group v-model="form.visibility">
          <el-radio value="0">公开</el-radio>
          <el-radio value="1">私密</el-radio>
          <el-radio value="2">仅粉丝</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-button type="primary" @click="submitPost">发表</el-button>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, toRaw } from 'vue';
import { ElMessage } from 'element-plus';
import axiosUtil from '@/utils/axios';
import type { UploadFile, FormInstance, FormRules } from 'element-plus';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { OssUploader } from '@/utils/ossUploader';
import { watchEffect } from 'vue';

watchEffect(onCleanup => {
  const editorContainer = document.querySelector('.ql-container .ql-editor');
  if (!editorContainer) return;

  const observer = new MutationObserver(mutations => {
    // 处理编辑器内容变动
  });

  observer.observe(editorContainer, {
    childList: true,
    subtree: true,
    characterData: true
  });

  onCleanup(() => observer.disconnect());
});

const CoverFile = ref<File | null>(null);
const CoverUrl = ref<string>('');
const formRef = ref<FormInstance>();
const form = reactive({
  userId: localStorage.getItem('id'),
  title: '',
  content: '',
  coverImage: '' as string | null,
  summary: '',
  status: 1,
  allowComment: true,
  visibility: ''
});

// 表单规则
const rules: FormRules = {
  title: [
    { required: true, message: '必须输入标题', trigger: 'blur' },
    { min: 1, max: 30, message: '标题长度应为 1 到 30 个字符', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '必须输入正文', trigger: 'blur' },
    { min: 1, message: '正文至少有 1 个字符', trigger: 'blur' }
  ]
};

// 添加封面
const handleCoverSelect = (uploadFile: UploadFile) => {
  const file = uploadFile?.raw;
  if (file) {
    CoverFile.value = file;
    CoverUrl.value = URL.createObjectURL(file);
  }
  return false;
};

const extractAndUploadImages = async (html: string): Promise<string> => {
  const container = document.createElement('div');
  container.innerHTML = html;
  const images = container.querySelectorAll('img');

  // 并行上传所有本地图片
  const uploadPromises = Array.from(images).map(async img => {
    const src = img.getAttribute('src');

    // 只处理base64和blob类型的图片
    if (!src || (!src.startsWith('data:image') && !src.startsWith('blob:'))) return;
    try {
      const loadingMsg = ElMessage.info({ message: '图片上传中...', duration: 0 });

      // 转换blob为File对象
      const response = await fetch(src);
      const blob = await response.blob();
      const fileName = `post_image_${Date.now()}.${blob.type.split('/')[1]}`;
      const file = new File([blob], fileName, { type: blob.type });

      // 上传到OSS
      const ossUrl = await OssUploader.upload(file, 'postImage');
      img.setAttribute('src', ossUrl);

      loadingMsg.close();
    } catch (err) {
      ElMessage.error('图片上传失败');
      throw err;
    }
  });

  await Promise.all(uploadPromises);
  return container.innerHTML;
};

// 提交表单
const submitPost = async () => {
  await formRef.value?.validate(async valid => {
    if (!valid) return;

    try {
      // 1. 上传封面图
      form.coverImage = CoverFile.value
        ? await OssUploader.upload(CoverFile.value, 'postCover')
        : null;

      // 2. 上传并替换正文图片
      form.content = await extractAndUploadImages(form.content);

      // 3. 生成摘要（使用处理后的内容）
      form.summary = form.content.replace(/<[^>]+>/g, '').slice(0, 100) + '...';

      // 4. 提交数据
      console.log('最终提交数据:', toRaw(form));
      await axiosUtil.post('/api/posts', form);
      ElMessage.success('发布成功');
    } catch (err) {
      console.error('发布失败:', err);
      ElMessage.error('发布失败：图片上传异常');
    }
  });
};
</script>
