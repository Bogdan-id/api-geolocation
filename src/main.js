import Vue from 'vue'
import App from './App.vue'
import store from './store'
import { createProvider } from './vue-apollo'
import i18n from './i18n'
import VueMask from 'v-mask'

Vue.use(VueMask)

Vue.config.productionTip = true

new Vue({
  store,
  apolloProvider: createProvider(),
  i18n,
  render: h => h(App)
}).$mount('#app')
