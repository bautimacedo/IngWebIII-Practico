import { reactive } from 'vue'

const state = reactive({
  products: [
    { id: 1, name: 'Arroz',   price: 10, stock: 10, image: '/images/arroz.jpg' },
    { id: 3, name: 'Avena',   price: 20, stock: 100, image: '/images/avena.jpg' },
    { id: 5, name: 'Aceite',  price: 35, stock: 7,  image: '/images/aceite.jpg' },
    { id: 6, name: 'Yerba',   price: 22, stock: 3,  image: '/images/yerba.jpg' },
  ],
  nextId: 7,
})

const ProductsDB = {
  // ---- GETTERS ----
  all() {
    // devolver el array reactivo (todos los componentes verán cambios)
    return state.products
  },
  inStock() {
    return state.products.filter(p => p.stock > 0)
  },
  byId(id) {
    return state.products.find(p => p.id === id) || null
  },
  search(q) {
    const s = (q || '').trim().toLowerCase()
    return !s ? state.products : state.products.filter(p => p.name.toLowerCase().includes(s))
  },

  // ---- SETTERS / CRUD ----
  set(id, patch) {                 // actualizar campos de un producto
    const p = this.byId(id)
    if (!p) return false
    Object.assign(p, patch)
    return true
  },
  add(data) {                      // crear producto
    const prod = { id: state.nextId++, stock: 0, image: '', ...data }
    state.products.push(prod)
    return prod
  },
  remove(id) {                     // borrar
    const i = state.products.findIndex(p => p.id === id)
    if (i === -1) return false
    state.products.splice(i, 1)
    return true
  },
  incStock(id, n = 1) {
    const p = this.byId(id); if (!p) return false
    p.stock += n; return true
  },
  decStock(id, n = 1) {
    const p = this.byId(id); if (!p) return false
    p.stock = Math.max(0, p.stock - n); return true
  },

  // ---- utilidades opcionales ----
  reset(list) {                    // reemplazar todo (útil en tests)
    state.products.length = 0
    state.products.push(...list)
    state.nextId = (list.reduce((m, p) => Math.max(m, p.id || 0), 0) || 0) + 1
  },

  // exporto el estado por si querés leerlo directo
  state,
}

export default Productos
export { state as ProductsState }