import { createRouter, createWebHashHistory, useRoute } from 'vue-router'

import Home from './pages/Home.vue'
import SocialItem from './pages/SocialItem.vue'

const routes = [
  {
    name: 'Home',
    path: '/',
    component: Home
  },
  {
    name: 'SocialItem',
    path: '/item/:id',
    component: SocialItem
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export { router, useRoute }
