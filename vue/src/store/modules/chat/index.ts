import { Module } from 'vuex'
import state, { ChatState } from '@/store/modules/chat/state'
import { RootState } from '@/store'
import actions from '@/store/modules/chat/actions'
import mutations from '@/store/modules/chat/mutations'
import getters from '@/store/modules/chat/getters'

const chat: Module<ChatState, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}

export default chat