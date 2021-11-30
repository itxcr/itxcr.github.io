import state, { AppState } from '@/store/modules/app/state'
import { RootState } from '@/store'
import { Module } from 'vuex'
import actions from '@/store/modules/app/actions'
import mutations from '@/store/modules/app/mutations'
import getters from '@/store/modules/app/getters'

const app: Module<AppState, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}

export default app
