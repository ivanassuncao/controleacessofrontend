import Vue from 'vue'
import './plugins/vuetify'
import './plugins/graphql'
import App from './App.vue'
import store from './store'
const moment = require('moment')


moment.locale('pt-br')

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
