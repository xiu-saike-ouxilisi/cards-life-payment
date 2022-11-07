import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// export default new Router({
//   mode: 'history',
//   base: process.env.BASE_URL,
//   routes: [
//     {
//       path: '/',
//       name: 'home',
//       component: Home
//     },
//     {
//       path: '/about',
//       name: 'about',
//       // route level code-splitting
//       // this generates a separate chunk (about.[hash].js) for this route
//       // which is lazy-loaded when the route is visited.
//       component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
//     }
//   ]
// })

export const constantRoutes = [
  {
    path: '/redirect',
    component: () => import('@/views/home/index'),
    hidden: true,
    children: [{
      path: '/redirect/:path*',
      component: () => import('@/views/home/index')
    }]
  },

  {
    path: '/',
    name: 'home',
    components: { default: () => import('@/views/home/index.vue') },
    props: { default: true },
    meta: {
      title: '首页'
    },
  },

  {
    path: '/mine',
    name: 'mine',
    components: { default: () => import('@/views/mine/index') },
    props: { default: true },
    meta: {
      title: '个人中心'
    }
  },

  // {
  //   path: '/404',
  //   component: () => import('@/views/404'),
  //   meta: {
  //     title: '页面找不到了'
  //   },
  //   hidden: true
  // },
  // {
  //   path: '/501',
  //   component: () => import('@/views/500'),
  //   meta: {
  //     title: '活动太火爆了'
  //   },
  //   hidden: true
  // },
  // {
  //   path: '/510',
  //   component: () => import('@/views/510'),
  //   meta: {
  //     title: '账号异常'
  //   },
  //   hidden: true
  // },
  // {
  //   path: '/503',
  //   component: () => import('@/views/503'),
  //   meta: {
  //     title: '系统维护中'
  //   },
  //   hidden: true
  // },
  // {
  //   path: '/408',
  //   component: () => import('@/views/408'),
  //   meta: {
  //     title: '网络超时'
  //   },
  //   hidden: true
  // },
  // { path: '*', redirect: '/404', hidden: true }
]

export const elseRouter = [
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // require service support  https://router.vuejs.org/zh/guide/essentials/history-mode.html#%E5%90%8E%E7%AB%AF%E9%85%8D%E7%BD%AE%E4%BE%8B%E5%AD%90
  // https://blog.csdn.net/Wcharles666/article/details/88391034
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
