<template>
  <div>
    <!-- 查詢商品 -->
    <SearchProduct />

    <!-- 商品與版位關聯 -->
    <ProductAndSlotList />
  </div>
</template>

<script setup>
import SearchProduct from "@/components/product/SearchProduct.vue";
import ProductAndSlotList from "@/components/product/ProductAndSlotList.vue";
</script>
