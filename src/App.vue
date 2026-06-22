<template>
  <div class="min-h-screen flex flex-col">
    <NavBar />
    <main class="flex-1">
      <router-view />
    </main>
    <footer class="bg-gray-800 text-gray-400 text-center py-6 text-sm mt-12">
      © 2026 ebook Shop. All rights reserved.
    </footer>
  </div>
</template>

<script setup>
import NavBar from './components/NavBar.vue'
</script>
