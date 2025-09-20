<template>
  <h1>Productos</h1>

  <div class="input-group mb-3">
    <span class="input-group-text" id="inputGroup-sizing-default">Buscar Producto</span>
    <input 
      type="text" 
      class="form-control" 
      aria-label="Default" 
      aria-describedby="inputGroup-sizing-default" 
      placeholder="Ingrese Nombre Producto. Ej. Arroz"
      v-model.trim="producto" 
      @keyup.enter="buscarProducto"
    >
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

const carrito = ref([])

function buscarProducto() {
  const n = producto.value.trim()

  // reset básico
  productoEncontrado.value = null
  productoNoEncontrado.value = false
  stockCero.value = false

  if (!n) return

  const encontrado = products.value.find(
    p => p.name.toLowerCase() === n.toLowerCase()
  )

  if (!encontrado) {
    productoNoEncontrado.value = true
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