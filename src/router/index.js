import { createRouter, createWebHistory } from 'vue-router'

// Importar vistas
import HomeView from '../views/HomeView.vue'
import ProductosView from '../views/ProductosView.vue'
import LoginView from '../views/LoginView.vue'
import ClienteView from '@/views/ClientesView.vue'
//import ProductoDetalle from '../views/ProductoDetalle.vue'
//import ClientesView from '../views/ClientesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/productos',
      name: 'productos',
      component: ProductosView,
    },
    // fallback para rutas no encontradas
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/clientes',
      name: 'clientes',
      component: ClienteView,
    }
  ],
})

export default router
