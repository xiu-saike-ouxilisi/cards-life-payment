import axios from 'axios'
import store from '../store'
import { getToken } from '@/utils/auth'
import { Toast, Dialog } from 'vant'
import router from '../router'

// http响应状态码
const resposeCode = {
  '301': '请求需要重定向',
  '400': '请求错误',
  '401': '请求受保护，需要填写用户名字/密码',
  '403': '资源不可用',
  '404': '无法找到指定资源',
  '405': '请求方法错误',
  '406': '页面请求头不兼容',
  '407': '服务器授权后方可使用',
  '408': '请求超时，请重试',
  '409': '当前资源被占用',
  '410': '请求资源已过期',
  '413': '请求文件过大',
  '423': '当前资源被锁定',
  '424': '请求关联错误',
  '500': '服务器错误',
  '501': '服务器不支持您的请求',
  '502': '上游服务器无法响应',
  '503': '服务器维护中，请稍后再试',
  '504': '上游服务器未及时应答',
  '510': '策略未满足',
  '600': '响应头未返回'
}

// 是否测试
// const isDEBUG = false

// 设置全局的请求次数，请求的间隙
axios.defaults.retry = 2
axios.defaults.retryDelay = 1000

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // api 的 base_url
  timeout: 5000, // 请求超时时间
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// request拦截器
service.interceptors.request.use(
  config => {
    Toast.loading()
    if (getToken()) {
      config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config
  },
  error => {
    // Do something with request error
    Toast.clear()
    Promise.reject(error)
  }
)
// response 拦截器
service.interceptors.response.use(
  response => {
    Toast.clear()
    const res = response.data
    const status = response.status
    // if (isDEBUG) console.log(response)
    if (res) {
      // 提示错误信息
      if (res.message && ![0, 700003, 700010].includes(res.code)) {
        // Toast.fail(res.message)
        Dialog.alert({
          title: '提示',
          message: res.message
        })
      }
      if (res.code === 0) { // code 为0请求正常
        return res
      } else {
        /**
         * '700003' => '认证失败',
         * '700004' => '当前用户已经过期'
         * '700010' => '无token，code无效，删除导航栏处code，刷新页面重新登录'
         * '700009' => '非法用户'
         * '10000' => '活动太火爆'
         * '10001' => '维护'
         */
        if (res.code === 700003) {
          store.dispatch('user/refreshUserToken')
            .then(() => {
              window.location.reload()
            })
        }
        if (res.code === 700004) {
          // Toast.fail('页面超时请重新登陆')
          store.dispatch('user/logOut').then(() => {
            window.location.href = window.location.origin + window.location.pathname // 为了重新实例化vue-router对象 避免bug
          })
        }
        if (res.code === 700010) {
          store.dispatch('user/refreshLink')
            .then((link) => {
              window.location.href = link
            })
        }
        // 非法用户
        if (res.code === 700009) {
          router.push('/510')
        }
        // 活动火爆
        if (res.code === 10000) {
          router.push('/501')
        }
        // 维护
        if (res.code === 10001) {
          router.push({ path: '/503', query: { message: res.message }})
        }
        return Promise.reject(res)
      }
    } else {
      Toast.fail(resposeCode[status] || '请求成功，返回值错误')
      return Promise.reject('error', response)
    }
  },
  error => {
    Toast.clear()
    // if (isDEBUG) console.error('error' + error) // for debug
    // 连接不上服务器说明服务器在维护显示503
    const response = error.response || { status: 408 }

    const status = response.status
    if (status === 408) {
      router.push({ path: '/408' })
    }
    /**
    // 请求服务器失败重新请求
    var config = error.config
    // 如果config不存在或未设置重试选项，请拒绝
    if (!config || !config.retry) return Promise.reject(error)

    // 设置变量以跟踪重试次数
    config.__retryCount = config.__retryCount || 0

    // 检查我们是否已经最大化了重试次数
    if (config.__retryCount >= config.retry) {
      // Reject with the error
      Message({
        message: resposeCode[status] || '网络错误，请重新尝试',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(error)
    }

    // 增加重试次数
    config.__retryCount += 1

    // 创建一个promise，控制请求次数
    var backoff = new Promise(function(resolve) {
      setTimeout(function() {
        resolve()
      }, config.retryDelay || 1)
    })

    // 返回axios 重试请求
    return backoff.then(function() {
      return axios(config)
    })
    */
    Toast.fail(resposeCode[status] || '网络错误，请重新尝试')
    return Promise.reject(error)
  }
)

export default service
