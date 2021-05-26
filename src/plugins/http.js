import Vue from 'vue'
import axios from 'axios'

// 2000毫秒的响应时间
axios.defaults.timeout = 2000
// 配置 axios 请求默认根路径
// axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

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
    }, error => {
        // Do something with response error
        if (error && error.response) {
            switch (error.response.status) {
                case 400:
                    error.message = '错误请求'
                    break;
                case 401:
                    error.message = '授权失败'
                    router.push({ path: "/login" })
                    break;
                case 403:
                    error.message = '拒绝访问'
                    break;
                case 404:
                    error.message = '错误请求，未找到该资源'
                    break;
                case 408:
                    error.message = '请求超时'
                    break;
                case 500:
                    error.message = '服务端出错'
                    break;
                case 501:
                    error.message = '网络未实现'
                    break;
                case 502:
                    error.message = '网络错误'
                    break;
                case 503:
                    error.message = '服务不可用'
                    break;
                case 504:
                    error.message = '网络超时'
                    break;
                case 505:
                    error.message = 'http版本不支持该请求'
                    break;
                default:
                    error.message = '连接错误' + error.response.status
            }
        } else {
            error.message = '连接到服务器失败'
            Notification.error({
                title: '错误',
                message: '接口连接失败'
            });
        }
        return Promise.reject(error)
    }
)

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function get (url, params = {}) {
    return new Promise((resolve, reject) => {
        axios.get(BASEURL + url, {
            params·: params,
            paramsSerializer: function (params) {
                return qs.stringify(params, { arrayFormat: 'repeat' })
            } //axios的get方法中使用params时对于js数组类型的参数的默认操作比较诡异，会使得参数名后带上'[]'字符串
        })
            .then(response => {
                resolve(response.data);
            })
            .catch(err => {
                reject(err)
            })
    })
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post (url, data = {}) {
    return new Promise((resolve, reject) => {
        //axios.post(BASEURL+url,qs.stringify(data, { indices: false }))
        const publicUrl = "http://192.168.43.230:8002/";
        axios.post(publicUrl + url, data)
            .then(response => {
                resolve(response.data);
            }, err => {
                reject(err)
            })
    })
}

/**
 * 封装全部Axios请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function newAxios (type, url, options) {
    return new Promise((resolve, reject) => {
        axios({
            method: type,
            url: url,
            params: type === 'get' || type === 'delete' ? options : null,
            paramsSerializer: function (params) {
                return qs.stringify(params, { arrayFormat: 'repeat' })
            }, //axios的get方法中使用params时对于js数组类型的参数的默认操作比较诡异，会使得参数名后带上'[]'字符串

            data: type !== 'get' && type !== 'delete' ? qs.stringify(options, { indices: false }) : null
        }).then(response => {
            resolve(response.data);
        })
            .catch(err => {
                reject(err)
            })
    })
}