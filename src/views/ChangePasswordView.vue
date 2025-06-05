<template>
  <div class="max-w-2xl mx-auto p-6">
    <el-card>
      <template #header>
        <div class="text-lg font-bold">修改密码</div>
      </template>

      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input
            v-model="form.oldPassword"
            type="password"
            placeholder="请输入旧密码"
            show-password
          />
        </el-form-item>

        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="form.newPassword"
            type="password"
            placeholder="请输入新密码"
            show-password
          />
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="form.confirmPassword"
            type="password"
            placeholder="请再次输入新密码"
            show-password
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submit">修改</el-button>
          <el-button @click="router.back()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from '@/utils/axios';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { userStore } from '@/stores/user';

const router = useRouter();
const route = useRoute();
const userId = route.params.id;
const userInfo = userStore();

const formRef = ref<FormInstance>();
const form = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const rules: FormRules = {
  oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 24, message: '新密码长度应为6~24位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator(rule, value, callback) {
        if (!value) {
          return callback(new Error('请确认新密码'));
        }
        if (value !== form.newPassword) {
          return callback(new Error('两次输入的密码不一致'));
        }
        callback();
      },
      trigger: 'blur'
    }
  ]
};

const submit = async () => {
  await formRef.value?.validate();

  try {
    const res = await axios.put(`/api/users/${userId}/change_password`, {
      oldPassword: form.oldPassword,
      newPassword: form.newPassword
    });

    if (res.data.code === 200) {
      ElMessage.success('密码修改成功');
      userInfo.clearUser();
      router.push(`/`).then(() => {
        window.location.reload();
      });
    } else {
      ElMessage.error(res.data.message || '密码修改失败');
    }
  } catch (err) {
    ElMessage.error('请求失败，请稍后再试');
  }
};
</script>
