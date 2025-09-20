<template>
  <v-app>
    <!-- HEADER -->
    <v-app-bar color="primary" dark elevate-on-scroll>
      <v-toolbar-title class="font-weight-bold">
        🛒 Tienda Emergente
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text :to="{ name: 'home' }">Inicio</v-btn>
      <v-btn text :to="{ name: 'productos' }">Productos</v-btn>
      <v-btn text :to="{ name: 'clientes' }">Clientes</v-btn>
    </v-app-bar>

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
            <div class="d-flex justify-center gap-4">
              <v-btn
                color="secondary"
                size="x-large"
                elevation="8"
                rounded="xl"
                :to="{ name: 'productos' }"
              >
                Ver Productos
              </v-btn>
              <v-btn
                color="white"
                class="text-primary"
                size="x-large"
                elevation="8"
                rounded="xl"
                :to="{ name: 'clientes' }"
              >
                Clientes
              </v-btn>
            </div>
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

      <!-- DESTACADOS -->
      <v-container fluid class="py-12 grey lighten-4">
        <h2 class="text-center mb-8 font-weight-bold">Destacados</h2>
        <v-row justify="center" align="stretch">
          <v-col cols="12" md="3" v-for="i in 3" :key="i">
            <v-card elevation="6" rounded="xl" class="pa-4 text-center">
              <v-img
                src="https://picsum.photos/300/200?random={{ i }}"
                height="150"
                class="mb-4 rounded-lg"
              ></v-img>
              <h3 class="mb-2">Producto {{ i }}</h3>
              <p class="text-grey">
                Descripción breve de un producto destacado de la tienda.
              </p>
              <v-btn color="primary" rounded="lg" class="mt-3">
                Ver más
              </v-btn>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- FOOTER -->
    <v-footer app color="primary" dark>
      <v-col class="text-center">
        © {{ new Date().getFullYear() }} Tienda Emergente — Todos los derechos
        reservados
      </v-col>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: "HomeView",
};
</script>

<style scoped>
.gradient-bg {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  min-height: 80vh;
}

.animate-title {
  animation: fadeInDown 1s ease;
}
.animate-subtitle {
  animation: fadeInUp 1.2s ease;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.gap-4 {
  gap: 1.5rem;
}
</style>
