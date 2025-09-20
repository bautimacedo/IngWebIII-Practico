<template>
  <v-main>
    <!-- HERO -->
    <v-container
      fluid
      class="fill-height d-flex align-center justify-center gradient-bg text-center"
    >
      <v-row align="center" justify="center">
        <v-col cols="12" md="8">
          <h1 class="display-2 font-weight-bold mb-4 text-white animate-title">
            Tienda Emergente
          </h1>
          <p class="text-h5 font-italic mb-8 text-white animate-subtitle">
            Los últimos productos los tenés acá
          </p>
        </v-col>
      </v-row>
    </v-container>

    <!-- FEATURES -->
    <v-container class="py-12">
      <v-row align="center" justify="center" class="text-center">
        <v-col cols="12" md="4">
          <v-icon size="48" color="primary">mdi-truck-fast</v-icon>
          <h3 class="mt-3">Envíos Rápidos</h3>
          <p>Entregamos tus productos en tiempo récord en cualquier lugar.</p>
        </v-col>
        <v-col cols="12" md="4">
          <v-icon size="48" color="primary">mdi-shield-check</v-icon>
          <h3 class="mt-3">Compra Segura</h3>
          <p>Pagos protegidos y confianza garantizada en cada transacción.</p>
        </v-col>
        <v-col cols="12" md="4">
          <v-icon size="48" color="primary">mdi-currency-usd</v-icon>
          <h3 class="mt-3">Mejores Precios</h3>
          <p>Ofertas únicas y precios que no vas a encontrar en otro lado.</p>
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
.gradient-bg {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  min-height: calc(100vh - 64px); /* ocupa pantalla menos la navbar */
}

.animate-title {
  animation: fadeInDown 1s ease;
}
.animate-subtitle {
  animation: fadeInUp 1.2s ease;
}

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.gap-4 { gap: 1.5rem; }
</style>
