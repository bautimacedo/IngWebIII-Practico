<template>
  <v-container class="py-6">
    <v-btn variant="text" prepend-icon="mdi-arrow-left" @click="volver">
      Volver
    </v-btn>

    <!-- Loading -->
    <div v-if="cargando" class="mt-4">
      <v-skeleton-loader type="heading, paragraph, paragraph" />
    </div>

    <!-- No encontrado -->
    <v-alert v-else-if="!producto" type="error" variant="tonal" class="mt-4">
      Producto no encontrado
    </v-alert>

    <!-- Detalle -->
    <v-card v-else class="mt-4" elevation="6" rounded="xl">
      <v-card-title class="text-h6">{{ producto.nombre }}</v-card-title>
      <v-card-text>
        <div><strong>ID:</strong> {{ producto.id }}</div>
        <div><strong>Precio:</strong> {{ formatoPrecio(producto.precio) }}</div>
        <div class="mt-2">{{ producto.descripcion }}</div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  id: { type: [String, Number], required: true } // ✅ acepta ambos tipos
})
const router = useRouter()

const cargando = ref(true)
const producto = ref(null)

// MOCK (reemplazá por tu servicio real)
async function getProductoByIdMock(id) {
  const data = [
    { id: '1', nombre: 'Mouse Gamer',    precio: 19999, descripcion: 'RGB, 6 botones' },
    { id: '2', nombre: 'Teclado Mecánico', precio: 45999, descripcion: 'Switches Blue' },
  ]
  await new Promise(r => setTimeout(r, 300))
  return data.find(p => String(p.id) === String(id)) || null
}

async function cargar() {
  cargando.value = true
  const p = await getProductoByIdMock(props.id)
  producto.value = p
  cargando.value = false
}

// Recarga si cambia el :id
watch(() => props.id, cargar, { immediate: true })

function volver() {
  // Si hay historial, back; si no, ir a /productos
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push({ name: 'productos' })
  }
}

// Opcional: formato de precio (ARS)
function formatoPrecio(v) {
  try {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(v)
  } catch {
    return `$${v}`
  }
}
</script>
