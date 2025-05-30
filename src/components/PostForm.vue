<template>
  <div class="p-6 max-w-4xl mx-auto">
    <el-button type="primary" link class="mb-4" @click="$router.go(-1)">
      <i class="el-icon-back"></i>
      ← 返回
    </el-button>
    <h1 class="text-2xl font-bold mb-4">{{ isEdit ? '编辑' : '发布' }}</h1>

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

      <el-form-item label="是否允许评论" prop="allowComment" v-if="false">
        <el-radio-group v-model="form.allowComment">
          <el-radio :value="true">允许</el-radio>
          <el-radio :value="false">不允许</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="可见性" prop="visibility" v-if="false">
        <el-radio-group v-model="form.visibility">
          <el-radio :value="0">公开</el-radio>
          <el-radio :value="1">私密</el-radio>
          <el-radio :value="2">仅粉丝</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-button type="primary" @click="submitPost">
        {{ isEdit ? '保存修改' : '发表' }}
      </el-button>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, toRaw, watchEffect, onMounted } from 'vue';
import type { FormInstance, FormRules, UploadFile } from 'element-plus';
import { ElMessage } from 'element-plus';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { OssUploader } from '@/utils/ossUploader';

const props = defineProps<{
  postData?: any;
  onSubmit: (formData: any) => Promise<void>;
}>();

const isEdit = !!props.postData?.id;
const formRef = ref<FormInstance>();
const CoverFile = ref<File | null>(null);
const CoverUrl = ref<string>('');

const form = reactive({
  userId: localStorage.getItem('id'),
  title: '',
  content: '',
  coverImage: '' as string | null,
  summary: '',
  status: 1,
  allowComment: true,
  visibility: 0
});

onMounted(() => {
  if (props.postData) {
    Object.assign(form, props.postData);
    CoverUrl.value = props.postData.coverImage || '';
  }
});

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

  const uploadPromises = Array.from(images).map(async img => {
    const src = img.getAttribute('src');
    if (!src || (!src.startsWith('data:image') && !src.startsWith('blob:'))) return;
    try {
      const loadingMsg = ElMessage.info({ message: '图片上传中...', duration: 0 });
      const response = await fetch(src);
      const blob = await response.blob();
      const fileName = `post_image_${Date.now()}.${blob.type.split('/')[1]}`;
      const file = new File([blob], fileName, { type: blob.type });
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

const submitPost = async () => {
  await formRef.value?.validate(async valid => {
    if (!valid) return;

    try {
      form.coverImage = CoverFile.value
        ? await OssUploader.upload(CoverFile.value, 'postCover')
        : form.coverImage;

      form.content = await extractAndUploadImages(form.content);
      form.summary = form.content.replace(/<[^>]+>/g, '').slice(0, 100) + '...';

      await props.onSubmit(toRaw(form));
    } catch (err) {
      ElMessage.error('提交失败');
      console.error(err);
    }
  });
};
</script>
