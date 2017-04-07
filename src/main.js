import Vue from 'vue'
import App from './App.vue'
import vMapboxgl from './components/vMapboxgl.vue'

Vue.component('v-mapboxgl', vMapboxgl)

new Vue({
  el: '#app',
  render: h => h(App)
})
