<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
// import { getToken } from '@/utils/auth'

export default {
  name: 'App',
  created() {
    // 在页面加载时读取sessionStorage
    // if (sessionStorage.getItem('store') && getToken() && window.location.pathname.indexOf('show') < 0) {
    //   this.$store.replaceState(Object.assign({}, this.$store.state, JSON.parse(sessionStorage.getItem('store'))))
    // }
    // 在页面刷新时将store保存到sessionStorage里
    // window.addEventListener('beforeunload', (a) => {
    //   this.$store.commit('activity/SET_READTOSHARE', false)
    //   this.$store.commit('activity/SET_STOPMUSIC', false)

    //   sessionStorage.setItem('store', JSON.stringify(this.$store.state))
    // })
  }

}
</script>

<style lang="scss">
// @import '~@/style/index';
</style>
