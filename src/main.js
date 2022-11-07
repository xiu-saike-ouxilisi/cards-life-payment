import Vue from 'vue'
import App from './App.vue'

import router from './router'
import store from './store'

// import '@/guard' // 路由守卫

import Vant from 'vant'
import 'vant/lib/index.css'
import { Lazyload } from 'vant'

Vue.config.productionTip = false

Vue.use(Vant)
Vue.use(Lazyload)


// 引入微信的js SDK
import wx from 'weixin-js-sdk'
Vue.prototype.wx = wx


// new Vue({
//   router,
//   store,
//   render: h => h(App)
// }).$mount('#app')

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
