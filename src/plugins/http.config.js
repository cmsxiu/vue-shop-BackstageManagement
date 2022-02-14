import Vue from 'vue'
import axios from 'axios'
// 导入 NProgress 包对对应的 js 和 css 用作美化
import NProgress from 'nprogress'

Vue.config.productionTip = false

// 配置 axios 请求默认根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 配置 axios 请求头
axios.interceptors.request.use(config => {
    // 在 request 拦截器中，展示进度条 NProgress.start()
    NProgress.start()
    config.headers.Authorization = window.sessionStorage.getItem('token')
    // 必须ruturn config
    return config
})
// 添加一个响应拦截器
axios.interceptors.response.use(config => {
    // 在 response 拦截器中，隐藏进度条 NProgress.done()
    NProgress.done()
    // Do something with response data
    return config
})
// 全局使用 axios
Vue.prototype.$http = axios