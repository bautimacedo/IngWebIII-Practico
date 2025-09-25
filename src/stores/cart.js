// src/stores/cart.js
import { defineStore } from 'pinia'
import ProductsDB from './Productos'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] // { id, name, price, cant, total }
  }),

  getters: {
    count: (state) => state.items.reduce((acc, i) => acc + i.cant, 0),
    subtotal: (state) => state.items.reduce((acc, i) => acc + i.total, 0),
    iva: (state) => +(state.items.reduce((acc, i) => acc + i.total, 0) * 0.21).toFixed(2),
    total() {
      return +(this.subtotal + this.iva).toFixed(2)
    },
  },

  actions: {
    add(id) {
      const p = ProductsDB.byId(id)
      if (!p || p.stock === 0) return

      ProductsDB.decStock(id, 1)

      const line = this.items.find(i => i.id === id)
      if (line) {
        line.cant += 1
        line.total = +(line.cant * line.price).toFixed(2)
      } else {
        this.items.push({
          id: p.id,
          name: p.name,
          price: p.price,
          cant: 1,
          total: +p.price.toFixed(2)
        })
      }
    },

    decrement(id) {
      const line = this.items.find(i => i.id === id)
      if (!line) return
      if (line.cant === 1) {
        this.remove(id)
        return
      }
      line.cant -= 1
      line.total = +(line.cant * line.price).toFixed(2)
      ProductsDB.incStock(id, 1)
    },

    remove(id) {
      const line = this.items.find(i => i.id === id)
      if (!line) return
      ProductsDB.incStock(id, line.cant)
      this.items = this.items.filter(i => i.id !== id)
    },

    clear() {
      this.items.forEach(i => ProductsDB.incStock(i.id, i.cant))
      this.items = []
    }
  }
})
