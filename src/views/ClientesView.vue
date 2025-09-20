<template>
  <v-container
    fluid
    class="pa-6 clientes-container"
    :class="dark ? 'clientes-dark' : 'clientes-light'"
  >
    <!-- Encabezado -->
    <div class="d-flex align-center justify-space-between mb-6">
      <h1 class="text-h4 font-weight-bold text-primary">Gestión de Clientes</h1>
      <v-switch
        v-model="dark"
        label="Modo oscuro"
        color="primary"
        inset
        hide-details
      />
    </div>

    <!-- Filtros -->
    <v-row class="mb-6">
      <v-col cols="12" md="4">
        <v-text-field
          v-model="search"
          label="Buscar cliente"
          variant="outlined"
          density="comfortable"
          prepend-inner-icon="mdi-magnify"
        />
      </v-col>
      <v-col cols="12" md="8" class="d-flex flex-wrap gap-2">
        <v-chip
          filter
          v-model="filters.activo"
          color="primary"
          text-color="white"
          class="ma-1"
        >
          Activos
        </v-chip>
        <v-chip
          filter
          v-model="filters.pendiente"
          color="secondary"
          text-color="white"
          class="ma-1"
        >
          Pendientes
        </v-chip>
        <v-chip
          filter
          v-model="filters.inactivo"
          color="grey"
          text-color="white"
          class="ma-1"
        >
          Inactivos
        </v-chip>
        <v-btn
          color="primary"
          variant="flat"
          class="ma-1"
          @click="resetFilters"
        >
          Limpiar filtros
        </v-btn>
        <v-spacer />
        <v-btn
          color="primary"
          prepend-icon="mdi-account-plus"
          @click="openDialog"
        >
          Nuevo Cliente
        </v-btn>
      </v-col>
    </v-row>

    <!-- Grid de clientes -->
    <v-row>
      <v-col
        v-for="c in filteredClientes"
        :key="c.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card
          class="pa-4 rounded-xl hover-elevate"
          :class="dark ? 'clientes-card-dark' : 'clientes-card-light'"
        >
          <div class="d-flex align-center mb-3">
            <v-avatar color="primary" size="48" class="mr-3">
              {{ initials(c.name) }}
            </v-avatar>
            <div>
              <div class="font-weight-bold text-subtitle-1">{{ c.name }}</div>
              <div class="text-caption text-medium-emphasis">{{ c.id }}</div>
            </div>
          </div>

          <v-list density="compact">
            <v-list-item :title="c.email" prepend-icon="mdi-email-outline" />
            <v-list-item :title="c.phone" prepend-icon="mdi-phone-outline" />
            <v-list-item :title="c.country" prepend-icon="mdi-earth" />
          </v-list>

          <div class="mt-2">
            <v-chip
              size="small"
              :color="statusColor(c.status)"
              text-color="white"
              class="font-weight-medium"
            >
              {{ c.status }}
            </v-chip>
          </div>

          <v-divider class="my-3" />

          <div class="d-flex justify-space-between">
            <v-btn
              color="primary"
              variant="text"
              prepend-icon="mdi-pencil"
              @click="editCliente(c)"
            >
              Editar
            </v-btn>
            <v-btn
              color="error"
              variant="tonal"
              prepend-icon="mdi-delete"
              @click="deleteCliente(c)"
            >
              Eliminar
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialogo de nuevo cliente -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title>Nuevo Cliente</v-card-title>
        <v-card-text>
          <v-form ref="formRef" v-model="valid">
            <v-text-field v-model="nuevo.name" label="Nombre" :rules="[rules.required]" />
            <v-text-field v-model="nuevo.email" label="Email" :rules="[rules.required, rules.email]" />
            <v-text-field v-model="nuevo.phone" label="Teléfono" />
            <v-text-field v-model="nuevo.country" label="País" />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="dialog = false">Cancelar</v-btn>
          <v-btn color="primary" :disabled="!valid" @click="guardarCliente">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'

const dark = ref(false)
const search = ref('')
const dialog = ref(false)
const valid = ref(false)
const formRef = ref(null)

const filters = ref({
  activo: false,
  pendiente: false,
  inactivo: false,
})

const clientes = ref([
  { id: 'CL-0001', name: 'Juan Pérez', email: 'juan@mail.com', phone: '+54 351 123456', country: 'Argentina', status: 'activo' },
  { id: 'CL-0002', name: 'Ana Gómez', email: 'ana@mail.com', phone: '+54 11 765432', country: 'Argentina', status: 'activo' },
  { id: 'CL-0003', name: 'Carlos López', email: 'carlos@mail.com', phone: '+56 2 112233', country: 'Chile', status: 'inactivo' },
  { id: 'CL-0004', name: 'Sara Díaz', email: 'sara@mail.com', phone: '+51 1 998877', country: 'Perú', status: 'activo' },
  { id: 'CL-0005', name: 'Mark Lee', email: 'mark@mail.com', phone: '+1 415 555 0101', country: 'USA', status: 'activo' },
])

const nuevo = ref({ name: '', email: '', phone: '', country: '', status: 'activo' })

const rules = {
  required: v => !!v || 'Requerido',
  email: v => /.+@.+\..+/.test(v) || 'Email inválido',
}

const filteredClientes = computed(() => {
  let result = clientes.value

  if (search.value) {
    const q = search.value.toLowerCase()
    result = result.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.country.toLowerCase().includes(q)
    )
  }

  const activeFilters = Object.keys(filters.value).filter(f => filters.value[f])
  if (activeFilters.length) {
    result = result.filter(c => activeFilters.includes(c.status))
  }

  return result
})

function statusColor(s) {
  return s === 'activo' ? 'primary' : s === 'pendiente' ? 'secondary' : 'grey'
}

function initials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
}

function resetFilters() {
  filters.value = { activo: false, pendiente: false, inactivo: false }
  search.value = ''
}

function openDialog() {
  dialog.value = true
}

function guardarCliente() {
  clientes.value.push({
    ...nuevo.value,
    id: `CL-${String(clientes.value.length + 1).padStart(4, '0')}`,
  })
  nuevo.value = { name: '', email: '', phone: '', country: '', status: 'activo' }
  dialog.value = false
}

function editCliente(c) {
  alert(`Editar cliente ${c.name} (acá podés abrir un diálogo similar al de crear)`)
}

function deleteCliente(c) {
  clientes.value = clientes.value.filter(x => x.id !== c.id)
}
</script>

<style scoped>
.clientes-container {
  min-height: 100vh;
  transition: background 0.3s;
}
.clientes-light {
  background: linear-gradient(135deg, #f6f9ff 0%, #eaf6ff 100%);
}
.clientes-dark {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  color: white;
}
.clientes-card-light {
  background: white;
}
.clientes-card-dark {
  background: #1e293b;
  color: white;
}
.hover-elevate:hover {
  transform: translateY(-3px);
  transition: 0.2s;
  box-shadow: 0px 6px 12px rgba(0,0,0,0.15);
}
</style>
