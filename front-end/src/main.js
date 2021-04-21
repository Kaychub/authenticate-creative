import Vue from 'vue'
import App from './App.vue'
import router from './router'
import mock from './mock-data.js'

Vue.config.productionTip = false

let data = {
  selectedPaletteID: 0,
  swatches: mock,
  palette: [],
  userGeneratedID: 1001, // custom id so that user-made swatches don't get mixed up with the mock-data ones
}

new Vue({
  router,
  data,
  render: h => h(App)
}).$mount('#app')
