import { GetterTree } from 'vuex'
import { ChatState } from '@/store/modules/chat/state'
import { RootState } from '@/store'

const getters: GetterTree<ChatState, RootState> = {
  socket(state) {
    return state.socket
  },
  dropped(state) {
    return state.dropped
  },
  activeGroupUser(state) {
    return state.activeGroupUser
  },
  activeRoom(state) {
    return state.activeRoom
  },
  groupGather(state) {
    return state.groupGather
  },
  friendGather(state) {
    return state.friendGather
  },
  userGather(state) {
    return state.userGather
  },
  unReadGather(state) {
    return state.unReadGather
  },
}

export default getters