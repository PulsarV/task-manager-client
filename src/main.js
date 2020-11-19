// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'bootstrap/dist/css/bootstrap.css'
import {BootstrapVue, BootstrapVueIcons} from 'bootstrap-vue'
import Vue from 'vue'
import Vuelidate from 'vuelidate'
import App from './App'
import Axios from 'axios'
import router from './router'
import store from './store'

Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.use(Vuelidate)

Vue.prototype.$http = Axios
Vue.prototype.$http.defaults.baseURL = process.env.API_ENDPOINT

const token = localStorage.getItem('token')
if (token) {
  Vue.prototype.$http.defaults.headers.common['Authorization'] = token
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
