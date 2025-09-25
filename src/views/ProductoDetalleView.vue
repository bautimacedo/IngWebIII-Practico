<template>
  <v-container class="py-6">
    <!-- Botón volver -->
    <v-btn
      variant="text"
      prepend-icon="mdi-arrow-left"
      @click="volver"
    >
      Volver
    </v-btn>

    <!-- Loading -->
    <div v-if="cargando" class="mt-6">
      <v-skeleton-loader type="image, heading, paragraph" />
    </div>

    <!-- No encontrado -->
    <v-alert
      v-else-if="!producto"
      type="error"
      variant="tonal"
      class="mt-6"
    >
      Producto no encontrado
    </v-alert>

    <!-- Detalle -->
    <v-card
      v-else
      class="mt-6 pa-4"
      elevation="6"
      rounded="xl"
    >
      <!-- Imagen -->
      <v-img
        v-if="producto.image"
        :src="producto.image"
        height="260"
        cover
        class="rounded-lg mb-4"
      >
        <template #placeholder>
          <v-skeleton-loader type="image" />
        </template>
      </v-img>

      <!-- Info -->
      <v-card-title class="text-h5 font-weight-bold">
        {{ producto.name }}
      </v-card-title>

      <v-card-text class="d-flex flex-column gap-2">
        <div><strong>ID:</strong> {{ producto.id }}</div>
        <div>
          <strong>Precio:</strong>
          <span class="text-primary">{{ formatoPrecio(producto.price) }}</span>
        </div>
        <div v-if="producto.stock !== undefined">
          <strong>Stock:</strong>
          <v-chip
            :color="producto.stock > 0 ? 'success' : 'error'"
            text-color="white"
            size="small"
            class="ml-1"
          >
            {{ producto.stock > 0 ? producto.stock + ' disponibles' : 'Sin stock' }}
          </v-chip>
        </div>
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

watch(() => props.id, cargar, { immediate: true })

function volver() {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push({ name: 'productos' })
  }
}

function formatoPrecio(v) {
  try {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(v)
  } catch {
    return `$${v}`
  }
}
</script>

<style scoped>
.gap-2 {
  gap: 0.5rem;
}
</style>
