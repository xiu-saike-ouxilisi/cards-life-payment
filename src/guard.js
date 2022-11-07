import router from './router'
import store from './store'
import { Toast } from 'vant'
import { getToken } from '@/utils/auth'

Toast.setDefaultOptions('loading', { forbidClick: true })

const whiteList = ['/501', '/404', '/503'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  Toast.loading({ message: '加载中...' })

  // set page title
  if (to.meta.title) document.title = to.meta.title
  if (!getToken()) {
    if (whiteList.includes(to.path)) next()
    else {
      if (!to.query.code) {
        // 微信授权
        store.dispatch('user/refreshLink').then((link) => {
          window.location.href = link
        })
      } else {
        // 授权登录
        store.dispatch('user/login', { code: to.query.code }).then((res) => {
          next()
        })
      }
    }
  } else {
    next()
  }
})

router.afterEach(() => {
  Toast.clear()
})

