import Vue from 'vue'
import Vuex, { ModuleTree } from 'vuex'
// app
import app from '@/store/modules/app'
import { AppState } from '@/store/modules/app/state'

// chat
import chat from '@/store/modules/chat'
import { ChatState } from '@/store/modules/chat/state'

export type RootState = {
  app: AppState,
  chat: ChatState
}

Vue.use(Vuex)

const modules: ModuleTree<RootState> = {
  app,
  chat,
}
export default new Vuex.Store({
  modules,
  // strict: process.env.NODE_ENV !== 'production',
})
