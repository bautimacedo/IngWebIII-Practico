export async function login({ email, password }) {
  await new Promise(r => setTimeout(r, 600))
  if (email === 'user@test.com' && password === '123456') {
    const token = 'FAKE_TOKEN_123'
    return { token, email }
  }
  const err = new Error('Credenciales inválidas')
  err.code = 'INVALID_CREDENTIALS'
  throw err
}

export function logout() {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('auth_email')
}

export function saveSession({ token, email }) {
  localStorage.setItem('auth_token', token)
  localStorage.setItem('auth_email', email)
}

export function readSession() {
  const token = localStorage.getItem('auth_token')
  const email = localStorage.getItem('auth_email')
  return token ? { token, email } : null
}
