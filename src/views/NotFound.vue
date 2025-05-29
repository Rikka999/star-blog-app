<template>
  <div class="h-screen flex items-center justify-center bg-gray-100">
    <div class="text-center px-4">
      <h1 class="text-6xl font-extrabold text-blue-600 animate-bounce mb-4">404</h1>
      <p class="text-2xl font-semibold text-gray-800 mb-2">页面不存在</p>
      <p class="text-gray-600 mb-6">过一会再来看看吧。</p>
      <RouterLink
        to="/"
        class="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
      >
        返回首页
      </RouterLink>
    </div>
  </div>
</template>
