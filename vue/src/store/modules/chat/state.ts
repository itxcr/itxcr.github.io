export interface ChatState {
  socket: any
  dropped: boolean,
  activeGroupUser: ActiveGroupUser
  activeRoom: (Group & Friend) | null
  groupGather: GroupGather
  userGather: FriendGather
  friendGather: FriendGather
  unReadGather: UnReadGather
}

const chatState: ChatState = {
  socket: null,
  dropped: false,
  activeGroupUser: {},
  activeRoom: null,
  groupGather: {},
  userGather: {},
  friendGather: {},
  unReadGather: {},
}

export default chatState