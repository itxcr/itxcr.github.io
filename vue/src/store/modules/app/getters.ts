import { GetterTree } from 'vuex'
import { AppState } from '@/store/modules/app/state'
import { RootState } from '@/store'
import cookie from 'js-cookie'

const getters: GetterTree<AppState, RootState> = {
  user(state) {
    if (state.user.username !== '') {
      return state.user
    }
    const user = cookie.get('user')
    if (!user) return {}
    state.user = JSON.parse(user)
    return state.user
  },
  device(state) {
    return state.device
  },
  background(state) {
    if (localStorage.getItem('background')) return localStorage.getItem('background')
    return state.background
  },
}

export default getters
