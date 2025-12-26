<template>
  <div class="text-center">
    <h1 class="text-4xl font-bold text-gray-800 mb-4">欢迎来到电商平台</h1>
    <p class="text-xl text-gray-600 mb-8">优质商品，优惠价格</p>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
      <div class="bg-white p-6 rounded-lg shadow-md">
        <div class="text-4xl mb-4">🛍️</div>
        <h3 class="text-xl font-semibold mb-2">丰富商品</h3>
        <p class="text-gray-600">海量商品任您选择</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-md">
        <div class="text-4xl mb-4">🚚</div>
        <h3 class="text-xl font-semibold mb-2">快速配送</h3>
        <p class="text-gray-600">高效物流，快速送达</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-md">
        <div class="text-4xl mb-4">💳</div>
        <h3 class="text-xl font-semibold mb-2">安全支付</h3>
        <p class="text-gray-600">多种支付方式，安全可靠</p>
      </div>
    </div>
    <router-link to="/products" class="inline-block mt-8 bg-blue-500 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-600">
      开始购物
    </router-link>
  </div>
</template>

<script setup>
</script>
