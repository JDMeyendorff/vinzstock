import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'

const routes = [
  {
    path: '/',
    name: 'Root',
    component: LoginView
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  // Catch-all -> redirige a la ruta principal (login)
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router