<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar color="primary" dark>
      <v-app-bar-title class="font-weight-bold">
        Busca tu producto ideal
      </v-app-bar-title>

      <v-spacer />

      <v-text-field
        v-model.trim="query"
        prepend-inner-icon="mdi-magnify"
        hide-details
        dense
        style="max-width: 250px"
        label="Buscar producto"
        clearable
      />
    </v-app-bar>

    <v-main>
      <v-container class="py-6">
        <!-- DISPLAY DE PRODUCTOS -->
        <v-row>
          <v-col
            v-for="p in filteredProducts"
            :key="p.id"
            cols="12"
            sm="4"
            md="3"
          >
            <v-card rounded="lg" elevation="4" class="mb-4">
              <v-img
                :src="p.image"
                height="120"
                cover
                class="rounded-t-lg"
              />

              <v-card-title class="text-subtitle-1">
                {{ p.name }}
              </v-card-title>

              <v-card-text>
                <div><strong>Precio:</strong> {{ money(p.price) }}</div>
                <div>
                  <strong>Stock:</strong>
                  <span :class="p.stock > 0 ? 'text-success' : 'text-error'">
                    {{ p.stock > 0 ? p.stock : 'Sin stock' }}
                  </span>
                </div>
              </v-card-text>

              <v-card-actions>
                <v-btn
                  color="primary"
                  block
                  size="small"
                  :disabled="p.stock === 0"
                  @click="addToCart(p.id)"
                  prepend-icon="mdi-cart-plus"
                >
                  Agregar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <!-- Carrito -->
        <v-divider class="my-6" />
        <h2 class="text-h6 mb-3">Carrito</h2>

        <div v-if="!cart.length">
          <v-alert type="info" variant="tonal">El carrito está vacío</v-alert>
        </div>

        <v-list v-else>
          <v-list-item
            v-for="item in cart"
            :key="item.id"
            :title="item.name"
            :subtitle="`${money(item.price)} × ${item.cant} = ${money(item.total)}`"
          >
            <template #append>
              <div class="d-flex align-center gap-2">
                <v-btn
                  icon="mdi-minus"
                  size="small"
                  variant="tonal"
                  @click="decrement(item.id)"
                />
                <span class="px-2">{{ item.cant }}</span>
                <v-btn
                  icon="mdi-plus"
                  size="small"
                  variant="tonal"
                  :disabled="productById(item.id)?.stock === 0"
                  @click="addToCart(item.id)"
                />
                <v-btn
                  icon="mdi-delete"
                  size="small"
                  variant="text"
                  color="error"
                  @click="removeLine(item.id)"
                />
              </div>
            </template>
          </v-list-item>
        </v-list>

        <v-divider class="my-3" v-if="cart.length" />

        <div v-if="cart.length" class="d-flex justify-space-between mb-4">
          <span class="font-weight-bold">Total:</span>
          <span class="font-weight-bold">{{ money(total) }}</span>
        </div>

        <v-btn
          v-if="cart.length"
          color="success"
          block
          size="large"
          prepend-icon="mdi-credit-card-outline"
          @click="checkout"
        >
          Finalizar compra
        </v-btn>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue'
import ProductsDB from '../stores/Productos' 

const query = ref('')
const cart = ref([])

/* FILTRADO DE PRODUVTOS */
const filteredProducts = computed(() => {
  let arr = [...ProductsDB.all()]
  if (query.value) {
    const q = query.value.toLowerCase()
    arr = arr.filter(p => p.name.toLowerCase().includes(q))
  }
  return arr
})

const total = computed(() => cart.value.reduce((acc, i) => acc + i.total, 0))

function productById(id) {
  return ProductsDB.byId(id)
}
function money(n) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(n)
}

/* CARRITO */
function addToCart(id) {
  const p = productById(id)
  if (!p || p.stock === 0) return
  ProductsDB.decStock(id, 1)

  const line = cart.value.find(i => i.id === id)
  if (line) {
    line.cant++
    line.total = line.cant * line.price
  } else {
    cart.value.push({ id: p.id, name: p.name, price: p.price, cant: 1, total: p.price })
  }
}

function decrement(id) {
  const line = cart.value.find(i => i.id === id)
  if (!line) return
  if (line.cant === 1) {
    removeLine(id)
  } else {
    line.cant--
    line.total = line.cant * line.price
    ProductsDB.incStock(id, 1)
  }
}

function removeLine(id) {
  const line = cart.value.find(i => i.id === id)
  if (!line) return
  ProductsDB.incStock(id, line.cant)
  cart.value = cart.value.filter(i => i.id !== id)
}

function checkout() {
  alert('Compra realizada con éxito (demo)')
  cart.value = []
}
</script>

<style scoped>
.gap-2 {
  gap: 0.5rem;
}
</style>
