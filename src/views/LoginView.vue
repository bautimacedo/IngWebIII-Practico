<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card elevation="10" class="pa-6" rounded="xl">
          <v-card-title class="text-h5 font-weight-medium pb-1">
            Iniciar sesión
          </v-card-title>
          <v-card-subtitle class="text-body-2 pb-4">
            Usá tu email y contraseña para ingresar.
          </v-card-subtitle>

          <v-form v-model="isValid" @submit.prevent="onSubmit">
            <!-- Email -->
            <v-text-field
              v-model.trim="email"
              label="Email"
              type="email"
              autocomplete="username"
              :rules="[rules.required, rules.email]"
              required
              variant="outlined"
              density="comfortable"
              :disabled="loading"
            />

            <!-- Password -->
            <v-text-field
              v-model.trim="password"
              :type="showPassword ? 'text' : 'password'"
              label="Contraseña"
              autocomplete="current-password"
              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="showPassword = !showPassword"
              :rules="[rules.required, rules.min6]"
              required
              variant="outlined"
              density="comfortable"
              :disabled="loading"
            />

            <!-- Error de credenciales -->
            <v-alert
              v-if="submitError"
              type="error"
              variant="tonal"
              class="mt-2"
              density="comfortable"
            >
              {{ submitError }}
            </v-alert>

            <!-- Botón -->
            <v-btn
              class="mt-4"
              color="primary"
              size="large"
              type="submit"
              block
              rounded="lg"
              :loading="loading"
              :disabled="!isValid || loading"
            >
              Ingresar
            </v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

/**
 * Estado
 */
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isValid = ref(false)
const loading = ref(false)
const submitError = ref('')

/**
 * Reglas de validación (Vuetify usa funciones truthy / mensaje)
 */
const rules = {
  required: v => (!!v && String(v).trim().length > 0) || 'Este campo es obligatorio',
  email: v => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(String(v || '')) || 'Formato de email inválido'
  },
  min6: v => (String(v || '').length >= 6) || 'Mínimo 6 caracteres',
}

/**
 * Mock de autenticación (reemplazá por tu servicio real)
 */
async function loginMock({ email, password }) {
  await new Promise(r => setTimeout(r, 700)) // delay para UX
  const okEmail = 'user@test.com'
  const okPass = '123456'
  if (email === okEmail && password === okPass) {
    const token = 'FAKE_TOKEN_123'
    // Persistencia mínima
    localStorage.setItem('auth_token', token)
    localStorage.setItem('auth_email', email)
    return { token, email }
  }
  const err = new Error('Credenciales inválidas')
  err.code = 'INVALID_CREDENTIALS'
  throw err
}

/**
 * Submit
 */
const router = useRouter()
const authStore = useAuthStore()

async function onSubmit() {
  submitError.value = ''

  // Si el form no es válido, Vuetify ya bloquea el botón, pero chequeamos igual
  if (!isValid.value || loading.value) return

  loading.value = true
  try {
    const session = await loginMock({ email: email.value, password: password.value })
    authStore.setSession(session)
    router.push({ name: 'home' })
  } catch (e) {
    submitError.value = e?.message || 'No se pudo iniciar sesión'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Pequeño ajuste para centrado vertical en pantallas bajas */
.fill-height {
  min-height: 100vh;
}
</style>
