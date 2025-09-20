import { reactive } from 'vue'

const img = (file) => new URL(`../images/${file}`, import.meta.url).href

const state = reactive({
  products: [
    { id: 1, name: 'Arroz',  price: 10, stock: 10, image: img('arroz.jpg') },
    { id: 3, name: 'Avena',  price: 20, stock: 100, image: img('avena.jpg') },
    { id: 5, name: 'Aceite', price: 35, stock: 7,  image: img('aceite.jpg') },
    { id: 6, name: 'Yerba',  price: 22, stock: 3,  image: img('yerba.jpg') },
  ],
  nextId: 7,
})

const ProductsDB = {
  // GET
  all() { return state.products },
  inStock() { return state.products.filter(p => p.stock > 0) },
  byId(id) { return state.products.find(p => p.id === id) || null },
  search(q) {
    const s = (q || '').trim().toLowerCase()
    return !s ? state.products : state.products.filter(p => p.name.toLowerCase().includes(s))
  },
  // SET/CRUD
  set(id, patch) { const p = this.byId(id); if (!p) return false; Object.assign(p, patch); return true },
  add(data) { const prod = { id: state.nextId++, stock: 0, image: '', ...data }; state.products.push(prod); return prod },
  remove(id) { const i = state.products.findIndex(p => p.id === id); if (i === -1) return false; state.products.splice(i,1); return true },
  incStock(id, n = 1) { const p = this.byId(id); if (!p) return false; p.stock += n; return true },
  decStock(id, n = 1) { const p = this.byId(id); if (!p) return false; p.stock = Math.max(0, p.stock - n); return true },
  reset(list) {
    state.products.length = 0
    state.products.push(...list)
    state.nextId = (list.reduce((m, p) => Math.max(m, p.id || 0), 0) || 0) + 1
  },
  state,
}

export default ProductsDB
export { state as ProductsState }
