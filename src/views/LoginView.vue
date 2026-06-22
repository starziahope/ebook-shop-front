<template>
  <div class="min-h-screen flex items-center justify-center px-4">
    <div class="bg-white rounded-2xl shadow-sm p-8 w-full max-w-md">
      <div class="text-center mb-8">
        <div class="text-4xl mb-2">📚</div>
        <h1 class="text-2xl font-bold">로그인</h1>
        <p class="text-gray-500 text-sm mt-1">ebook Shop에 오신 것을 환영합니다</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">이메일</label>
          <input v-model="form.email" type="email" required placeholder="이메일 입력"
            class="w-full border rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
          <input v-model="form.password" type="password" required placeholder="비밀번호 입력"
            class="w-full border rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
        </div>

        <p v-if="error" class="text-red-500 text-sm text-center">{{ error }}</p>

        <button type="submit" :disabled="loading"
          class="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors">
          {{ loading ? '로그인 중...' : '로그인' }}
        </button>
      </form>

      <!-- 테스트 계정 -->
      <div class="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-500">
        <p class="font-medium mb-1">테스트 계정</p>
        <p>user1@ebook.com / password</p>
        <p>admin@ebook.com / password</p>
      </div>

      <p class="text-center text-sm text-gray-500 mt-6">
        계정이 없으신가요?
        <router-link to="/signup" class="text-blue-600 font-medium hover:underline">회원가입</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()
const form = ref({ email: '', password: '' })
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    await auth.login(form.value.email, form.value.password)
    router.push('/')
  } catch (e) {
    error.value = e.response?.data?.message || '로그인에 실패했습니다.'
  } finally {
    loading.value = false
  }
}
</script>
