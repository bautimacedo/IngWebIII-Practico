import { ref, computed } from 'vue'
import { login as svcLogin, logout as svcLogout, saveSession, readSession } from '@/services/authService'

const userEmail = ref('')
const token = ref('')

export function useAuth() {
  // restaura una vez cuando se importe
  if (!token.value) {
    const s = readSession()
    if (s) { token.value = s.token; userEmail.value = s.email || '' }
  }

  const isAuthenticated = computed(() => !!token.value)

  async function login(email, password) {
    const res = await svcLogin({ email, password })
    token.value = res.token
    userEmail.value = res.email
    saveSession(res)
  }

  function logout() {
    token.value = ''
    userEmail.value = ''
    svcLogout()
  }

  return { isAuthenticated, userEmail, login, logout }
}
