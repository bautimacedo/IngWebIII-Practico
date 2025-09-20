import { createApp } from 'vue'
import App from './App.vue' //importo mi componente raiz. en este caso es App.vue


import 'bootstrap/dist/css/bootstrap.min.css'
// (opcional) Bootstrap JS (para modales, tooltips, etc.)
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

//crea la aplicación Vue y le pasa el componente Raiz,
// a partir de ahi Vue sabe toda mi app empieza en este 
// componente.
//mount('#app') --> Le dice a Vue: “Montate en el div con id="app” que está en index.html”.
// Ese <div id="app"></div> queda reemplazado por lo que renderice Vue a partir de App.vue.
createApp(App).mount('#app')