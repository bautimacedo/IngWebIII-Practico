// src/services/authService.js
function getUsers() {
  return JSON.parse(localStorage.getItem('users') || '[]')
}

function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users))
}

// 🔹 Registro: solo guarda el usuario
export async function register({ name, email, password }) {
  await new Promise(r => setTimeout(r, 400))

  const users = getUsers()

  if (users.find(u => u.email === email)) {
    const err = new Error('El email ya está registrado')
    err.code = 'EMAIL_EXISTS'
    throw err
  }

  const newUser = { name, email, password }
  users.push(newUser)
  saveUsers(users)

  // 👇 NO hacemos login automático
  return { success: true, email }
}

// 🔹 Login: busca en la lista de usuarios
export async function login({ email, password }) {
  await new Promise(r => setTimeout(r, 400))

  const users = getUsers()
  const user = users.find(u => u.email === email && u.password === password)

  if (!user) {
    const err = new Error('Credenciales inválidas')
    err.code = 'INVALID_CREDENTIALS'
    throw err
  }

  const token = 'FAKE_TOKEN_' + Date.now()
  saveSession({ token, email })
  return { token, email, name: user.name }
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
