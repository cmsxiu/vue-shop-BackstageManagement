import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 引入axios
import './plugins/http.config.js'

import './assets/css/global.css'
import './assets/icon/iconfont.css'

// 引入 vue-table-with-tree-grid
import TreeTable from 'vue-table-with-tree-grid'

// 引入 vue-quill-editor
import VueQuillEditor from 'vue-quill-editor'

// 使用
Vue.component('tree-table', TreeTable)

// 使用 vue-quill-editor
Vue.use(VueQuillEditor)

// 时间转换
Vue.filter('dateFormat', function (originVal) {
    const dt = new Date(originVal)
    const y = dt.getFullYear()
    const m = (dt.getMonth() + 1 + '').padStart(2, '0')
    const d = (dt.getDate() + '').padStart(2, '0')
    const hh = (dt.getHours() + '').padStart(2, '0')
    const mm = (dt.getMinutes() + '').padStart(2, '0')
    const ss = (dt.getSeconds() + '').padStart(2, '0')
    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
})
new Vue({
    router,
    render: h => h(App)
}).$mount('#app')