<template>
  <v-app>
    <Navbar />
    <v-main>
      <router-view />
    </v-main>
    <v-footer app color="primary" dark>
      <v-col class="text-center">
        © {{ new Date().getFullYear() }} Tienda Emergente — Todos los derechos reservados
      </v-col>
    </v-footer>
  </v-app>
</template>

<script>
import Navbar from "./components/Navbar.vue";

export default {
  name: "App",
  components: { Navbar },
};
</script>
