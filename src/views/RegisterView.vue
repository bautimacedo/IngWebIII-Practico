<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card elevation="8" class="pa-6" rounded="lg">
          <v-card-title class="text-h5 font-weight-bold pb-2">
            Registrarse
          </v-card-title>
          <v-card-subtitle class="text-body-2 pb-4">
            Completá tus datos para crear una cuenta
          </v-card-subtitle>

          <v-form v-model="isValid" @submit.prevent="onSubmit">
            <v-text-field
              v-model="name"
              label="Nombre"
              prepend-inner-icon="mdi-account-outline"
              :rules="[rules.required, rules.min3]"
              variant="outlined"
              density="comfortable"
              :disabled="loading"
            />

            <v-text-field
              v-model="email"
              label="Email"
              type="email"
              prepend-inner-icon="mdi-email-outline"
              :rules="[rules.required, rules.email]"
              variant="outlined"
              density="comfortable"
              :disabled="loading"
            />

            <v-text-field
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              label="Contraseña"
              prepend-inner-icon="mdi-lock-outline"
              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="showPassword = !showPassword"
              :rules="[rules.required, rules.min6]"
              variant="outlined"
              density="comfortable"
              :disabled="loading"
            />

            <v-alert
              v-if="error"
              type="error"
              variant="tonal"
              density="compact"
              class="mb-3"
            >
              {{ error }}
            </v-alert>

            <v-btn
              type="submit"
              color="primary"
              size="large"
              block
              rounded="lg"
              :loading="loading"
              :disabled="!isValid || loading"
            >
              Registrarse
            </v-btn>

            <div class="text-center mt-4">
              <RouterLink :to="{ name: 'login' }">¿Ya tenés cuenta? Iniciá sesión</RouterLink>
            </div>
          </v-form>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="success.show" :timeout="2500" color="success">
      {{ success.msg }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const name = ref('')
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isValid = ref(false)
const loading = ref(false)
const error = ref('')
const success = ref({ show: false, msg: '' })
const router = useRouter()
const authStore = useAuthStore()

const rules = {
  required: v => !!v || 'Campo obligatorio',
  min3: v => (v?.length >= 3) || 'Mínimo 3 caracteres',
  email: v => /.+@.+\..+/.test(v) || 'Email inválido',
  min6: v => (v?.length >= 6) || 'Mínimo 6 caracteres',
}

function getUsers() {
  return JSON.parse(localStorage.getItem('users') || '[]')
}

function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users))
}


async function onSubmit() {
  error.value = ''
  if (!isValid.value || loading.value) return

  loading.value = true
  try {
    const users = getUsers()

    // validar que no exista
    if (users.find(u => u.email === email.value)) {
      throw new Error('Ya existe un usuario con ese email')
    }

    const newUser = { name: name.value, email: email.value, password: password.value }
    users.push(newUser)
    saveUsers(users)

    // log para simular guardado
    console.log('Usuario guardado:', newUser)

    // guardar sesión
    const session = { token: 'FAKE_TOKEN_' + Date.now(), email: newUser.email }
    authStore.setSession(session)

    // mostrar mensaje de bienvenida
    success.value = { show: true, msg: `Bienvenido, ${newUser.name}! 👋` }

    // redirigir a home
    setTimeout(() => router.push({ name: 'home' }), 1800)
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
}
</style>
