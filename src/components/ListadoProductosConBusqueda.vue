<!-- src/components/TiendaPro.vue -->
<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar flat class="backdrop-blur-lg bg-gradient-to-r">
      <v-app-bar-title class="font-weight-bold">Tienda <span class="text-primary">Pro</span></v-app-bar-title>

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
          role="button"
          tabindex="0"
          @click="verDetalle(p.id)"
          @keyup.enter.prevent="verDetalle(p.id)"
          @keyup.space.prevent="verDetalle(p.id)"
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

                  <div class="mt-2 d-flex gap-2">
                    <v-chip
                      v-if="p.stock > 0"
                      :color="lowStock(p) && highlightLowStock ? 'warning' : 'success'"
                      size="small"
                      variant="tonal"
                      prepend-icon="mdi-package-variant-closed"
                    >
                      Stock: {{ p.stock }}
                    </v-chip>
                    <v-chip
                      v-else
                      color="error"
                      size="small"
                      variant="tonal"
                      prepend-icon="mdi-close-octagon"
                    >
                      Sin stock
                    </v-chip>
                  </div>
                </v-card-item>

                <v-card-actions class="px-4 pb-4">
                <v-btn
                  :disabled="p.stock === 0"
                  color="primary"
                  block
                  size="large"
                  prepend-icon="mdi-cart-plus"
                  @click.stop="addToCart(p.id)"
                >
                  Agregar al carrito
                </v-btn>
              </v-card-actions>
            </v-card>
            </v-hover>
          </v-col>
        </v-row>
      </v-container>

      <!-- Botón flotante Carrito -->
      <v-fab
        app
        location="bottom end"
        size="large"
        color="primary"
        @click="drawer = true"
      >
        <v-badge :content="cartCount" color="error" v-if="cartCount > 0">
          <v-icon icon="mdi-cart-outline" size="28" />
        </v-badge>
        <template v-else>
          <v-icon icon="mdi-cart-outline" size="28" />
        </template>
      </v-fab>

      <!-- Drawer Carrito -->
      <v-navigation-drawer
        v-model="drawer"
        location="right"
        width="420"
        floating
        border="sm"
        class="glass-drawer"
      >
        <v-toolbar flat>
          <v-toolbar-title>Carrito</v-toolbar-title>
          <v-spacer />
          <v-btn icon="mdi-close" variant="text" @click="drawer = false" />
        </v-toolbar>

        <div class="px-4 pb-2" v-if="cart.length === 0">
          <v-alert type="info" variant="tonal" title="Carrito vacío" text="Agregá productos desde la grilla." />
        </div>

        <v-list v-else lines="two" class="pt-0">
          <v-list-item
            v-for="item in cart"
            :key="item.id"
            :title="item.name"
            :subtitle="`${money(item.price)} × ${item.cant} = ${money(item.total)}`"
          >
            <template #prepend>
              <v-avatar size="36" rounded="lg">
                <v-img :src="imageOf(item.id)" cover />
              </v-avatar>
            </template>

            <template #append>
              <div class="d-flex align-center gap-2">
                <v-btn icon="mdi-minus" size="30" variant="tonal" @click="decrement(item.id)" />
                <v-btn
                  icon="mdi-plus"
                  size="30"
                  variant="tonal"
                  :disabled="productById(item.id)?.stock === 0"
                  @click="addToCart(item.id)"
                />
                <v-btn icon="mdi-trash-can-outline" size="30" variant="text" color="error" @click="removeLine(item.id)" />
              </div>
            </template>
          </v-list-item>
        </v-list>

        <v-divider class="my-4" />

        <div class="px-4 pb-6" v-if="cart.length">
          <v-row>
            <v-col cols="6" class="text-medium-emphasis">Subtotal</v-col>
            <v-col cols="6" class="text-right">{{ money(subtotal) }}</v-col>

            <v-col cols="6" class="text-medium-emphasis">IVA (21%)</v-col>
            <v-col cols="6" class="text-right">{{ money(iva) }}</v-col>

            <v-col cols="6" class="text-subtitle-1 font-weight-bold">Total</v-col>
            <v-col cols="6" class="text-right text-subtitle-1 font-weight-bold">{{ money(total) }}</v-col>
          </v-row>

          <v-btn
            color="success"
            block
            size="large"
            class="mt-2"
            prepend-icon="mdi-credit-card-outline"
            @click="checkout"
          >
            Pagar
          </v-btn>
        </div>
      </v-navigation-drawer>
    </v-main>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.show" :timeout="2200" location="bottom right" :color="snackbar.color">
      <v-icon :icon="snackbar.icon" class="mr-2" />
      {{ snackbar.text }}
    </v-snackbar>

    <!-- Dialog ajustes -->
    <v-dialog v-model="openSettings" max-width="520">
      <v-card rounded="xl">
        <v-card-title class="text-h6">Ajustes de vista</v-card-title>
        <v-card-text>
          <v-switch v-model="highlightLowStock" color="warning" inset label="Resaltar bajo stock" />
          <v-switch v-model="onlyInStock" color="success" inset label="Mostrar solo disponibles" />
          <v-switch v-model="sortByPrice" color="primary" inset label="Ordenar por precio (asc)" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="openSettings = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from 'vuetify'

/* --------- Tema / Dark mode --------- */
const theme = useTheme()
const isDark = computed(() => theme.global.current.value.dark)
const toggleTheme = () => {
  theme.global.name.value = isDark.value ? 'light' : 'dark'
}

/* --------- Estado --------- */
const query = ref('')
const onlyInStock = ref(false)
const sortByPrice = ref(false)
const highlightLowStock = ref(true)
const drawer = ref(false)
const openSettings = ref(false)
const router = useRouter()

const products = ref([
  { id: 1, name: 'Arroz',   price: 10, stock: 10, image: placeholder(1) },
  { id: 2, name: 'Lechuga', price: 5,  stock: 15, image: placeholder(2) },
  { id: 3, name: 'Avena',   price: 20, stock: 100, image: placeholder(3) },
  { id: 4, name: 'Tomate',  price: 15, stock: 0, image: placeholder(4) },
  { id: 5, name: 'Aceite',  price: 35, stock: 7, image: placeholder(5) },
  { id: 6, name: 'Yerba',   price: 22, stock: 3, image: placeholder(6) },
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

function verDetalle(id) {
  router.push({ name: 'producto-detalle', params: { id } })
}

function decrement(id) {
  const line = cart.value.find(i => i.id === id)
  if (!line) return
  if (line.cant === 1) {
    removeLine(id)
    return
  }
  line.cant -= 1
  line.total = +(line.cant * line.price).toFixed(2)
  const p = productById(id)
  if (p) p.stock += 1
}

function removeLine(id) {
  const line = cart.value.find(i => i.id === id)
  if (!line) return
  const p = productById(id)
  if (p) p.stock += line.cant
  cart.value = cart.value.filter(i => i.id !== id)
}

function resetFilters() {
  query.value = ''
  onlyInStock.value = false
  sortByPrice.value = false
  highlightLowStock.value = true
}

function checkout() {
  snackbarOpen('Compra realizada (demo)', 'mdi-credit-card-outline', 'primary')
}

/* --------- Snackbar --------- */
const snackbar = reactive({ show: false, text: '', icon: 'mdi-check', color: 'success' })
function snackbarOpen(text, icon = 'mdi-check', color = 'success') {
  Object.assign(snackbar, { show: false })
  requestAnimationFrame(() => Object.assign(snackbar, { show: true, text, icon, color }))
}
</script>

<style scoped>
/* Fondo degradado sutil + blur (glassmorphism) */
.bg-deco {
  position: fixed;
  inset: -10% -10% auto -10%;
  height: 42vh;
  z-index: 0;
  background:
    radial-gradient(30% 40% at 20% 30%, rgba(99,102,241,.25), transparent 60%),
    radial-gradient(25% 35% at 80% 20%, rgba(236,72,153,.22), transparent 55%),
    radial-gradient(30% 40% at 50% 80%, rgba(34,197,94,.18), transparent 60%);
  filter: blur(40px);
  pointer-events: none;
}

.bg-gradient-to-r {
  background: linear-gradient(90deg, rgba(99,102,241,.20), rgba(236,72,153,.10));
}

.glass-card {
  background: rgba(255,255,255,0.65);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.35);
  cursor: pointer;
}
:deep(.v-theme--dark) .glass-card {
  background: rgba(30,30,36,0.45);
  border-color: rgba(255,255,255,0.06);
}

.glass-drawer {
  background: rgba(255,255,255,0.72) !important;
  backdrop-filter: blur(12px);
  border-left: 1px solid rgba(0,0,0,0.06) !important;
}
:deep(.v-theme--dark) .glass-drawer {
  background: rgba(22,22,28,0.6) !important;
}

/* skeleton para imágenes */
.skeleton {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, rgba(255,255,255,.15), rgba(255,255,255,.35), rgba(255,255,255,.15));
  animation: pulse 1.2s infinite ease-in-out;
}
@keyframes pulse {
  0% { transform: translateX(-20%); opacity:.8; }
  50% { opacity: 1; }
  100% { transform: translateX(20%); opacity:.8; }
}

/* utilidades */
.text-right { text-align: right; }
.gap-2 { gap: .5rem; }
.gap-3 { gap: .75rem; }
</style>
