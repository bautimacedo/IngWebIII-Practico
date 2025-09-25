import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProductosView from '../views/ProductosView.vue'
import LoginView from '../views/LoginView.vue'
import ProductoDetalleView from '../views/ProductoDetalleView.vue'
import ClientesView from '../views/ClientesView.vue'
import RegisterView from '@/views/RegisterView.vue'
import { useAuthStore } from '@/stores/auth'

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
      meta: { requiresAuth: true }, //requiere login
    },
    {
      path: '/productos/:id',
      name: 'producto-detalle',
      component: ProductoDetalleView,
      props: true,
      meta: { requiresAuth: true }, // requiere login
    },
    {
      path: '/clientes',
      name: 'clientes',
      component: ClientesView,
      meta: { requiresAuth: true }, // requiere login
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/registro',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  },
})

// 🔹 Guardia global
router.beforeEach((to) => {
  const auth = useAuthStore()

  // inicializar sesión en memoria desde localStorage
  if (!auth.token) {
    auth.init()
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login' }
  }

  if ((to.name === 'login' || to.name === 'register') && auth.isAuthenticated) {
    return { name: 'home' }
  }
})

export default router
