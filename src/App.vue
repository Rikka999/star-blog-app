<template>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
    <el-menu-item index="1"><RouterLink to="/">主页</RouterLink></el-menu-item>
    <el-menu-item index="2"><RouterLink to="/login">登陆</RouterLink></el-menu-item>
  </el-menu>
    <main>
        <RouterView />
  </main>
</template>
  

<script setup lang="ts">
    const activeIndex = '1'
</script>

<style>
</style>