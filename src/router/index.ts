import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/content-room',
    name: 'content-room',
    component: () => import('../views/ContentViewerRoom.vue')
  },
  {
    path: '/content-viewer',
    name: 'content-viewer',
    component: () => import('../views/ContentViewer.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
