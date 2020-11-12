import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import store from './../store'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/column/:id',
    name: 'column',
    component: () => import('../views/ColumnDetail.vue')
  },
  {
    path: '/create',
    name: 'create',
    component: () => import('../views/CreatePost.vue'),
    meta: { requiredLogin: true }
  }
]
const router = createRouter({
  history: createWebHashHistory(),
  routes
})
router.beforeEach((to, from ,next) => {
  console.log(to.meta);
  
  if (to.meta.requiredLogin && !store.state.user.isLogin) {
    next({name: 'login'})
  } else {
    next()
  }
})
export default router
