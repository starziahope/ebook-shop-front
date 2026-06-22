<template>
  <nav class="bg-white shadow-sm sticky top-0 z-50">
    <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
      <router-link to="/" class="text-xl font-bold text-blue-600">📚 ebook Shop</router-link>

      <div class="flex items-center gap-3">
        <form @submit.prevent="search" class="hidden sm:flex items-center border rounded-lg overflow-hidden">
          <input v-model="keyword" type="text" placeholder="도서 검색..." class="px-3 py-1.5 text-sm outline-none w-48" />
          <button type="submit" class="px-3 py-1.5 bg-blue-600 text-white text-sm hover:bg-blue-700">검색</button>
        </form>

        <template v-if="auth.isLoggedIn">
          <router-link to="/mypage" class="text-sm text-gray-600 hover:text-blue-600">마이페이지</router-link>
          <button @click="handleLogout" class="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg">로그아웃</button>
        </template>
        <template v-else>
          <router-link to="/login" class="text-sm text-gray-600 hover:text-blue-600">로그인</router-link>
          <router-link to="/signup" class="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700">회원가입</router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const keyword = ref('')

function search() {
  if (keyword.value.trim()) {
    router.push({ path: '/', query: { keyword: keyword.value.trim() } })
    keyword.value = ''
  }
}

async function handleLogout() {
  await auth.logout()
  router.push('/')
}
</script>
