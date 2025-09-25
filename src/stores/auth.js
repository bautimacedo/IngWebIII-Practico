// src/stores/auth.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as authService from '@/services/authService'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(null)
  const user = ref(null)

  const isAuthenticated = computed(() => !!token.value)

  // Inicializar sesión desde localStorage al cargar
  function init() {
    const session = authService.readSession()
    if (session) {
      token.value = session.token
      user.value = { email: session.email }
    }
  }

  function setSession(session) {
    token.value = session.token
    user.value = { email: session.email }
    authService.saveSession(session)
  }

  function logout() {
    token.value = null
    user.value = null
    authService.logout()
  }

  return {
    token,
    user,
    isAuthenticated,
    init,
    setSession,
    logout,
  }
})
