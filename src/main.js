import { createApp } from 'vue'
import App from './App.vue'
import router from './router'   // 👈 importa el router

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
})

const app = createApp(App)

app.use(router)   // 👈 activa Vue Router
app.use(vuetify) // 👈 activa Vuetify

app.mount('#app')
