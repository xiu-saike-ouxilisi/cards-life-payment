import { postLocation, getLoginLink, login, refreshToken } from '@/api/index'
import { setToken, removeToken } from '@/utils/auth'

const state = {
  token: '',
  location: '', // 0 初始化 1 在地理范围 2 不在地理范围 3不确定该用户是否在地理范围（手机ip不在但是地理位置可能在） 4 ip无法解析
  info: { avatar: '', nickname: '' }, // 登陆用户信息
  // 登陆获取用户信息 https://qydev.weixin.qq.com/wiki/index.php?title=%E4%BC%81%E4%B8%9A%E8%8E%B7%E5%8F%96code
  link: '',
  copyRight: 'Copyright 2014-' + new Date().getFullYear() + ' 智网网络. All Rights Reserved'
}

const mutations = {
  SET_LOCATION: (state, location) => {
    state.location = location
  },
  SET_TOKEN: (state, token) => {
    state.token = token
    setToken(token)
  },
  SET_INFO: (state, info) => {
    state.info = info
  },
  SET_LINK: (state, data) => {
    // 防封处理
    state.link = `${data.domain}/?appid=${data.appid}&redirect_uri=${window.location.href.split('?')[0]}&scope=snsapi_userinfo&response_type=code&state=STATE#wechat_redirect`
    // state.link = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx9bbc9d1da5e4debc&redirect_uri=${encodeURIComponent(href)}&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect`
  }
}

const actions = {
  // 登陆
  login({ commit }, data) {
    return new Promise((resolve, reject) => {
      login(data)
        .then(res => {
          commit('SET_TOKEN', res.data.token)
          // commit('SET_TOKEN', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8xMjcuMC4wLjFcL3dlYl9hcGlcL3d4X3VzZXIiLCJpYXQiOjE2MDk3MjA3MzgsImV4cCI6MTYwOTcyNDMzOCwibmJmIjoxNjA5NzIwNzM4LCJqdGkiOiJoRUJjSjhpdUxhb0pwajVtIiwic3ViIjo2OSwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.V3yeRlR9M1jt5qEdBxa1gGv5pOa2DZIyQvpODWDPOz0')
          commit('SET_INFO', res.data.user)
          resolve()
        }).catch((err) => {
          console.log(err)
          reject()
        })
    })
  },
  // 刷新用户 token
  refreshUserToken({ commit }) {
    return new Promise((resolve, reject) => {
      refreshToken()
        .then(res => {
          commit('SET_TOKEN', res.data.token)
          resolve()
        }).catch((err) => {
          console.log(err)
          reject()
        })
    })
  },
  // 校验地址
  checklocation({ commit }, data) {
    return new Promise((resolve, reject) => {
      postLocation(data)
        .then(res => {
          commit('SET_LOCATION', res.data.is_location)
          resolve(res.data.is_location)
        }).catch((err) => {
          console.log(err)
          reject()
        })
    })
  },
  // 更新 link
  refreshLink({ commit, state }) {
    return new Promise((resolve, reject) => {
      getLoginLink().then((res) => {
        commit('SET_LINK', res.data)
        resolve(state.link)
      }).catch((err) => {
        console.log(err)
        reject()
      })
    })
  },
  logOut({ commit }) {
    return new Promise((resolve) => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
