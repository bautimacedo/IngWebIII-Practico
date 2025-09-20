<template>
  <v-app-bar color="primary" dark elevate-on-scroll>
    <v-toolbar-title class="font-weight-bold">
      🛒 Tienda Emergente
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn text :to="{ name: 'home' }">Inicio</v-btn>
    <v-btn text :to="{ name: 'productos' }">Productos</v-btn>
    <v-btn text :to="{ name: 'clientes' }">Clientes</v-btn>
    <v-btn v-if="!isAuthenticated" text :to="{ name: 'login' }">Login</v-btn>
    <v-btn v-else text @click="onLogout">Cerrar sesión</v-btn>
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
const { isAuthenticated } = storeToRefs(authStore)

function onLogout() {
  authStore.logout()
  router.push({ name: 'home' })
}
</script>
