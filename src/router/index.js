import { createRouter, createWebHistory } from 'vue-router'

// Importar vistas
import HomeView from '../views/HomeView.vue'
import ProductosView from '../views/ProductosView.vue'
import LoginView from '../views/LoginView.vue'
import ProductoDetalleView from '../views/ProductoDetalleView.vue'
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
    {
      path: '/productos/:id',
      name: 'producto-detalle',
      component: ProductoDetalleView,
      props: true,
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

  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  },

})

export default router