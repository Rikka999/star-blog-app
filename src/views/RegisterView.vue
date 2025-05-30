<template>
  <div class="register-container">
    <el-card class="register-card">
      <h2 class="register-title">🌟 注册账号</h2>
      <p class="register-subtitle"></p>

      <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
        <!-- 上传头像 -->
        <el-form-item>
          <el-upload
            class="profilePicture-uploader"
            :show-file-list="false"
            :auto-upload="false"
            accept="image/*"
            @change="handleprofilePictureSelect"
          >
            <img v-if="profilePictureUrl" :src="profilePictureUrl" class="profilePicture" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>

        <!-- 用户名 -->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>

        <!-- 密码 -->
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>

        <!-- 确认密码 -->
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="form.confirmPassword"
            type="password"
            placeholder="请确认密码"
            show-password
          />
        </el-form-item>

        <!-- 昵称 -->
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请输入昵称" />
        </el-form-item>

        <!-- 性别 -->
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="form.sex">
            <el-radio value="1">男</el-radio>
            <el-radio value="2">女</el-radio>
            <el-radio value="3">其他</el-radio>
            <el-radio value="4">保密</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 邮箱 -->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="w-full" @click="onRegister">注册</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import type { UploadFile } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import axiosUtil from '@/utils/axios';
import type { FormInstance, FormRules } from 'element-plus';
import { useRouter } from 'vue-router';
import { OssUploader } from '@/utils/ossUploader';

const router = useRouter();
const formRef = ref<FormInstance>();
const DEFAULT_AVATAR =
  'https://star-blog-assets.oss-cn-shenzhen.aliyuncs.com/profile_picture/default_profile_picture.jpg';

const form = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  nickname: '',
  sex: '4',
  email: '',
  phoneNumber: '',
  profilePicture: ''
});

const profilePictureFile = ref<File | null>(null);
const profilePictureUrl = ref<string>('');

// 处理头像选择
const handleprofilePictureSelect = (uploadFile: UploadFile) => {
  const file = uploadFile?.raw;
  if (file) {
    profilePictureFile.value = file;
    profilePictureUrl.value = URL.createObjectURL(file);
  }
  return false;
};

// 表单规则
const rules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 6, max: 12, message: '用户名长度应为 6 到 12 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 24, message: '密码长度应为 6 到 24 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (value !== form.password) {
          callback(new Error('两次密码不一致'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ],
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 1, max: 12, message: '昵称长度应为 1 到 12 个字符', trigger: 'blur' }
  ],
  email: [{ type: 'email', message: '邮箱地址不正确', trigger: ['blur', 'change'] }]
};

// 注册
const onRegister = async () => {
  await formRef.value?.validate(async valid => {
    if (!valid) return;

    try {
      // 先上传头像，没有就使用默认
      form.profilePicture = profilePictureFile.value
        ? await OssUploader.upload(profilePictureFile.value, 'profilePicture')
        : DEFAULT_AVATAR;
      // 发起注册请求
      const payload = {
        username: form.username,
        password: form.password,
        nickname: form.nickname,
        sex: form.sex,
        email: form.email || null,
        phoneNumber: form.phoneNumber || null,
        profilePictureUrl: form.profilePicture || null
      };
      const res = await axiosUtil.post('/api/auth/register', payload, {
        headers: { noAuth: true }
      });

      if (res.data.code === 200) {
        ElMessage.success('注册成功，正在跳转到登录页...');
        setTimeout(() => router.push('/login'), 2000);
      } else {
        ElMessage.error(res.data.message || '注册失败');
      }
    } catch (err) {
      console.error('获取 OSS 上传 token 出错：', err);
      ElMessage.error('注册请求出错');
    }
  });
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(to right, #e0f7fa, #ffffff);
}
.register-card {
  width: 400px;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.register-title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
}
.register-subtitle {
  text-align: center;
  color: #888;
  margin-bottom: 24px;
}
.profilePicture-uploader {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 96px;
  height: 96px;
  border: 1px dashed #ccc;
  border-radius: 50%;
  cursor: pointer;
  overflow: hidden;
  margin: 0 auto;
}
.profilePicture {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
