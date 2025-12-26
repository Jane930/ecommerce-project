<template>
  <div>
    <h2 class="text-3xl font-bold mb-6">我的订单</h2>

    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-600">加载中...</p>
    </div>

    <div v-else-if="orders.length === 0" class="text-center py-8">
      <p class="text-gray-600 mb-4">暂无订单</p>
      <router-link to="/products" class="text-blue-500 hover:underline">
        去购物
      </router-link>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="order in orders"
        :key="order.id"
        class="bg-white rounded-lg shadow-md p-6"
      >
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="font-semibold text-lg">订单 #{{ order.id }}</h3>
            <p class="text-gray-600 text-sm">{{ formatDate(order.created_at) }}</p>
          </div>
          <span
            :class="getStatusClass(order.status)"
            class="px-3 py-1 rounded-full text-sm font-semibold"
          >
            {{ getStatusText(order.status) }}
          </span>
        </div>
        <div class="border-t pt-4">
          <p class="text-gray-700 mb-2">商品: {{ order.items || '暂无详情' }}</p>
          <p class="text-xl font-bold text-blue-600">总计: ¥{{ order.total_amount }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../api';

const orders = ref([]);
const loading = ref(false);

const loadOrders = async () => {
  loading.value = true;
  try {
    orders.value = await api.get('/orders');
  } catch (error) {
    console.error('加载订单失败:', error);
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('zh-CN');
};

const getStatusText = (status) => {
  const statusMap = {
    pending: '待处理',
    processing: '处理中',
    shipped: '已发货',
    delivered: '已送达',
    cancelled: '已取消'
  };
  return statusMap[status] || status;
};

const getStatusClass = (status) => {
  const classMap = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };
  return classMap[status] || 'bg-gray-100 text-gray-800';
};

onMounted(() => {
  loadOrders();
});
</script>
