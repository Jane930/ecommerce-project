<template>
  <div class="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
    <h2 class="text-2xl font-bold text-center mb-6">用户登录</h2>
    <form @submit.prevent="handleLogin">
      <div class="mb-4">
        <label class="block text-gray-700 mb-2">用户名</label>
        <input
          v-model="username"
          type="text"
          required
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="请输入用户名"
        />
      </div>
      <div class="mb-6">
        <label class="block text-gray-700 mb-2">密码</label>
        <input
          v-model="password"
          type="password"
          required
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="请输入密码"
        />
      </div>
      <button
        type="submit"
        class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
      >
        登录
      </button>
    </form>
    <p class="text-center mt-4 text-gray-600">
      还没有账号？
      <router-link to="/register" class="text-blue-500 hover:underline">立即注册</router-link>
    </p>
    <div v-if="error" class="mt-4 p-3 bg-red-100 text-red-700 rounded">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const username = ref('');
const password = ref('');
const error = ref('');

const handleLogin = async () => {
  try {
    error.value = '';
    await authStore.login(username.value, password.value);
    router.push('/products');
  } catch (err) {
    error.value = err.response?.data?.error || '登录失败';
  }
};
</script>
