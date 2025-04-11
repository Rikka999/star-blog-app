<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2 class="login-title">🌟 星星树洞</h2>
      <p class="login-subtitle">你有什么想说的呢？</p>

      <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" show-password placeholder="请输入密码" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="login-button" @click="onSubmit">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import axios from 'axios'



const form = reactive({
  username: '',
  password: '',
})

const formRef = ref<FormInstance>()

const rules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 6, max: 12, message: '用户名长度应为 6 到 12 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 12, message: '密码长度应为 6 到 12 个字符', trigger: 'blur' }
  ]
}

const onSubmit = async () => {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
    console.log('✅ 表单校验通过，准备提交：', form)
     // 调用登录接口
     const response = await axios.post('http://localhost:8080/api/auth/login', {
      username: form.username,
      password: form.password
    })

    // 处理接口返回
    if (response.data.code === 200 && response.data.message === 'success') {
      console.log('🎉 登录成功！', response.data)
      // TODO: 登录成功后跳转到首页
      // 例如：this.$router.push('/home')
    } else {
      console.warn('❌ 登录失败：', response.data)
      // 提示登录失败信息
    }
  } catch (err) {
    console.warn('❌ 表单校验失败')
    console.log('错误详情：', err)
}
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(to right, #e0f7fa, #ffffff);
}

.login-card {
  width: 400px;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.login-title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
}

.login-subtitle {
  text-align: center;
  color: #888;
  margin-bottom: 24px;
}

.login-button {
  width: 100%;
}
</style>
