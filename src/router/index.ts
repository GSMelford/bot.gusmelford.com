import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import store from '@/store'
import { httpClient } from '@/api/axiosConfig'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: {
      title: 'Home',
      requiresAuth: true
    }
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: {
      title: 'Home',
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: {
      title: 'Login | GusMelfordBot'
    }
  },
  {
    path: '/content-room',
    name: 'content-room',
    component: () => import('../views/ContentViewerRoom.vue'),
    meta: {
      title: 'Content Room',
      requiresAuth: true
    }
  },
  {
    path: '/content-viewer',
    name: 'content-viewer',
    component: () => import('../views/ContentViewer.vue'),
    meta: {
      title: 'Content Viewer',
      requiresAuth: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const nearestWithTitle = to.matched.slice().reverse().find((r) => r.meta && r.meta.title)
  document.title = `${nearestWithTitle?.meta.title || 'GusMelfordBot'}`
  httpClient.defaults.headers.common.Authorization = `Bearer ${store.getters.getToken}`
  if (to.meta.requiresAuth) {
    if (store.getters.getAuthState) {
      next()
    } else {
      next({ name: 'login' })
    }
  } else {
    next()
  }
})

export default router
