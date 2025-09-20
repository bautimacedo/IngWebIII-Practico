import { createApp } from 'vue'
import App from './App.vue'

// Vuetify (solo si lo usás)
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({ components, directives })

createApp(App)
  .use(vuetify) // si no usás Vuetify, sacá esta línea
  .mount('#app')
