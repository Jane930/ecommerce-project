<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <router-link to="/" class="text-2xl font-bold text-blue-600">
              电商平台
            </router-link>
            <div class="ml-10 flex space-x-4">
              <router-link to="/products" class="text-gray-700 hover:text-blue-600 px-3 py-2">
                商品列表
              </router-link>
              <router-link v-if="isAuthenticated" to="/cart" class="text-gray-700 hover:text-blue-600 px-3 py-2">
                购物车
              </router-link>
              <router-link v-if="isAuthenticated" to="/orders" class="text-gray-700 hover:text-blue-600 px-3 py-2">
                我的订单
              </router-link>
              <router-link v-if="isAdmin" to="/admin" class="text-gray-700 hover:text-blue-600 px-3 py-2">
                管理后台
              </router-link>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <template v-if="isAuthenticated">
              <span class="text-gray-700">{{ user?.username }}</span>
              <button @click="handleLogout" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                退出
              </button>
            </template>
            <template v-else>
              <router-link to="/login" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                登录
              </router-link>
              <router-link to="/register" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                注册
              </router-link>
            </template>
          </div>
        </div>
      </div>
    </nav>
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from './stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const isAuthenticated = computed(() => authStore.isAuthenticated);
const isAdmin = computed(() => authStore.isAdmin);
const user = computed(() => authStore.user);

const handleLogout = () => {
  authStore.logout();
  router.push('/');
};
</script>
