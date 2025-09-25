<template>
  <v-container class="py-6">
    <!-- Encabezado -->
    <div class="d-flex align-center justify-space-between mb-6">
      <h1 class="text-h5 font-weight-bold">Gestión de Clientes</h1>
      <v-btn color="primary" prepend-icon="mdi-account-plus" @click="openDialog">
        Nuevo Cliente
      </v-btn>
    </div>

    <!-- Filtros -->
    <v-row class="mb-4">
      <v-col cols="12" md="4">
        <v-text-field
          v-model="search"
          label="Buscar cliente"
          variant="outlined"
          prepend-inner-icon="mdi-magnify"
          clearable
        />
      </v-col>
      <v-col cols="12" md="8" class="d-flex gap-2 align-center">
        <v-chip filter v-model="filters.activo" color="primary" text-color="white">
          Activos
        </v-chip>
        <v-chip filter v-model="filters.inactivo" color="grey" text-color="white">
          Inactivos
        </v-chip>
        <v-btn text @click="resetFilters">Limpiar</v-btn>
      </v-col>
    </v-row>

    <!-- Lista de clientes -->
    <v-row>
      <v-col
        v-for="c in filteredClientes"
        :key="c.id"
        cols="12" sm="6" md="4"
      >
        <v-card class="pa-4">
          <div class="mb-2 font-weight-bold">{{ c.name }}</div>
          <div class="text-caption mb-1">{{ c.email }}</div>
          <div class="text-caption mb-1">{{ c.phone }}</div>
          <div class="text-caption mb-2">{{ c.country }}</div>
          <v-chip size="small" :color="statusColor(c.status)" text-color="white">
            {{ c.status }}
          </v-chip>

          <v-divider class="my-3" />

          <div class="d-flex justify-space-between">
            <v-btn size="small" variant="text" @click="editCliente(c)">
              Editar
            </v-btn>
            <v-btn size="small" color="error" variant="tonal" @click="deleteCliente(c)">
              Eliminar
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Diálogo de nuevo cliente -->
    <v-dialog v-model="dialog" max-width="400">
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
          <v-btn color="primary" :disabled="!valid" @click="guardarCliente">
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'

const search = ref('')
const dialog = ref(false)
const valid = ref(false)
const formRef = ref(null)

const filters = ref({
  activo: false,
  inactivo: false,
})

const clientes = ref([
  { id: 'CL-0001', name: 'Juan Pérez', email: 'juan@mail.com', phone: '+54 351 123456', country: 'Argentina', status: 'activo' },
  { id: 'CL-0002', name: 'Ana Gómez', email: 'ana@mail.com', phone: '+54 11 765432', country: 'Argentina', status: 'activo' },
  { id: 'CL-0003', name: 'Carlos López', email: 'carlos@mail.com', phone: '+56 2 112233', country: 'Chile', status: 'inactivo' },
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
  return s === 'activo' ? 'primary' : 'grey'
}

function resetFilters() {
  filters.value = { activo: false, inactivo: false }
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
  alert(`Editar cliente: ${c.name}`)
}

function deleteCliente(c) {
  clientes.value = clientes.value.filter(x => x.id !== c.id)
}
</script>
