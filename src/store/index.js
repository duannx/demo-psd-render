import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const productApiEndPoint = 'api/catalog/product.json?handle={{handle}}'
const productPersonalizeApiEndPoint = 'api/pod/personalize-render.json?product_id={{productId}}'
const getProductDetailAPI = (host, handle) => {
  return `${host}${productApiEndPoint.replace('{{handle}}',handle)}`
}
const getProductPersonalizeAPI = (host, id) => {
  return `${host}${productPersonalizeApiEndPoint.replace('{{productId}}',id)}`
}

export default new Vuex.Store({
  state: {
    currentDomain: '',
    product: {},
    personalize: {},
  },
  mutations: {
    setCurrentDomain(state, payload) {
      state.currentDomain = payload
    },
    setProduct(state, payload) {
      state.product = payload
    },
    setPersonalize(state, payload) {
      state.personalize = payload
    },
  },
  actions: {
    async getProductDetails({
      state, commit
    }, handle) {
      const res = await fetch(getProductDetailAPI(state.currentDomain, handle))
      const json = await res.json()
      commit('setProduct', json)
      return await json
    },
    async getProductPersonalizeAPI({
      state, commit
    }, id) {
      const res = await fetch(getProductPersonalizeAPI(state.currentDomain, id))
      const json = await res.json()
      commit('setPersonalize', json)
      return await json
    },
  },
})