<template>
  <div class="chat" :style="{ '--bg-image': `url(${background})` }">
    <div class="chat-part1" v-if="visibleTool">
      <general-tool @logout="logout"></general-tool>
    </div>

    <div class="chat-part2">
      <general-search @addGroup="addGroup" @joinGroup="joinGroup" @addFriend="addFriend" @setActiveRoom="setActiveRoom" />
      <general-room @setActiveRoom="setActiveRoom" />
    </div>
    <div class="chat-part3">
      <a-icon class="chat-team" type="message" @click="toggleDrawer" />
      <div class="chat-tool">
        <a-icon type="menu-fold" @click="toggleTool" v-if="visibleTool" />
        <a-icon type="menu-unfold" @click="toggleTool" v-else />
      </div>
      <general-message v-if="activeRoom"></general-message>
    </div>
    <a-drawer placement="left" :closable="false" :visible="visibleDrawer" @close="toggleDrawer" style="height: 100%">
      <div class="chat-drawer">
        <general-search @addGroup="addGroup" @joinGroup="joinGroup" @addFriend="addFriend" @setActiveRoom="setActiveRoom"> </general-search>
        <general-room @setActiveRoom="setActiveRoom"></general-room>
      </div>
    </a-drawer>
    <general-join @register="handleRegister" @login="handleLogin" :showModal="showModal" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import GeneralJoin from '@/components/GeneralJoin.vue'
import GeneralTool from '@/components/GeneralTool.vue'
import GeneralSearch from '@/components/GeneralSearch.vue'
import GeneralRoom from '@/components/GeneralRoom.vue'
import GeneralMessage from '@/components/GeneralMessage.vue'

const appModule = namespace('app')
const chatModule = namespace('chat')
@Component({
  components: {
    GeneralJoin,
    GeneralTool,
    GeneralSearch,
    GeneralRoom,
    GeneralMessage,
  },
})
export default class GeneralChat extends Vue {
  @appModule.Getter('user') user!: User
  @appModule.Mutation('clear_user') clearUser!: Function
  @appModule.Action('login') login!: Function
  @appModule.Action('register') register!: Function
  @appModule.Getter('background') background!: string

  @chatModule.Getter('socket') socket: any
  @chatModule.Getter('userGather') userGather!: FriendGather
  @chatModule.Getter('groupGather') groupGather!: GroupGather
  @chatModule.Getter('activeRoom') activeRoom!: Friend & Group
  @chatModule.Mutation('set_active_room') _setActiveRoom!: Function
  @chatModule.Action('connectSocket') connectSocket!: Function

  showModal: boolean = false
  visibleDrawer: boolean = false
  visibleTool: boolean = true

  mounted() {
    if (!this.user.userId) {
      this.showModal = true
    } else {
      this.handleJoin()
    }
  }

  // 登录
  async handleLogin(user: User) {
    let res = await this.login(user)
    if (res.user && res.token) {
      // 进入系统事件
      await this.handleJoin()
    }
  }

  // 注册
  async handleRegister(user: User) {
    await this.clearUser()
    let res = await this.register(user)
    if (res) {
      // 进入系统事件
      await this.handleJoin()
    }
  }

  // 进入系统初始化事件
  async handleJoin() {
    this.showModal = false
    this.connectSocket()
  }

  // 创建群组
  addGroup(groupName: string) {
    this.socket.emit('addGroup', {
      userId: this.user.userId,
      groupName: groupName,
      createTime: new Date().valueOf(),
    })
  }

  // 加入群组
  joinGroup(groupId: string) {
    this.socket.emit('joinGroup', {
      userId: this.user.userId,
      groupId: groupId,
    })
  }

  // 添加好友
  addFriend(friendId: string) {
    this.socket.emit('addFriend', {
      userId: this.user.userId,
      friendId: friendId,
      createTime: new Date().valueOf(),
    })
  }

  // 设置当前聊天窗
  setActiveRoom(room: Friend & Group) {
    this._setActiveRoom(room)
  }

  // 注销
  async logout() {
    await this.clearUser()
    await this.$router.go(0)
  }

  toggleDrawer() {
    this.visibleDrawer = !this.visibleDrawer
  }

  toggleTool() {
    this.visibleTool = !this.visibleTool
  }
}
</script>

<style scoped lang="scss">
.chat {
  font-size: 16px;
  z-index: 999;
  max-width: 1000px;
  min-width: 300px;
  width: 100%;
  height: 80%;
  max-height: 900px;
  min-height: 470px;
  position: relative;
  margin: auto 20px;
  box-shadow: 10px 20px 80px rgba(0, 0, 0, 0.8);
  display: flex;
  border-radius: 5px;
  overflow: hidden;

  .chat-part1 {
    width: 74px;
    height: 100%;
    background-color: rgb(0, 0, 0, 0.7);
  }

  .chat-part2 {
    width: 230px;
    height: 100%;
    background-color: rgb(0, 0, 0, 0.3);
  }

  .chat-part3 {
    flex: 1;
    height: 100%;
    background-color: rgb(0, 0, 0, 0.2);
    overflow-y: hidden;
    position: relative;

    .chat-group {
      height: 53px;
      border-bottom: 1px solid #ccc;
      line-height: 50px;
      font-weight: bold;
    }
  }

  .chat-team {
    display: none;
  }

  .chat-tool {
    display: none;
  }
}

.chat::after {
  content: '';
  background: var(--bg-image) 0 / cover fixed;
  position: absolute;
  object-fit: cover;
  width: 100%;
  height: 100%;
  filter: blur(10px);
  transform: scale(1.08);
  z-index: -1;
}

@media screen and (max-width: 768px) {
  .chat {
    margin: 0;
    height: 100%;

    .chat-part2 {
      display: none;
    }

    .chat-team {
      display: block !important;
      position: absolute;
      font-size: 25px;
      top: 17px;
      left: 60px;
      z-index: 999;

      &:active {
        color: skyblue;
      }
    }

    .chat-tool {
      display: block !important;
      position: absolute;
      font-size: 25px;
      top: 13px;
      left: 20px;
      z-index: 999;

      &:active {
        color: skyblue;
      }
    }
  }
}
</style>
