import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/column/:id',
    name: 'column',
    component: () => import('../views/ColumnDetail.vue')
  }
]
const router = createRouter({
  history: createWebHashHistory(),
  routes
})
export default router
