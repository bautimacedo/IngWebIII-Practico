<template>
  <v-app-bar color="primary" dark elevate-on-scroll>
    <v-toolbar-title class="font-weight-bold">
      🛒 Tienda Emergente
    </v-toolbar-title>

    <v-spacer />

    <!-- Navegación -->
    <v-btn text :to="{ name: 'home' }">Inicio</v-btn>
    <v-btn text :to="{ name: 'productos' }">Productos</v-btn>
    <v-btn text :to="{ name: 'clientes' }">Clientes</v-btn>

    <!-- Autenticación -->
    <template v-if="!isAuthenticated">
      <v-btn text :to="{ name: 'login' }">Login</v-btn>
    </template>

    <template v-else>
      <!-- Mostrar email del usuario -->
      <span class="mr-4 text-caption">{{ user?.email }}</span>
      <v-btn text @click="onLogout">Cerrar sesión</v-btn>
    </template>
  </v-app-bar>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../stores/auth'

defineOptions({
  name: 'AppNavbar',
})

const router = useRouter()
const authStore = useAuthStore()

// extraemos el estado del store
const { isAuthenticated, user } = storeToRefs(authStore)

function onLogout() {
  authStore.logout()
  router.push({ name: 'home' })
}
</script>

<style scoped>
.text-caption {
  font-size: 0.9rem;
  opacity: 0.9;
}
</style>
