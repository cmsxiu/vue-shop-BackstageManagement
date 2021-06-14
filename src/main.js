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

// 引入 vue-quill-editor
import VueQuillEditor from 'vue-quill-editor'
// 引入 vue-quill-editor style
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

// 使用
Vue.component('tree-table', TreeTable)

// 使用 vue-quill-editor
Vue.use(VueQuillEditor)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')