<!-- src/components/TiendaPro.vue -->
<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar flat class="backdrop-blur-lg bg-gradient-to-r">
      <v-app-bar-title class="font-weight-bold">Listado <span class="text-primary">Productos</span></v-app-bar-title>

      <v-text-field
        v-model.trim="query"
        prepend-inner-icon="mdi-magnify"
        density="comfortable"
        hide-details
        class="mx-4"
        style="max-width: 420px"
        label="Buscar producto (Ej. Arroz)"
        @keyup.enter="doSearch"
        clearable
      />

      <v-switch
        inset
        class="mx-2"
        hide-details
        :label="isDark ? 'Dark' : 'Light'"
        :model-value="isDark"
        @update:model-value="toggleTheme"
      />

      <v-btn icon="mdi-cog-outline" variant="text" @click="openSettings = true" aria-label="Ajustes" />
    </v-app-bar>

    <!-- Fondo decorativo -->
    <div class="bg-deco" />

    <v-main>
      <v-container class="py-8" max-width="1200">
        <!-- Filtros rápidos -->
        <v-row class="mb-4" align="center">
          <v-col cols="12" md="8" class="d-flex gap-3 align-center">
            <v-chip
              :variant="onlyInStock ? 'elevated' : 'tonal'"
              color="success"
              prepend-icon="mdi-check-circle"
              @click="onlyInStock = !onlyInStock"
            >
              Solo disponibles
            </v-chip>

            <v-chip
              :variant="sortByPrice ? 'elevated' : 'tonal'"
              color="primary"
              prepend-icon="mdi-cash-multiple"
              @click="sortByPrice = !sortByPrice"
            >
              Ordenar por precio
            </v-chip>

            <v-chip
              :variant="highlightLowStock ? 'elevated' : 'tonal'"
              color="warning"
              prepend-icon="mdi-alert"
              @click="highlightLowStock = !highlightLowStock"
            >
              Resaltar bajo stock
            </v-chip>
          </v-col>

          <v-col cols="12" md="4" class="text-md-right">
            <v-btn color="primary" variant="elevated" @click="resetFilters" prepend-icon="mdi-filter-remove-outline">
              Limpiar filtros
            </v-btn>
          </v-col>
        </v-row>

        <!-- Estados de búsqueda -->
        <v-expand-transition>
          <v-alert
            v-if="query && !filteredProducts.length"
            type="error"
            variant="tonal"
            class="mb-6"
            title="Producto no encontrado"
            text="Probá con otro término o revisá acentos."
          />
        </v-expand-transition>

        <!-- Grilla de productos -->
        <v-row>
          <v-col
            v-for="p in filteredProducts"
            :key="p.id"
            cols="12" sm="6" md="4" lg="3"
          >
            <v-hover v-slot="{ isHovering, props }">
              <v-card
                v-bind="props"
                class="glass-card"
                :elevation="isHovering ? 16 : 8"
                rounded="xl"
              >
                <v-img
                  :src="p.image"
                  height="160"
                  cover
                  class="rounded-t-xl"
                >
                  <template #placeholder>
                    <div class="skeleton" />
                  </template>
                </v-img>

                <v-card-item>
                  <div class="d-flex align-center justify-space-between">
                    <div class="text-subtitle-1 font-weight-semibold">{{ p.name }}</div>
                    <div class="text-h6">{{ money(p.price) }}</div>
                  </div>

  <ul class="list-group" @add-to-cart="manejarCarrito">
    <!-- NO encontrado -->
    <li class="list-group-item bg-danger text-white" v-if="productoNoEncontrado">
      <p>Producto NO encontrado</p>
    </li>

    <!-- Encontrado SIN stock -->
    <li class="list-group-item" style="background-color: #ff9800;" v-else-if="productoEncontrado && stockCero">
      <p>Producto encontrado sin stock</p>
      {{ productoEncontrado.name }} - ${{ productoEncontrado.price }} (Stock: {{ productoEncontrado.stock }})
    </li>

    <!-- Encontrado CON stock -->
    <li class="list-group-item bg-success text-white" v-else-if="productoEncontrado" >
      <p>Producto encontrado</p>
      {{ productoEncontrado.name }} - ${{ productoEncontrado.price }} (Stock: {{ productoEncontrado.stock }})
        <button 
            class="btn btn-sm btn-primary"
            @click="agregarProductoCarrito(productoEncontrado.id)"
        >
            Agregar al carrito
        </button>
    </li>
  </ul>

    <h3>Lista completa de productos</h3>
  <ul class="list-group">
    <li class="list-group-item" v-for="product in products" :key="product.id">
      {{ product.name }} - ${{ product.price }} (Stock: {{ product.stock }})
    </li>
  </ul>

    <h3>Carrito</h3>
    <h5 v-if="carrito.length === 0">Carrito Vacio!</h5>

    <ul class="list-group">
        <li class="list-group-item" v-for="product in carrito" :key="product.id">
            {{ product.name }} - ${{ product.price }} × {{ product.cant }} unidades = ${{ product.total }}
            
            <button 
                class="btn btn-sm btn-primary"
                @click="eliminarProductoCarrito(product.id)"
            >
                -
            </button>

        </li>
    </ul>
</template>

<script setup>
import { ref } from 'vue'

const producto = ref('')
const productoEncontrado = ref(null)
const productoNoEncontrado = ref(false)
const stockCero = ref(false)

const products = ref([
  { id: 1, name: 'Arroz',   price: 10, stock: 10 },
  { id: 2, name: 'Lechuga', price: 5,  stock: 15 },
  { id: 3, name: 'Avena',   price: 20, stock: 100 },
  { id: 4, name: 'Tomate',   price: 15, stock: 0 } // probá este en 0 para ver el aviso naranja
])

const cart = ref([])

/* --------- Derivados --------- */
const filteredProducts = computed(() => {
  let arr = [...products.value]
  if (query.value) {
    const q = query.value.toLowerCase()
    arr = arr.filter(p => p.name.toLowerCase().includes(q))
  }
  if (onlyInStock.value) arr = arr.filter(p => p.stock > 0)
  if (sortByPrice.value) arr = arr.sort((a, b) => a.price - b.price)
  return arr
})

const cartCount = computed(() => cart.value.reduce((acc, i) => acc + i.cant, 0))
const subtotal = computed(() => cart.value.reduce((acc, i) => acc + i.total, 0))
const iva = computed(() => +(subtotal.value * 0.21).toFixed(2))
const total = computed(() => +(subtotal.value + iva.value).toFixed(2))

/* --------- Helpers --------- */
function productById(id) {
  return products.value.find(p => p.id === id)
}
function lowStock(p) {
  return p.stock > 0 && p.stock <= 5
}
function money(n) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(n)
}
function placeholder(i) {
  // pequeñas abstracciones para una imagen bonita de relleno
  const colors = ['8EC5FC, E0C3FC', 'FAD0C4, FAD0C4', 'A1C4FD, C2E9FB', 'FBC2EB, A6C1EE', 'FEE140, FA709A', '84FAB0, 8FD3F4']
  const c = colors[(i - 1) % colors.length]
  return `data:image/svg+xml;utf8,
  <svg xmlns='http://www.w3.org/2000/svg' width='600' height='360'>
    <defs>
      <linearGradient id='g' x1='0' x2='1'>
        <stop offset='0%' stop-color='#${c.split(',')[0].trim()}'/>
        <stop offset='100%' stop-color='#${c.split(',')[1].trim()}'/>
      </linearGradient>
    </defs>
    <rect width='100%' height='100%' fill='url(#g)'/>
    <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
      font-family='Inter, Roboto, Arial' font-size='36' fill='rgba(255,255,255,.9)'>Producto</text>
  </svg>`
}
function imageOf(id) {
  return productById(id)?.image
}

/* --------- Acciones --------- */
function doSearch() {
  // ya filtra reactivo, mostramos snack con feedback
  snackbarOpen('Búsqueda aplicada', 'mdi-magnify', 'primary')
}

function addToCart(id) {
  const p = productById(id)
  if (!p || p.stock === 0) return

  // stock
  p.stock -= 1

  // carrito
  const line = cart.value.find(i => i.id === id)
  if (line) {
    line.cant += 1
    line.total = +(line.cant * line.price).toFixed(2)
  } else {
    cart.value.push({ id: p.id, name: p.name, price: p.price, cant: 1, total: +p.price.toFixed(2) })
  }

  snackbarOpen(`${p.name} agregado`, 'mdi-cart-plus', 'success')
}

function decrement(id) {
  const line = cart.value.find(i => i.id === id)
  if (!line) return
  if (line.cant === 1) {
    removeLine(id)
    return
  }

  productoEncontrado.value = encontrado
  stockCero.value = encontrado.stock === 0
}

function agregarProductoCarrito(id){
    console.log("Se ha agregado un producto en el carrito id:", id)
    const producto = products.value.find(p => p.id === id)
    if (producto && producto.stock > 0) {
        producto.stock -= 1
    }
    const productoCarrito = carrito.value.find(p => p.id === id)
    if (productoCarrito){
        const cantidad = productoCarrito.cant
        productoCarrito.cant += 1
        productoCarrito.total = productoCarrito.cant * productoCarrito.price

    }else{
        const cant = 1
        const productoAgregar ={
                        id: producto.id,
                        name: producto.name,
                        price: producto.price, 
                        cant: cant, 
                        total: cant }
        carrito.value.push(productoAgregar)
    }
    buscarProducto()
}

function eliminarProductoCarrito(id){
   const productoCarrito = carrito.value.find(p => p.id === id)
   if(productoCarrito.cant === 1){
    carrito.value = carrito.value.filter(p => p.id !== id)
   }
   productoCarrito.cant -= 1 
   productoCarrito.total = productoCarrito.cant * productoCarrito.price
   const producto = products.value.find(p => p.id === id)
   producto.stock += 1
   
}
</script>