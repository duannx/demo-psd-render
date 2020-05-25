import Vue from 'vue'
import App from './App.vue'
import store from './store'
import routes from './routes'
import VueRouter from 'vue-router'


Vue.config.productionTip = false
Vue.use(VueRouter)

const router = new VueRouter({
  routes // short for `routes: routes`
})


new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')