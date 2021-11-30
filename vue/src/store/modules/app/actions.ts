import { ActionTree } from 'vuex'
import { AppState } from '@/store/modules/app/state'
import { RootState } from '@/store'
import fetch from '@/api/fetch'
import { processReturn } from '@/utils/common'
import { SET_TOKEN, SET_USER } from '@/store/modules/app/mutation-types'

const actions: ActionTree<AppState, RootState> = {
  async register({ commit }, payload) {
    let res = await fetch.post(`/auth/register`, payload)
    // @ts-ignore
    let data = processReturn(res)
    if (data) {
      commit(SET_USER, data.user)
      commit(SET_TOKEN, data.token)
      return data
    }
  },
  async login({ commit }, payload) {
    let res = await fetch.post(`/auth/login`, payload)
    // @ts-ignore
    const data = processReturn(res)
    if (data.user && data.token) {
      commit(SET_USER, data.user)
      commit(SET_TOKEN, data.token)
      return data
    }
  },
}

export default actions
