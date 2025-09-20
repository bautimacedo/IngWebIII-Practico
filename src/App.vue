<template>
  <div>
    <!-- Si NO hay sesión: Login -->
    <LoginView v-if="!isAuthenticated" @success="onLoginOk" />

    <!-- Si hay sesión: layout + tu vista -->
    <div v-else>
      <header style="display:flex;justify-content:space-between;align-items:center;padding:10px;border-bottom:1px solid #eee">
        <span>Sesión: <strong>{{ userEmail }}</strong></span>
        <button @click="onLogout">Salir</button>
      </header>

      <!-- Reemplazá por tu vista principal -->
      <ListadoProductosConBusqueda />
    </div>
  </div>
</template>

<script setup>
import LoginView from './views/LoginView.vue'
import ListadoProductosConBusqueda from './components/ListadoProductosConBusqueda.vue'
import { useAuth } from '@/composables/useAuth'

const { isAuthenticated, userEmail, logout } = useAuth()

function onLoginOk() {
  // no hace falta nada: el composable ya guardó sesión y reacciona isAuthenticated
}

function onLogout() {
  logout()
}
</script>
