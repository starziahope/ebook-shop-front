import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  { path: '/',          name: 'Home',       component: () => import('../views/HomeView.vue') },
  { path: '/books/:id', name: 'BookDetail', component: () => import('../views/BookDetailView.vue') },
  { path: '/login',     name: 'Login',      component: () => import('../views/LoginView.vue') },
  { path: '/signup',    name: 'SignUp',      component: () => import('../views/SignUpView.vue') },
  { path: '/mypage',    name: 'MyPage',      component: () => import('../views/MyPageView.vue'), meta: { requiresAuth: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isLoggedIn) return '/login'
})

export default router
