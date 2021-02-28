import Vue from 'vue'
import axios from 'axios'

Vue.prototype.$axios = axios
const api = axios.create({ baseURL: 'http://localhost:8090/' })
Vue.prototype.$api = api
export { axios, api }
