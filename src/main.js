import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/icon/iconfont.css'

Vue.config.productionTip = false

// 配置 axios 请求默认根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 全局使用 axios
Vue.prototype.$http = axios

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')