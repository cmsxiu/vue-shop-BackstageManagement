import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 引入axios
import './plugins/http.config.js'
/**
 *import {get, post ,newAxios} from './plugins/http.js'
 */
import './assets/css/global.css'
import './assets/icon/iconfont.css'

// 引入 vue-table-with-tree-grid
import TreeTable from 'vue-table-with-tree-grid'
// 使用
Vue.component('tree-table', TreeTable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')