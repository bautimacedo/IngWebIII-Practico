<template>
  <v-app>
    <v-main>
      <!-- Acá Vue Router renderiza la vista activa -->
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',
}
</script>