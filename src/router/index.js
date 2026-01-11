import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../components/HomePage.vue'
import CardPage from '../components/CardPage.vue'
import BoardPage from '../components/BoardPage.vue'
import BoardWrite from '../components/BoardWrite.vue'
import BoardDetail from '../components/BoardDetail.vue'
import BoardUpdate from '../components/BoardUpdate.vue'

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/cardPage', name: 'CardPage', component: CardPage },
  { path: '/boardPage', name: 'BoardPage', component: BoardPage },
  { path: '/boardWrite', name: 'BoardWrite', component: BoardWrite },
  { path: '/boardDetail/:id', name: 'BoardDetail', component: BoardDetail, props: true },
  { path: '/boardUpdate/:id?', name: 'BoardUpdate', component: BoardUpdate, props: true }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
