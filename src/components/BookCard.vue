<template>
  <router-link :to="`/books/${book.id}`"
    class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
    <div class="bg-gradient-to-br from-blue-100 to-indigo-100 h-48 flex items-center justify-center text-5xl">
      📖
    </div>
    <div class="p-4 flex flex-col flex-1">
      <p class="text-xs text-blue-600 font-medium mb-1">{{ book.categoryName }}</p>
      <h3 class="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 mb-1">{{ book.title }}</h3>
      <p class="text-xs text-gray-500 mb-3">{{ book.publisher }}</p>
      <div class="mt-auto flex items-center justify-between">
        <span class="text-blue-600 font-bold">{{ book.price?.toLocaleString() }}원</span>
        <span class="text-xs text-yellow-500">★ {{ book.rating?.toFixed(1) }}</span>
      </div>
    </div>
  </router-link>
</template>

<script setup>
defineProps({ book: Object })
</script>
