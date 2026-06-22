<template>
  <div class="max-w-4xl mx-auto px-4 py-10">
    <div v-if="loading" class="flex justify-center py-20">
      <div class="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>

    <div v-else-if="book" class="bg-white rounded-2xl shadow-sm p-8">
      <div class="flex flex-col sm:flex-row gap-8">
        <div class="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl w-full sm:w-48 h-64 flex-shrink-0 flex items-center justify-center text-7xl">
          📖
        </div>
        <div class="flex-1">
          <span class="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-full">{{ book.categoryName }}</span>
          <h1 class="text-2xl font-bold mt-3 mb-2">{{ book.title }}</h1>
          <p class="text-gray-500 mb-1">출판사: {{ book.publisher }}</p>
          <p class="text-gray-500 mb-1">출판일: {{ book.publishedDate }}</p>
          <div class="flex items-center gap-3 my-4">
            <span class="text-yellow-500 font-semibold">★ {{ book.rating?.toFixed(1) }}</span>
            <span class="text-gray-400 text-sm">({{ book.ratingCount }}명)</span>
            <span class="text-gray-400 text-sm">판매 {{ book.salesCount?.toLocaleString() }}권</span>
          </div>
          <div class="text-3xl font-bold text-blue-600 mb-6">{{ book.price?.toLocaleString() }}원</div>

          <button @click="openOrderModal"
            class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            구매하기
          </button>
        </div>
      </div>

      <div class="mt-10 border-t pt-8">
        <h2 class="text-lg font-bold mb-3">도서 소개</h2>
        <p class="text-gray-600 leading-relaxed whitespace-pre-line">{{ book.description }}</p>
      </div>
    </div>

    <div v-else class="text-center py-20 text-gray-400">
      <p class="text-4xl mb-3">😔</p>
      <p>도서를 찾을 수 없습니다.</p>
      <router-link to="/" class="mt-4 inline-block text-blue-600 hover:underline">홈으로</router-link>
    </div>

    <!-- 구매 모달 -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div class="bg-white rounded-2xl p-6 w-full max-w-md">
        <h2 class="text-lg font-bold mb-4">배송 정보 입력</h2>
        <form @submit.prevent="handleOrder" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">배송지 주소 <span class="text-red-500">*</span></label>
            <input v-model="orderForm.shippingAddress" required placeholder="배송지 주소를 입력하세요"
              class="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">연락처 <span class="text-red-500">*</span></label>
            <input v-model="orderForm.shippingPhone" required placeholder="010-0000-0000"
              class="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">배송 메모</label>
            <input v-model="orderForm.shippingMemo" placeholder="배송 요청사항 (선택)"
              class="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div class="bg-gray-50 rounded-lg p-3 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">{{ book.title }}</span>
              <span class="font-semibold">{{ book.price?.toLocaleString() }}원</span>
            </div>
          </div>

          <p v-if="orderError" class="text-red-500 text-sm">{{ orderError }}</p>

          <div class="flex gap-3 pt-2">
            <button type="button" @click="showModal = false"
              class="flex-1 border rounded-xl py-2.5 text-sm text-gray-600 hover:bg-gray-50">취소</button>
            <button type="submit" :disabled="ordering"
              class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl py-2.5 text-sm">
              {{ ordering ? '처리 중...' : '결제하기' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { bookApi, orderApi } from '../api'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const book = ref(null)
const loading = ref(true)
const showModal = ref(false)
const ordering = ref(false)
const orderError = ref('')
const orderForm = ref({ shippingAddress: '', shippingPhone: '', shippingMemo: '' })

onMounted(async () => {
  try {
    const res = await bookApi.getBook(route.params.id)
    book.value = res.data
  } catch {}
  loading.value = false
})

function openOrderModal() {
  if (!auth.isLoggedIn) {
    router.push('/login')
    return
  }
  showModal.value = true
  orderError.value = ''
}

async function handleOrder() {
  orderError.value = ''
  ordering.value = true
  try {
    await orderApi.createOrder({
      bookIds: [book.value.id],
      shippingAddress: orderForm.value.shippingAddress,
      shippingPhone: orderForm.value.shippingPhone,
      shippingMemo: orderForm.value.shippingMemo
    })
    showModal.value = false
    alert('주문이 완료됐습니다!')
    router.push('/mypage')
  } catch (e) {
    orderError.value = e.response?.data?.message || '주문 처리 중 오류가 발생했습니다.'
  } finally {
    ordering.value = false
  }
}
</script>
