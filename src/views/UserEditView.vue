<template>
  <div class="max-w-2xl mx-auto p-6">
    <el-card>
      <template #header>
        <div class="text-lg font-bold">编辑个人资料</div>
      </template>

      <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="头像">
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            :auto-upload="false"
            accept="image/*"
            :on-change="handleAvatarSelect"
          >
            <img
              v-if="avatarPreview"
              :src="avatarPreview"
              class="w-20 h-20 rounded-full object-cover"
            />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>

        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请输入昵称" />
        </el-form-item>

        <el-form-item label="简介" prop="slogan">
          <el-input
            v-model="form.slogan"
            placeholder="介绍一下你自己吧~"
            maxlength="36"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="form.sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
            <el-radio :label="3">其他</el-radio>
            <el-radio :label="4">保密</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="邮箱" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submit">保存</el-button>
          <el-button @click="router.back()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from '@/utils/axios';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { OssUploader } from '@/utils/ossUploader';

const router = useRouter();
const route = useRoute();
const userId = route.params.id;

const formRef = ref<FormInstance>();
const avatarFile = ref<File | null>(null);
const avatarPreview = ref<string>('');

const form = reactive({
  profilePictureUrl: '',
  nickname: '',
  slogan: '',
  sex: 4,
  email: ''
});

const rules: FormRules = {
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 1, max: 12, message: '昵称长度应为1~12个字符', trigger: 'blur' },
    {
      pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9_]+$/,
      message: '昵称只能包含中文、字母、数字或下划线',
      trigger: 'blur'
    }
  ],
  slogan: [{ max: 36, message: '简介最多36个字符', trigger: 'blur' }],
  email: [{ type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }]
};

// 获取用户信息
onMounted(async () => {
  try {
    const res = await axios.get(`/api/users/${userId}`);
    if (res.data.code === 200) {
      Object.assign(form, res.data.data);
      avatarPreview.value = form.profilePictureUrl;
    }
  } catch (err) {
    ElMessage.error('获取用户信息失败');
  }
});

const handleAvatarSelect = (uploadFile: any) => {
  const file = uploadFile.raw;
  if (file) {
    avatarFile.value = file;
    avatarPreview.value = URL.createObjectURL(file);
  }
  return false;
};

const submit = async () => {
  await formRef.value?.validate();

  try {
    if (avatarFile.value) {
      form.profilePictureUrl = await OssUploader.upload(avatarFile.value, 'profilePicture');
    }

    const res = await axios.put(`/api/users/${userId}`, form);
    if (res.data.code === 200) {
      ElMessage.success('资料更新成功');
      localStorage.setItem('nickname', res.data.data.nickname);
      localStorage.setItem('profilePictureUrl', res.data.data.profilePictureUrl);
      localStorage.setItem('slogan', res.data.data.slogan);
      router.push(`/user/${userId}`).then(() => {
        window.location.reload();
      });
    }
  } catch (err) {
    ElMessage.error('保存失败');
  }
};
</script>

<style scoped>
.avatar-uploader {
  display: inline-block;
  cursor: pointer;
}
.avatar-uploader-icon {
  font-size: 32px;
  color: #ccc;
  width: 80px;
  height: 80px;
  border: 1px dashed #d9d9d9;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}
</style>
