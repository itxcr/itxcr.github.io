import { MutationTree } from 'vuex'
import { AppState } from '@/store/modules/app/state'
import { CLEAR_USER, SET_BACKGROUND, SET_DEVICE, SET_TOKEN, SET_USER } from '@/store/modules/app/mutation-types'
import cookie from 'js-cookie'

const mutations: MutationTree<AppState> = {
  [SET_USER](state, payload: User) {
    state.user = payload
    // 数据持久化
    cookie.set('user', JSON.stringify(payload), { expires: 365 })
  },
  [SET_TOKEN](state, payload: string) {
    state.token = payload
    cookie.set('token', payload, { expires: 5 })
  },
  [CLEAR_USER](state) {
    state.user = {
      userId: '',
      username: '',
      password: '',
      avatar: '',
      createTime: 0,
    }
    cookie.set('user', '')
    cookie.set('token', '')
  },
  [SET_DEVICE](state, payload) {
    state.device = payload
    cookie.set('device', JSON.stringify(payload))
  },
  [SET_BACKGROUND](state, payload) {
    state.background = payload
    localStorage.setItem('background', payload)
  },
}

export default mutations
