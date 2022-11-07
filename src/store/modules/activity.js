/* eslint-disable indent */
import { Dialog } from 'vant'
import { getActivityDetail } from '@/api/index'
import { getActType } from '@/utils/auth.js'
import store from '@/store'

const state = {

}

const mutations = {
    SET_BASE: (state, base) => {
        state.base = base
    },

}

const actions = {
    getActivityInfo({ commit }) {
        return new Promise((resolve, reject) => {
            getActivityDetail()
                .then((res) => {
                    // // 点赞成功 更新点赞数据
                    // commit('SET_LIKE', res.data.like)
                    resolve(state)
                })
                .catch((err) => {
                    console.log(err)
                    reject()
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
