<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-10">
    <div class="bg-white rounded-2xl shadow-sm p-8 w-full max-w-md">
      <div class="text-center mb-8">
        <div class="text-4xl mb-2">✍️</div>
        <h1 class="text-2xl font-bold">회원가입</h1>
      </div>

      <form @submit.prevent="handleSignUp" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">이메일</label>
          <input v-model="form.email" type="email" required placeholder="이메일 입력"
            class="w-full border rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
          <input v-model="form.password" type="password" required placeholder="영문+숫자+특수문자 8자 이상"
            class="w-full border rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">이름</label>
          <input v-model="form.name" type="text" required placeholder="이름 입력"
            class="w-full border rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">전화번호 <span class="text-gray-400">(선택)</span></label>
          <input v-model="form.phone" type="text" placeholder="010-0000-0000"
            class="w-full border rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
        </div>

        <p v-if="error" class="text-red-500 text-sm text-center">{{ error }}</p>
        <p v-if="success" class="text-green-600 text-sm text-center">{{ success }}</p>

        <button type="submit" :disabled="loading"
          class="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors">
          {{ loading ? '처리 중...' : '회원가입' }}
        </button>
      </form>

      <p class="text-center text-sm text-gray-500 mt-6">
        이미 계정이 있으신가요?
        <router-link to="/login" class="text-blue-600 font-medium hover:underline">로그인</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authApi } from '../api'

const router = useRouter()
const form = ref({ email: '', password: '', name: '', phone: '' })
const error = ref('')
const success = ref('')
const loading = ref(false)

async function handleSignUp() {
  error.value = ''
  success.value = ''
  loading.value = true
  try {
    await authApi.signup(form.value)
    success.value = '회원가입이 완료됐습니다. 로그인 해주세요.'
    setTimeout(() => router.push('/login'), 1500)
  } catch (e) {
    error.value = e.response?.data?.message || '회원가입에 실패했습니다.'
  } finally {
    loading.value = false
  }
}
</script>
