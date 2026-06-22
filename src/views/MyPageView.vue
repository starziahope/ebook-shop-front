<template>
  <div class="max-w-4xl mx-auto px-4 py-10">
    <h1 class="text-2xl font-bold mb-8">마이페이지</h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- 사이드 -->
      <div class="bg-white rounded-2xl shadow-sm p-6 h-fit">
        <div class="text-center">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-3">👤</div>
          <p class="font-semibold text-gray-900">{{ auth.user?.name || '사용자' }}</p>
          <p class="text-sm text-gray-500 mt-1">{{ auth.user?.email }}</p>
          <span class="mt-2 inline-block text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
            {{ auth.user?.role === 'ADMIN' ? '관리자' : '일반회원' }}
          </span>
        </div>
        <div class="mt-6 space-y-2">
          <button @click="tab = 'orders'"
            :class="['w-full text-left px-3 py-2 rounded-lg text-sm', tab==='orders' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50']">
            📦 주문 목록
          </button>
        </div>
      </div>

      <!-- 주문 목록 -->
      <div class="md:col-span-2 bg-white rounded-2xl shadow-sm p-6">
        <h2 class="text-lg font-bold mb-5">주문 목록</h2>

        <div v-if="loading" class="space-y-3">
          <div v-for="i in 3" :key="i" class="h-20 bg-gray-100 rounded-xl animate-pulse"></div>
        </div>

        <div v-else-if="orders.length === 0" class="text-center py-12 text-gray-400">
          <p class="text-4xl mb-3">📭</p>
          <p>주문 내역이 없습니다.</p>
        </div>

        <div v-else class="space-y-3">
          <div v-for="order in orders" :key="order.id"
            class="border rounded-xl p-4 hover:border-blue-300 transition-colors">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs text-gray-400">{{ order.orderNumber }}</span>
              <span :class="statusClass(order.status)" class="text-xs font-medium px-2 py-0.5 rounded-full">
                {{ statusLabel(order.status) }}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <p class="text-sm text-gray-600">{{ formatDate(order.createdAt) }}</p>
              <p class="font-bold text-blue-600">{{ order.finalAmount?.toLocaleString() }}원</p>
            </div>
            <button v-if="order.status === 'PENDING' || order.status === 'PAID'"
              @click="cancelOrder(order.id)"
              class="mt-2 text-xs text-red-500 hover:text-red-600">주문 취소</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { orderApi } from '../api'

const auth = useAuthStore()
const tab = ref('orders')
const orders = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await orderApi.getOrders({ size: 20 })
    orders.value = res.data.content ?? res.data
  } catch {}
  loading.value = false
})

async function cancelOrder(id) {
  if (!confirm('주문을 취소하시겠습니까?')) return
  await orderApi.cancelOrder(id)
  const order = orders.value.find(o => o.id === id)
  if (order) order.status = 'CANCELLED'
}

function statusLabel(s) {
  return { PENDING: '결제대기', PAID: '결제완료', PROCESSING: '처리중', SHIPPED: '배송중', DELIVERED: '배송완료', CANCELLED: '취소' }[s] ?? s
}

function statusClass(s) {
  return {
    PENDING: 'bg-yellow-100 text-yellow-700',
    PAID: 'bg-blue-100 text-blue-700',
    DELIVERED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-gray-100 text-gray-500'
  }[s] ?? 'bg-gray-100 text-gray-500'
}

function formatDate(dt) {
  if (!dt) return ''
  return new Date(dt).toLocaleDateString('ko-KR')
}
</script>
