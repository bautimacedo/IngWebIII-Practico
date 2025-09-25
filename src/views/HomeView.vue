<template>
  <v-main>
    <!-- Nombre con slogan -->
    <v-container
      fluid
      class="d-flex align-center justify-center text-center hero-section"
    >
      <v-row align="center" justify="center">
        <v-col cols="12" md="8">
          <h1 class="text-h2 font-weight-bold mb-4 text-white">
            Tienda Emergente
          </h1>
          <p class="text-h6 mb-6 text-white">
            Los ultimos productos los tenes aca
          </p>
        </v-col>
      </v-row>
    </v-container>

    <!-- PARA PONER ALGO -->
    <v-container class="py-12">
      <v-row align="center" justify="center" class="text-center">
        <v-col cols="12" md="4">
          <v-icon size="40" color="primary">mdi-truck-fast</v-icon>
          <h3 class="mt-2">Envíos Rápidos</h3>
          <p>Recibí tu compra en menos de 24h en Cordoba Capital.</p>
        </v-col>
        <v-col cols="12" md="4">
          <v-icon size="40" color="primary">mdi-shield-check</v-icon>
          <h3 class="mt-2">Compra Segura</h3>
          <p>Aceptamos todos los medios de pago.</p>
        </v-col>
        <v-col cols="12" md="4">
          <v-icon size="40" color="primary">mdi-currency-usd</v-icon>
          <h3 class="mt-2">Lider en Precios</h3>
          <p>Ofrecemos el mejor precio del mercado</p>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
export default {
  name: "HomeView",
};
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  min-height: calc(100vh - 64px); /* toda la pantalla menos la navbar */
  color: white;
}
.gap-4 {
  gap: 1rem;
}
</style>
