<template>
  <div class="max-w-6xl mx-auto px-4 py-8">

    <!-- 히어로 배너 -->
    <div v-if="!route.query.keyword && !selectedCategory"
      class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-10 mb-10 text-white text-center">
      <h1 class="text-3xl font-bold mb-2">원하는 책을 찾아보세요</h1>
      <p class="text-blue-100 mb-6">수천 권의 전자책을 한 곳에서</p>
      <form @submit.prevent="searchBooks" class="flex max-w-md mx-auto gap-2">
        <input v-model="keyword" type="text" placeholder="제목, 출판사 검색..."
          class="flex-1 px-4 py-2 rounded-lg text-gray-900 outline-none" />
        <button type="submit" class="bg-white text-blue-600 font-semibold px-5 py-2 rounded-lg hover:bg-blue-50">검색</button>
      </form>
    </div>

    <!-- 카테고리 탭 -->
    <div class="flex gap-2 flex-wrap mb-6">
      <button @click="selectCategory(null)"
        :class="['px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
          !selectedCategory ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border']">
        전체
      </button>
      <button v-for="cat in categories" :key="cat.id"
        @click="selectCategory(cat.id)"
        :class="['px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
          selectedCategory === cat.id ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border']">
        {{ cat.name }}
      </button>
    </div>

    <!-- 검색 결과 -->
    <div v-if="route.query.keyword" class="mb-4 text-gray-600">
      <span class="font-semibold text-gray-900">"{{ route.query.keyword }}"</span> 검색 결과 {{ books.length }}건
    </div>

    <!-- 베스트셀러 (기본 화면) -->
    <template v-if="!route.query.keyword && !selectedCategory">
      <section class="mb-10">
        <h2 class="text-xl font-bold mb-4 flex items-center gap-2">🏆 베스트셀러</h2>
        <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          <div v-for="i in 5" :key="i" class="bg-gray-100 rounded-xl h-64 animate-pulse"></div>
        </div>
        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          <BookCard v-for="book in bestsellers" :key="book.id" :book="book" />
        </div>
      </section>
      <section>
        <h2 class="text-xl font-bold mb-4 flex items-center gap-2">🆕 신규 도서</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          <BookCard v-for="book in newBooks" :key="book.id" :book="book" />
        </div>
      </section>
    </template>

    <!-- 검색/카테고리 결과 -->
    <template v-else>
      <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        <div v-for="i in 8" :key="i" class="bg-gray-100 rounded-xl h-64 animate-pulse"></div>
      </div>
      <div v-else-if="books.length === 0" class="text-center py-20 text-gray-400">
        <p class="text-4xl mb-3">📭</p>
        <p>검색 결과가 없습니다.</p>
      </div>
      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        <BookCard v-for="book in books" :key="book.id" :book="book" />
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { bookApi, categoryApi } from '../api'
import BookCard from '../components/BookCard.vue'

const route = useRoute()
const router = useRouter()
const keyword = ref('')
const categories = ref([])
const bestsellers = ref([])
const newBooks = ref([])
const books = ref([])
const selectedCategory = ref(null)
const loading = ref(false)

async function loadDefault() {
  loading.value = true
  try {
    const [b, n] = await Promise.all([bookApi.getBestsellers(), bookApi.getNewBooks()])
    bestsellers.value = b.data
    newBooks.value = n.data
  } catch (e) {
    console.error('도서 로드 실패', e)
  } finally {
    loading.value = false
  }
}

async function loadBooks(params) {
  loading.value = true
  const res = await bookApi.getBooks(params)
  books.value = res.data.content ?? res.data
  loading.value = false
}

function selectCategory(id) {
  selectedCategory.value = id
  if (id) loadBooks({ categoryId: id })
}

function searchBooks() {
  if (keyword.value.trim()) router.push({ query: { keyword: keyword.value.trim() } })
}

onMounted(async () => {
  try {
    const res = await categoryApi.getCategories()
    categories.value = res.data
  } catch (e) {
    console.error('카테고리 로드 실패', e)
  }
  if (route.query.keyword) loadBooks({ keyword: route.query.keyword })
  else loadDefault()
})

watch(() => route.query.keyword, val => {
  selectedCategory.value = null
  if (val) loadBooks({ keyword: val })
  else loadDefault()
})
</script>
