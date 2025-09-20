<template>
  <v-app-bar color="primary" dark elevate-on-scroll>
    <v-toolbar-title class="font-weight-bold">
      🛒 Tienda Emergente
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn text :to="{ name: 'home' }">Inicio</v-btn>
    <v-btn text :to="{ name: 'productos' }">Productos</v-btn>
    <v-btn text :to="{ name: 'clientes' }">Clientes</v-btn>
    <v-btn text :to="{ name: 'login' }">Login</v-btn>
  </v-app-bar>
</template>

<script>
export default {
  name: "Navbar",
};
</script>