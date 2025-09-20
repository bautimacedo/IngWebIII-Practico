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
      <v-img
        v-if="producto.image"
        :src="producto.image"
        height="240"
        cover
        class="rounded-t-xl"
      />

      <v-card-title class="text-h6">{{ producto.name }}</v-card-title>
      <v-card-text class="d-flex flex-column gap-2">
        <div><strong>ID:</strong> {{ producto.id }}</div>
        <div><strong>Precio:</strong> {{ formatoPrecio(producto.price) }}</div>
        <div v-if="producto.stock !== undefined"><strong>Stock disponible:</strong> {{ producto.stock }}</div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import ProductsDB from '@/stores/Productos.js'

const props = defineProps({
  id: { type: [String, Number], required: true },
})

const router = useRouter()

const cargando = ref(true)
const producto = ref(null)

function normalizarId(valor) {
  const num = Number(valor)
  return Number.isNaN(num) ? valor : num
}

function cargar() {
  cargando.value = true
  const encontrado = ProductsDB.byId(normalizarId(props.id))
  producto.value = encontrado || null
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
