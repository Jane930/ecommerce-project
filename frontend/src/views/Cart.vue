<template>
  <div>
    <h2 class="text-3xl font-bold mb-6">购物车</h2>

    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-600">加载中...</p>
    </div>

    <div v-else-if="cartItems.length === 0" class="text-center py-8">
      <p class="text-gray-600 mb-4">购物车是空的</p>
      <router-link to="/products" class="text-blue-500 hover:underline">
        去购物
      </router-link>
    </div>

    <div v-else>
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div v-for="item in cartItems" :key="item.id" class="flex items-center border-b py-4 last:border-b-0">
          <div class="w-20 h-20 bg-gray-200 rounded flex items-center justify-center mr-4">
            <img v-if="item.image_url" :src="item.image_url" :alt="item.name" class="w-full h-full object-cover rounded" />
            <span v-else class="text-2xl">📦</span>
          </div>
          <div class="flex-1">
            <h3 class="font-semibold text-lg">{{ item.name }}</h3>
            <p class="text-gray-600">¥{{ item.price }}</p>
          </div>
          <div class="flex items-center gap-4">
            <span class="text-gray-700">数量: {{ item.quantity }}</span>
            <span class="font-bold text-lg">¥{{ (item.price * item.quantity).toFixed(2) }}</span>
            <button
              @click="removeFromCart(item.id)"
              class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              删除
            </button>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex justify-between items-center mb-4">
          <span class="text-xl font-semibold">总计:</span>
          <span class="text-2xl font-bold text-blue-600">¥{{ totalAmount.toFixed(2) }}</span>
        </div>
        <button
          @click="checkout"
          class="w-full bg-green-500 text-white py-3 rounded-lg text-lg hover:bg-green-600"
        >
          结算
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api';

const router = useRouter();
const cartItems = ref([]);
const loading = ref(false);

const totalAmount = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0);
});

const loadCart = async () => {
  loading.value = true;
  try {
    cartItems.value = await api.get('/orders/cart');
  } catch (error) {
    console.error('加载购物车失败:', error);
  } finally {
    loading.value = false;
  }
};

const removeFromCart = async (id) => {
  try {
    await api.delete(`/orders/cart/${id}`);
    await loadCart();
  } catch (error) {
    alert('删除失败');
  }
};

const checkout = async () => {
  try {
    await api.post('/orders');
    alert('订单创建成功！');
    router.push('/orders');
  } catch (error) {
    alert(error.response?.data?.error || '结算失败');
  }
};

onMounted(() => {
  loadCart();
});
</script>
