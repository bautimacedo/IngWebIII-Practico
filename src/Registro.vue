<template>

    <div class="container">
    <h1>Registro de Cliente</h1>

    <label for="nombre">Nombre del cliente</label>
    <input
      id="nombre"
      type="text"
      v-model.trim="name" 
      placeholder="Ej: Brunildo Garibale"
      @keyup.enter="registrar"
    />

    <button :disabled="!canRegister" @click="registrar">
      Registrar
    </button>

    <p v-if="welcomeMsg" class="ok">
      {{ welcomeMsg }}
    </p>

</div>


</template>

<script setup>
import { ref } from 'vue'

const name = ref('')
const registeredName = ref('')
const canRegister = computed(() => name.value.trim().length > 0)
const welcomeMsg = computed(() =>
  registeredName.value ? `¡Bienvenido/a, ${registeredName.value}!` : ''
)



</script>