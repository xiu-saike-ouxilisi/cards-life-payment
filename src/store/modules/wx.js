import wx from 'weixin-js-sdk'
import { Dialog } from 'vant'
import store from '../index.js'
import { getJsSdk } from '@/api/index'
import { getActId } from '@/utils/auth.js'
const state = {
    sdk: {},
    isShareVisible: false,
    is_shared: false // 已经分享成功
}

const mutations = {
    SET_SDK: (state, sdk) => {
        state.sdk = sdk
    },
    SET_SHARE_SUCCESS(state) {
        state.isShareVisible = false
        state.is_shared = true
    },
    SET_IS_SHARE_VISIBLE(state, val) {
        state.isShareVisible = val
    }
}

const actions = {
    getSdk({ commit }) {
        return new Promise((resolve, reject) => {
            getJsSdk().then(res => {
                commit('SET_SDK', res.data.jsSdk)
                resolve()
            }).catch((err) => {
                console.log('getSdk', err)
                reject(err)
            })
        })
    },
    // 校验微信配置
    checkWxConfig({ state }, jsApiList) {
        return new Promise((resolve, reject) => {
            wx.config(state.sdk)
            wx.ready(() => {
                // js校验的api jsApiList: ['openLocation','hideAllNonBaseMenuItem']
                if (jsApiList && jsApiList.length > 0) {
                    wx.checkJsApi({
                        jsApiList,
                        success: res => {
                            resolve(res)
                        },
                        fail: err => {
                            console.log('ready', err)
                            reject(err)
                        }
                    })
                } else {
                    resolve()
                }
            })
            wx.error(function (err) {
                console.log('config', err)
                reject(err)
            })
        })
    },
    // 获取location
    getLocation() {
        return new Promise((resolve, reject) => {
            wx.getLocation({
                type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                success: res => {
                    resolve({ latitude: res.latitude, longitude: res.longitude })
                },
                fail: err => {
                    console.log('getLocation', err)
                    /**
                               * 'getLocation:timeout' 安卓 手机没有开启GPS
                               * 'getLocation:location permission' 安卓 微信没有开启定位权限
                               * 'getLocation:timeout' IOS 手机没有开启GPS或者微信没有开启定位权限
                              */
                    Dialog.confirm({
                        title: '获取地理位置失败',
                        message: '请检查手机的GPS定位以及微信的定位权限是否开启，请在全部开启后点击确认按钮'
                    })
                        .then(() => {
                            // 用户开启
                            window.location.reload()
                        })
                        .catch((err) => {
                            // 用户拒绝开启关闭页面
                            // 这个可以关闭安卓系统的手机
                            document.addEventListener('WeixinJSBridgeReady', function () {
                                // eslint-disable-next-line no-undef
                                WeixinJSBridge.call('closeWindow')
                            }, false)
                            // 这个可以关闭ios系统的手机
                            // eslint-disable-next-line no-undef
                            WeixinJSBridge.call('closeWindow')
                            reject(err)
                        })
                }
            })
        })
    },
    // 分享好友设置
    setShareFriend({ commit }, activity) {
        return new Promise((resolve, reject) => {
            wx.onMenuShareAppMessage({
                title: activity.share_title, // 分享标题
                desc: activity.share_desc, // 分享描述
                link: activity.share_urlf, // 分享链接，
                imgUrl: activity.share_image !== null ? activity.share_image.path : '', // 分享图标
                success: res => {
                    console.log(4444444, res)
                    commit('SET_SHARE_SUCCESS')
                    resolve(res)
                },
                fail: err => {
                    console.log('onMenuShareAppMessage', err)
                    reject(err)
                }
            })
        })
    },

    // 分享朋友圈设置
    setShare({ commit }, activity) {
        return new Promise((resolve, reject) => {
            wx.onMenuShareTimeline({
                title: activity.share_title, // 分享标题
                link: activity.share_url, // 分享链接，
                desc: activity.share_desc, // 分享描述
                imgUrl: activity.share_image !== null ? activity.share_image.path : '', // 分享图标
                success: res => {
                    if (store.state.activity.isLottery && store.state.activity.base.top_image.id) {
                        if (store.state.activity.userInfo.user_lottery.is_transmit !== 1) {
                            store.dispatch('activity/postLotteryShare', { activity_id: getActId() }).then((res) => {
                                Dialog.alert({
                                    title: '提示',
                                    message: '恭喜您获得' + res.data.share_num + '次参与活动的机会'
                                })
                            })
                        } else {
                            Dialog.alert({
                                title: '提示',
                                message: '您已经领取过抽奖次数了，请关注其他活动'
                            })
                        }
                    } else if (store.state.activity.isVideo && store.state.activity.base.is_open_red && store.state.activity.videoStatus === 2.5) {
                        store.dispatch('wx/getLocation').then(res => {
                            const params = {
                                activity_id: getActId(),
                                type: 9,
                                latitude: res.latitude,
                                longitude: res.longitude
                            }
                            store.dispatch('activity/postShareVideo', params)
                        })
                        // store.dispatch('activity/postShareVideo', params)
                    } else {
                        store.dispatch('activity/shareActivity')
                    }
                    commit('SET_SHARE_SUCCESS')
                    resolve()
                },
                fail: err => {
                    console.log('onMenuShareTimeline', 88888888, err)
                    reject(err)
                }
            })
        })
    },
    // 打开定位
    openLocation({ commit }, data) {
        return new Promise((resolve, reject) => {
            wx.openLocation({
                latitude: data.location.lat, // 纬度，浮点数，范围为90 ~ -90
                longitude: data.location.lng, // 经度，浮点数，范围为180 ~ -180。
                name: data.name, // 位置名
                address: data.address, // 地址详情说明
                scale: 15, // 地图缩放级别,整形值,范围从1~28。默认为最大
                infoUrl: '', // 在查看位置界面底部显示的超链接,可点击跳转
                success: res => {
                    resolve(res)
                },
                fail: err => {
                    console.log('openLocation', err)
                    reject(err)
                }
            })
        })
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}