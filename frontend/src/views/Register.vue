<template>
  <div class="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
    <h2 class="text-2xl font-bold text-center mb-6">用户注册</h2>
    <form @submit.prevent="handleRegister">
      <div class="mb-4">
        <label class="block text-gray-700 mb-2">用户名</label>
        <input
          v-model="username"
          type="text"
          required
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="请输入用户名"
        />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 mb-2">邮箱</label>
        <input
          v-model="email"
          type="email"
          required
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="请输入邮箱"
        />
      </div>
      <div class="mb-6">
        <label class="block text-gray-700 mb-2">密码</label>
        <input
          v-model="password"
          type="password"
          required
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="请输入密码"
        />
      </div>
      <button
        type="submit"
        class="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
      >
        注册
      </button>
    </form>
    <p class="text-center mt-4 text-gray-600">
      已有账号？
      <router-link to="/login" class="text-blue-500 hover:underline">立即登录</router-link>
    </p>
    <div v-if="error" class="mt-4 p-3 bg-red-100 text-red-700 rounded">
      {{ error }}
    </div>
    <div v-if="success" class="mt-4 p-3 bg-green-100 text-green-700 rounded">
      {{ success }}
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
const email = ref('');
const password = ref('');
const error = ref('');
const success = ref('');

const handleRegister = async () => {
  try {
    error.value = '';
    success.value = '';
    await authStore.register(username.value, email.value, password.value);
    success.value = '注册成功！3秒后跳转到登录页面...';
    setTimeout(() => {
      router.push('/login');
    }, 3000);
  } catch (err) {
    error.value = err.response?.data?.error || '注册失败';
  }
};
</script>
