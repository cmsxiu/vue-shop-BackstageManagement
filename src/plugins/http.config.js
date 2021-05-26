import Vue from 'vue'
import axios from 'axios'
Vue.config.productionTip = false

// 配置 axios 请求默认根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 配置 axios 请求头
axios.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem('token')
    // 必须ruturn config
    return config
}, err => {
    return Promise.reject(err)
})
// 添加一个响应拦截器
axios.interceptors.response.use(
    response => {
        // Do something with response data
        return response
    }, err => {
        // Do something with response error
        return Promise.reject(err)
    }
)
// 全局使用 axios
Vue.prototype.$http = axios