<template>
  <div>
    <h2 class="text-3xl font-bold mb-6">商品列表</h2>

    <div class="mb-6 flex gap-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索商品..."
        class="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button @click="loadProducts" class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
        搜索
      </button>
    </div>

    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-600">加载中...</p>
    </div>

    <div v-else-if="products.length === 0" class="text-center py-8">
      <p class="text-gray-600">暂无商品</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div
        v-for="product in products"
        :key="product.id"
        class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
      >
        <div class="h-48 bg-gray-200 flex items-center justify-center">
          <img
            v-if="product.image_url"
            :src="product.image_url"
            :alt="product.name"
            class="w-full h-full object-cover"
          />
          <span v-else class="text-4xl">📦</span>
        </div>
        <div class="p-4">
          <h3 class="font-semibold text-lg mb-2">{{ product.name }}</h3>
          <p class="text-gray-600 text-sm mb-2 line-clamp-2">{{ product.description }}</p>
          <div class="flex justify-between items-center">
            <span class="text-xl font-bold text-blue-600">¥{{ product.price }}</span>
            <span class="text-sm text-gray-500">库存: {{ product.stock }}</span>
          </div>
          <button
            @click="addToCart(product)"
            :disabled="product.stock === 0"
            class="w-full mt-4 bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:bg-gray-300"
          >
            {{ product.stock === 0 ? '缺货' : '加入购物车' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import api from '../api';

const router = useRouter();
const authStore = useAuthStore();

const products = ref([]);
const searchQuery = ref('');
const loading = ref(false);

const loadProducts = async () => {
  loading.value = true;
  try {
    const data = await api.get('/products', {
      params: { search: searchQuery.value, limit: 100 }
    });
    products.value = data.products;
  } catch (error) {
    console.error('加载商品失败:', error);
  } finally {
    loading.value = false;
  }
};

const addToCart = async (product) => {
  if (!authStore.isAuthenticated) {
    router.push('/login');
    return;
  }

  try {
    await api.post('/orders/cart', { product_id: product.id, quantity: 1 });
    alert('已添加到购物车');
  } catch (error) {
    alert(error.response?.data?.error || '添加失败');
  }
};

onMounted(() => {
  loadProducts();
});
</script>
