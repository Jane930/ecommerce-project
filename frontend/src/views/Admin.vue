<template>
  <div>
    <h2 class="text-3xl font-bold mb-6">管理后台</h2>

    <div class="mb-6">
      <div class="flex space-x-4 border-b">
        <button
          @click="activeTab = 'products'"
          :class="activeTab === 'products' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'"
          class="px-4 py-2 font-semibold"
        >
          商品管理
        </button>
        <button
          @click="activeTab = 'orders'"
          :class="activeTab === 'orders' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'"
          class="px-4 py-2 font-semibold"
        >
          订单管理
        </button>
        <button
          @click="activeTab = 'statistics'"
          :class="activeTab === 'statistics' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'"
          class="px-4 py-2 font-semibold"
        >
          销售统计
        </button>
        <button
          @click="activeTab = 'customers'"
          :class="activeTab === 'customers' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'"
          class="px-4 py-2 font-semibold"
        >
          客户管理
        </button>
      </div>
    </div>

    <!-- 商品管理 -->
    <div v-if="activeTab === 'products'">
      <div class="mb-6">
        <button
          @click="showProductForm = true; editingProduct = null"
          class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
        >
          添加商品
        </button>
      </div>

      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-4 py-3 text-left">ID</th>
              <th class="px-4 py-3 text-left">名称</th>
              <th class="px-4 py-3 text-left">价格</th>
              <th class="px-4 py-3 text-left">库存</th>
              <th class="px-4 py-3 text-left">分类</th>
              <th class="px-4 py-3 text-left">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products" :key="product.id" class="border-t">
              <td class="px-4 py-3">{{ product.id }}</td>
              <td class="px-4 py-3">{{ product.name }}</td>
              <td class="px-4 py-3">¥{{ product.price }}</td>
              <td class="px-4 py-3">{{ product.stock }}</td>
              <td class="px-4 py-3">{{ product.category }}</td>
              <td class="px-4 py-3">
                <button @click="editProduct(product)" class="text-blue-500 hover:underline mr-2">编辑</button>
                <button @click="deleteProduct(product.id)" class="text-red-500 hover:underline">删除</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 订单管理 -->
    <div v-if="activeTab === 'orders'" class="bg-white rounded-lg shadow-md overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-4 py-3 text-left">订单ID</th>
            <th class="px-4 py-3 text-left">用户</th>
            <th class="px-4 py-3 text-left">金额</th>
            <th class="px-4 py-3 text-left">状态</th>
            <th class="px-4 py-3 text-left">时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id" class="border-t">
            <td class="px-4 py-3">{{ order.id }}</td>
            <td class="px-4 py-3">{{ order.username }}</td>
            <td class="px-4 py-3">¥{{ order.total_amount }}</td>
            <td class="px-4 py-3">{{ order.status }}</td>
            <td class="px-4 py-3">{{ formatDate(order.created_at) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 销售统计 -->
    <div v-if="activeTab === 'statistics'">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-gray-600 text-sm mb-2">总销售额</h3>
          <p class="text-3xl font-bold text-blue-600">¥{{ statistics.totalSales?.toFixed(2) || 0 }}</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-gray-600 text-sm mb-2">总订单数</h3>
          <p class="text-3xl font-bold text-green-600">{{ statistics.totalOrders || 0 }}</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-gray-600 text-sm mb-2">平均订单金额</h3>
          <p class="text-3xl font-bold text-purple-600">¥{{ (statistics.totalSales / statistics.totalOrders || 0).toFixed(2) }}</p>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 class="text-xl font-bold mb-4">最畅销商品 TOP 10</h3>
        <table class="w-full">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-4 py-3 text-left">商品名称</th>
              <th class="px-4 py-3 text-left">销售数量</th>
              <th class="px-4 py-3 text-left">销售额</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in statistics.topProducts" :key="product.name" class="border-t">
              <td class="px-4 py-3">{{ product.name }}</td>
              <td class="px-4 py-3">{{ product.totalSold }}</td>
              <td class="px-4 py-3">¥{{ product.revenue?.toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-xl font-bold mb-4">最近7天销售趋势</h3>
        <table class="w-full">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-4 py-3 text-left">日期</th>
              <th class="px-4 py-3 text-left">订单数</th>
              <th class="px-4 py-3 text-left">销售额</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="day in statistics.dailySales" :key="day.date" class="border-t">
              <td class="px-4 py-3">{{ day.date }}</td>
              <td class="px-4 py-3">{{ day.orders }}</td>
              <td class="px-4 py-3">¥{{ day.sales?.toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 客户管理 -->
    <div v-if="activeTab === 'customers'">
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-4 py-3 text-left">客户ID</th>
              <th class="px-4 py-3 text-left">用户名</th>
              <th class="px-4 py-3 text-left">邮箱</th>
              <th class="px-4 py-3 text-left">订单数</th>
              <th class="px-4 py-3 text-left">总消费</th>
              <th class="px-4 py-3 text-left">注册时间</th>
              <th class="px-4 py-3 text-left">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="customer in customers" :key="customer.id" class="border-t">
              <td class="px-4 py-3">{{ customer.id }}</td>
              <td class="px-4 py-3">{{ customer.username }}</td>
              <td class="px-4 py-3">{{ customer.email }}</td>
              <td class="px-4 py-3">{{ customer.totalOrders }}</td>
              <td class="px-4 py-3">¥{{ customer.totalSpent?.toFixed(2) }}</td>
              <td class="px-4 py-3">{{ formatDate(customer.created_at) }}</td>
              <td class="px-4 py-3">
                <button @click="viewCustomerDetails(customer.id)" class="text-blue-500 hover:underline">查看详情</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 客户详情模态框 -->
    <div v-if="showCustomerDetails" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-8 max-w-4xl w-full max-h-screen overflow-y-auto">
        <h3 class="text-2xl font-bold mb-4">客户详情</h3>
        <div v-if="customerDetails" class="mb-6">
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p class="text-gray-600">用户名：{{ customerDetails.customer.username }}</p>
              <p class="text-gray-600">邮箱：{{ customerDetails.customer.email }}</p>
            </div>
            <div>
              <p class="text-gray-600">总订单数：{{ customerDetails.orderStats.totalOrders }}</p>
              <p class="text-gray-600">总消费：¥{{ customerDetails.orderStats.totalSpent?.toFixed(2) }}</p>
            </div>
          </div>

          <h4 class="text-xl font-bold mb-3">活动日志</h4>
          <div class="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
            <div v-for="log in customerDetails.activityLogs" :key="log.id" class="mb-3 pb-3 border-b">
              <p class="font-semibold">{{ log.action }}</p>
              <p class="text-sm text-gray-600">{{ log.details }}</p>
              <p class="text-xs text-gray-400">{{ formatDate(log.created_at) }}</p>
            </div>
          </div>
        </div>
        <button @click="showCustomerDetails = false" class="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400">关闭</button>
      </div>
    </div>

    <!-- 商品表单模态框 -->
    <div v-if="showProductForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-8 max-w-md w-full max-h-screen overflow-y-auto">
        <h3 class="text-2xl font-bold mb-4">{{ editingProduct ? '编辑商品' : '添加商品' }}</h3>
        <form @submit.prevent="saveProduct">
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">商品名称</label>
            <input v-model="productForm.name" type="text" required class="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">描述</label>
            <textarea v-model="productForm.description" class="w-full px-4 py-2 border rounded-lg" rows="3"></textarea>
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">价格</label>
            <input v-model="productForm.price" type="number" step="0.01" required class="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">库存</label>
            <input v-model="productForm.stock" type="number" required class="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">分类</label>
            <input v-model="productForm.category" type="text" class="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">图片URL</label>
            <input v-model="productForm.image_url" type="text" class="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div class="flex gap-4">
            <button type="submit" class="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">保存</button>
            <button type="button" @click="showProductForm = false" class="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400">取消</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../api';

const activeTab = ref('products');
const products = ref([]);
const orders = ref([]);
const statistics = ref({
  totalSales: 0,
  totalOrders: 0,
  ordersByStatus: [],
  topProducts: [],
  dailySales: []
});
const customers = ref([]);
const showProductForm = ref(false);
const showCustomerDetails = ref(false);
const editingProduct = ref(null);
const customerDetails = ref(null);
const productForm = ref({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  category: '',
  image_url: ''
});

const loadProducts = async () => {
  try {
    const data = await api.get('/products', { params: { limit: 100 } });
    products.value = data.products;
  } catch (error) {
    console.error('加载商品失败:', error);
  }
};

const loadOrders = async () => {
  try {
    orders.value = await api.get('/orders/admin/all');
  } catch (error) {
    console.error('加载订单失败:', error);
  }
};

const loadStatistics = async () => {
  try {
    statistics.value = await api.get('/orders/admin/statistics');
  } catch (error) {
    console.error('加载统计数据失败:', error);
  }
};

const loadCustomers = async () => {
  try {
    customers.value = await api.get('/users/admin/customers');
  } catch (error) {
    console.error('加载客户列表失败:', error);
  }
};

const viewCustomerDetails = async (customerId) => {
  try {
    customerDetails.value = await api.get(`/users/admin/customers/${customerId}`);
    showCustomerDetails.value = true;
  } catch (error) {
    alert('加载客户详情失败');
  }
};

const editProduct = (product) => {
  editingProduct.value = product;
  productForm.value = { ...product };
  showProductForm.value = true;
};

const saveProduct = async () => {
  try {
    if (editingProduct.value) {
      await api.put(`/products/${editingProduct.value.id}`, productForm.value);
      alert('商品更新成功');
    } else {
      await api.post('/products', productForm.value);
      alert('商品添加成功');
    }
    showProductForm.value = false;
    await loadProducts();
  } catch (error) {
    alert(error.response?.data?.error || '操作失败');
  }
};

const deleteProduct = async (id) => {
  if (!confirm('确定要删除这个商品吗？')) return;
  try {
    await api.delete(`/products/${id}`);
    alert('商品删除成功');
    await loadProducts();
  } catch (error) {
    alert('删除失败');
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('zh-CN');
};

onMounted(() => {
  loadProducts();
  loadOrders();
  loadStatistics();
  loadCustomers();
});
</script>
