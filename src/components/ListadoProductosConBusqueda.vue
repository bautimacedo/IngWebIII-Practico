<!-- src/components/TiendaPro.vue -->
<template>
  <v-app>
    <!-- App Bar simple -->
    <v-app-bar color="primary" dark flat>
      <v-app-bar-title class="font-weight-bold">
        Tienda <span class="text-white">Emergente</span>
      </v-app-bar-title>

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

      <!-- Botón Carrito (abre el panel) -->
      <v-btn icon @click="drawer = true" aria-label="Carrito">
        <v-badge :content="cart.count" color="error" v-if="cart.count > 0">
          <v-icon icon="mdi-cart-outline" />
        </v-badge>
        <template v-else>
          <v-icon icon="mdi-cart-outline" />
        </template>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container class="py-6" max-width="1180">
        <!-- Filtros sencillos -->
        <v-row class="mb-4" align="center">
          <v-col cols="12" md="8" class="d-flex gap-2 align-center">
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
          </v-col>
        </v-row>

        <!-- Resultado vacío -->
        <v-expand-transition>
          <v-alert
            v-if="query && !filteredProducts.length"
            type="info"
            variant="tonal"
            class="mb-6"
            title="Sin resultados"
            text="No encontramos productos con ese término."
          />
        </v-expand-transition>

        <!-- Grilla de productos (cards más chicas) -->
        <v-row>
          <v-col
            v-for="p in filteredProducts"
            :key="p.id"
            cols="12" sm="6" md="4" lg="3"
          >
            <v-card class="product-card" elevation="6" rounded="xl">
              <v-img
                :src="p.image"
                height="120"
                cover
                class="rounded-t-xl cursor-pointer"
                @click="verDetalle(p.id)"
              />

              <v-card-item class="py-2">
                <div class="d-flex align-center justify-space-between">
                  <div
                    class="text-subtitle-1 font-weight-medium cursor-pointer"
                    @click="verDetalle(p.id)"
                  >
                    {{ p.name }}
                  </div>
                  <div class="text-subtitle-1">{{ money(p.price) }}</div>
                </div>

                <div class="mt-1">
                  <v-chip
                    v-if="p.stock > 0"
                    :color="lowStock(p) ? 'warning' : 'success'"
                    size="x-small"
                    variant="tonal"
                    prepend-icon="mdi-package-variant-closed"
                  >
                    Stock: {{ p.stock }}
                  </v-chip>
                  <v-chip
                    v-else
                    color="error"
                    size="x-small"
                    variant="tonal"
                    prepend-icon="mdi-close-octagon"
                  >
                    Sin stock
                  </v-chip>
                </div>
              </v-card-item>

              <v-card-actions class="px-3 pb-3">
                <v-btn
                  :disabled="p.stock === 0"
                  color="primary"
                  block
                  size="large"
                  prepend-icon="mdi-cart-plus"
                  @click="cart.add(p.id)"
                >
                  Agregar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <!-- Drawer Carrito -->
      <v-navigation-drawer
        v-model="drawer"
        location="right"
        width="420"
        border="sm"
      >
        <v-toolbar flat>
          <v-toolbar-title>Carrito</v-toolbar-title>
          <v-spacer />
          <v-btn icon="mdi-close" variant="text" @click="drawer = false" />
        </v-toolbar>

        <div class="px-4 pb-2" v-if="cart.items.length === 0">
          <v-alert type="info" variant="tonal" title="Carrito vacío" text="Agregá productos desde la lista." />
        </div>

        <v-list v-else lines="two" class="pt-0">
          <v-list-item
            v-for="item in cart.items"
            :key="item.id"
            :title="item.name"
            :subtitle="lineSubtitle(item)"
          >
            <template #prepend>
              <v-avatar size="36" rounded="lg">
                <v-img :src="imageOf(item.id)" cover />
              </v-avatar>
            </template>

            <template #append>
              <div class="d-flex align-center gap-2">
                <v-btn
                  icon="mdi-minus"
                  size="30"
                  variant="tonal"
                  @click="cart.decrement(item.id)"
                />
                <v-btn
                  icon="mdi-plus"
                  size="30"
                  variant="tonal"
                  :disabled="productById(item.id)?.stock === 0"
                  @click="cart.add(item.id)"
                />
                <v-btn
                  icon="mdi-trash-can-outline"
                  size="30"
                  variant="text"
                  color="error"
                  @click="cart.remove(item.id)"
                />
              </div>
            </template>
          </v-list-item>
        </v-list>

        <v-divider class="my-4" />

        <div class="px-4 pb-6" v-if="cart.items.length">
          <v-row>
            <v-col cols="6" class="text-medium-emphasis">Subtotal</v-col>
            <v-col cols="6" class="text-right">{{ money(cart.subtotal) }}</v-col>

            <v-col cols="6" class="text-medium-emphasis">IVA (21%)</v-col>
            <v-col cols="6" class="text-right">{{ money(cart.iva) }}</v-col>

            <v-col cols="6" class="text-subtitle-1 font-weight-bold">Total</v-col>
            <v-col cols="6" class="text-right text-subtitle-1 font-weight-bold">
              {{ money(cart.total) }}
            </v-col>
          </v-row>

          <v-btn
            color="success"
            block
            size="large"
            class="mt-2"
            prepend-icon="mdi-credit-card-outline"
            @click="checkout"
          >
            Finalizar compra
          </v-btn>
        </div>
      </v-navigation-drawer>
    </v-main>

    <v-snackbar v-model="snackbar.show" :timeout="2000" location="bottom right" :color="snackbar.color">
      <v-icon :icon="snackbar.icon" class="mr-2" />
      {{ snackbar.text }}
    </v-snackbar>
  </v-app>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import ProductsDB from '../stores/Productos'
import { useCartStore } from '../stores/cart' // <-- store global del carrito

const query = ref('')
const onlyInStock = ref(false)
const sortByPrice = ref(false)
const drawer = ref(false)
const router = useRouter()

const cart = useCartStore()

const filteredProducts = computed(() => {
  let arr = [...ProductsDB.all()]
  if (query.value) {
    const q = query.value.toLowerCase()
    arr = arr.filter(p => p.name.toLowerCase().includes(q))
  }
  if (onlyInStock.value) arr = arr.filter(p => p.stock > 0)
  if (sortByPrice.value) arr = arr.sort((a, b) => a.price - b.price)
  return arr
})

function productById(id) {
  return ProductsDB.byId(id)
}
function imageOf(id) {
  return ProductsDB.byId(id)?.image
}
function lowStock(p) {
  return p.stock > 0 && p.stock <= 5
}
function money(n) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(n)
}
function lineSubtitle(item) {
  return `${money(item.price)} × ${item.cant} = ${money(item.total)}`
}

function doSearch() {
  snackbarOpen('Búsqueda aplicada', 'mdi-magnify', 'primary')
}
function verDetalle(id) {
  router.push({ name: 'producto-detalle', params: { id } })
}
function checkout() {
  snackbarOpen('Compra realizada (demo)', 'mdi-credit-card-outline', 'success')
}

const snackbar = reactive({ show: false, text: '', icon: 'mdi-check', color: 'success' })
function snackbarOpen(text, icon = 'mdi-check', color = 'success') {
  Object.assign(snackbar, { show: false })
  requestAnimationFrame(() => Object.assign(snackbar, { show: true, text, icon, color }))
}
</script>

<style scoped>
.product-card {
  background: white;
}
.cursor-pointer { cursor: pointer; }
.text-right { text-align: right; }
.gap-2 { gap: .5rem; }
</style>
