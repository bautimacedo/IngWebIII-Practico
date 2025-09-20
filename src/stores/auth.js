import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('auth_token') || '')
  const email = ref(localStorage.getItem('auth_email') || '')

  const isAuthenticated = computed(() => Boolean(token.value))

  function setSession({ token: newToken, email: newEmail }) {
    token.value = newToken || ''
    email.value = newEmail || ''

    if (token.value) {
      localStorage.setItem('auth_token', token.value)
      if (email.value) {
        localStorage.setItem('auth_email', email.value)
      } else {
        localStorage.removeItem('auth_email')
      }
    } else {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_email')
    }
  }

  function logout() {
    setSession({ token: '', email: '' })
  }

  return {
    token,
    email,
    isAuthenticated,
    setSession,
    logout,
  }
})
