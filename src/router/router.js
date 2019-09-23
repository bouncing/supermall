import Vue from 'vue'
import Router from 'vue-router'

const Home = () => import('@/views/home/Home.vue')
const Category = () => import('@/views/category/Category.vue')
const Cart = () => import('@/views/cart/Cart.vue')
const Profile = () => import('@/views/profile/Profile.vue')
const Detail = () => import('@/views/detail/Detail.vue')

// const originalPush = Router.prototype.push
// Router.prototype.push = function push (location) {
//   return originalPush.call(this, location).catch(err => err)
// }

const originalReplace = Router.prototype.replace
Router.prototype.replace = function replace (location) {
  return originalReplace.call(this, location).catch(err => err)
}

Vue.use(Router)
// 创建路由表
const routes = [
  {
    path: '/home',
    name: 'home',
    component: Home
  },
  {
    path: '/category',
    name: 'category',
    component: Category
  },
  {
    path: '/cart',
    name: 'cart',
    component: Cart
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile
  },
  {
    path: '/detail/:iid',
    name: 'detail',
    component: Detail
  }
]

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
