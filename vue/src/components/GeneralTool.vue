<template>
  <div class="tool">
    <div class="tool-avatar">
      <div class="tool-avatar-img" @click="showUserInfo('showUserModal')">
        <img v-if="user" :src="user.avatar" alt="" />
      </div>
      <div class="tool-avatar-name">{{ user.username }}</div>
    </div>
    <!--    <a-icon type="skin" class="tool-skin icon" @click="showBackgroundModal = true" />-->

    <a-icon class="tool-out icon" type="poweroff" @click="logout" />

    <a-modal title="用户信息" :visible="showUserModal" footer="" @cancel="showUserModal = false">
      <div class="tool-user">
        <div @mouseover="showUpload = true" @mouseleave="showUpload = false" class="tool-user-avatar" :class="{ active: showUpload || uploading }">
          <a-avatar :src="user.avatar" class="img" :size="120"></a-avatar>
          <a-upload v-if="showUpload && !uploading" class="tool-user-upload" :show-upload-list="false" :before-upload="beforeUpload">
            <div class="text">
              <a-icon type="upload" style="margin-right: 4px" />
              <span>更换头像</span>
            </div>
          </a-upload>
          <a-icon class="loading" v-if="uploading" type="loading" spin />
        </div>

        <div class="tool-user-info">
          <div class="tool-user-title">更改用户名</div>
          <a-input class="tool-user-input" v-model="username" placeholder="请输入用户名"></a-input>
          <a-button type="primary" @click="changeUserName">确认</a-button>
        </div>

        <div class="tool-user-info">
          <div class="tool-user-title">更改密码</div>
          <a-input-password class="tool-user-input" v-model="password" placeholder="请输入密码"></a-input-password>
          <a-button type="primary" @click="changePassword">确认</a-button>
        </div>
      </div>
    </a-modal>

    <!--    <a-modal title="主题" :visible="showBackgroundModal" footer="" @cancel="showBackgroundModal = false">-->
    <!--      <div class="tool-user-info">-->
    <!--        <div class="tool-user-title" style="width: 65px">-->
    <!--          <span>背景图</span>-->
    <!--          <a-tooltip placement="topLeft" arrow-point-at-center>-->
    <!--            <div slot="title">-->
    <!--              <span>输入空格时为默认背景, 支持 jpg, png, gif等格式</span>-->
    <!--            </div>-->
    <!--            <a-icon type="exclamation-circle" style="margin-left: 5px" />-->
    <!--          </a-tooltip>-->
    <!--        </div>-->
    <!--        <a-input v-model="background" class="tool-user-input" placeholder="请输入背景图片网址"></a-input>-->
    <!--        <a-button type="primary" @click="changeBackground">确认</a-button>-->
    <!--      </div>-->
    <!--      <div class="tool-recommend">-->
    <!--        <div class="recommend" @click="setBackground('https://39.106.167.191:19000/public/images/wallhaven-rdjw2j_3840x2880.png')">-->
    <!--          <img src="https://39.106.167.191:19000/public/images/wallhaven-rdjw2j_3840x2880.png" alt="" />-->
    <!--          <span class="text">默认</span>-->
    <!--        </div>-->

    <!--        <div class="recommend" @click="setBackground('https://39.106.167.191:19000/public/images/wallhaven-o36zv9_3840x2880.png')">-->
    <!--          <img src="https://39.106.167.191:19000/public/images/wallhaven-o36zv9_3840x2880.png" alt="" />-->
    <!--          <span class="text">背景1</span>-->
    <!--        </div>-->

    <!--        <div class="recommend" @click="setBackground('https://39.106.167.191:19000/public/images/wallhaven-y8853x_3840x2160.png')">-->
    <!--          <img src="https://39.106.167.191:19000/public/images/wallhaven-y8853x_3840x2160.png" alt="" />-->
    <!--          <span class="text">背景2</span>-->
    <!--        </div>-->

    <!--        <div class="recommend" @click="setBackground('https://39.106.167.191:19000/public/images/wallhaven-729zz9_3840x2160.png')">-->
    <!--          <img src="https://39.106.167.191:19000/public/images/wallhaven-729zz9_3840x2160.png" alt="" />-->
    <!--          <span class="text">背景3</span>-->
    <!--        </div>-->

    <!--        <div class="recommend" @click="setBackground('https://39.106.167.191:19000/public/images/wallhaven-v9p1dl_3840x2160.png')">-->
    <!--          <img src="https://39.106.167.191:19000/public/images/wallhaven-v9p1dl_3840x2160.png" alt="" />-->
    <!--          <span class="text">背景4</span>-->
    <!--        </div>-->

    <!--        <div class="recommend" @click="setBackground('https://39.106.167.191:19000/public/images/wallhaven-72pqze_3840x2160.png')">-->
    <!--          <img src="https://39.106.167.191:19000/public/images/wallhaven-72pqze_3840x2160.png" alt="" />-->
    <!--          <span class="text">背景5</span>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </a-modal>-->
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { setUserAvatar } from '@/api/apis'
import { DEFAULT_BACKGROUND, DEFAULT_GROUP } from '@/config'
import { namespace } from 'vuex-class'
import * as apis from '@/api/apis'
import { processReturn, nameVerify, passwordVerify } from '@/utils/common.ts'

const appModule = namespace('app')
const chatModule = namespace('chat')

@Component({})
export default class GeneralTool extends Vue {
  @appModule.Getter('user') user!: User
  @appModule.Mutation('set_background') setBackground!: Function
  @appModule.Mutation('set_user') setUser!: Function

  @chatModule.Getter('socket') socket: any
  @chatModule.Mutation('set_user_gather') setUserGather!: Function

  showUpload: boolean = false
  showUserModal: boolean = false
  showBackgroundModal: boolean = false

  username: string = ''
  password: string = ''
  background: string = ''
  uploading: boolean = false
  avatar: any = ''

  @Watch('user')
  userChange() {
    this.username = this.user.username
    this.password = this.user.password
  }

  created() {
    this.username = this.user.username
    this.password = this.user.password
  }

  logout() {
    this.$emit('logout')
  }

  showUserInfo() {
    this.username = this.user.username
    this.showUserModal = true
  }

  async changeUserName() {
    if (!nameVerify(this.username)) {
      return
    }
    let user: User = JSON.parse(JSON.stringify(this.user))
    user.username = this.username
    let res = await apis.patchUserName(user)
    // @ts-ignore
    let data = processReturn(res)
    if (data) {
      this.setUser(data)
      this.setUserGather(data)
      // 通知其他用户个人信息改变
      this.socket.emit('joinGroupSocket', {
        groupId: DEFAULT_GROUP,
        userId: data.userId,
      })
    }
  }

  async changePassword() {
    if (!passwordVerify(this.password)) {
      return
    }
    let user: User = JSON.parse(JSON.stringify(this.user))
    let res = await apis.patchPassword(user, this.password)
    // @ts-ignore
    let data = processReturn(res)
    if (data) {
      this.setUser(data)
      this.setUserGather(data)
    }
  }

  beforeUpload(file: any) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/gif'
    if (!isJpgOrPng) {
      return this.$message.error('请上传jpeg/jpg/png/gif格式的图片!')
    }
    const isLt1M = file.size / 1024 / 1024 < 0.5
    if (!isLt1M) {
      return this.$message.error('图片必须小于500K!')
    }
    this.avatar = file
    this.handleUpload()
    return false
  }

  async handleUpload() {
    this.uploading = true
    const formData = new FormData()
    formData.append('avatar', this.avatar)
    formData.append('userId', this.user.userId)
    formData.append('password', this.user.password)
    // @ts-ignore
    let data = processReturn(await setUserAvatar(formData))
    if (data) {
      this.setUser(data)
      this.setUserGather(data)
      this.uploading = false
      this.showUpload = false
      // 通知其他用户个人信息改变
      this.socket.emit('joinGroupSocket', {
        groupId: DEFAULT_GROUP,
        userId: data.userId,
      })
    }
  }

  changeBackground() {
    if (!this.background.trim().length) {
      this.setBackground(DEFAULT_BACKGROUND)
    } else {
      this.setBackground(this.background)
    }
    this.showBackgroundModal = false
  }
}
</script>
<style lang="scss" scoped>
.tool {
  padding: 10px 5px;
  height: 98%;
  position: relative;

  .tool-avatar {
    margin-top: 3px;

    .tool-avatar-img {
      margin: 0 auto;
      width: 55px;
      height: 55px;
      border-radius: 50%;
      overflow: hidden;
      cursor: pointer;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .tool-avatar-name {
      color: #fff;
      overflow: hidden; //超出的文本隐藏
      text-overflow: ellipsis; //溢出用省略号显示
      white-space: nowrap; //溢出不换行
      margin-top: 2px;
    }
  }

  .tool-skin {
    bottom: 70px;
  }

  .tool-out {
    bottom: 20px;
  }

  .icon {
    display: flex;
    flex-direction: column;
    position: absolute;
    left: 25px;
    font-size: 25px;
    cursor: pointer;
    z-index: 100;

    &:hover {
      color: skyblue;
    }
  }
}

.tool-user {
  text-align: center;
  font-size: 16px;

  .tool-user-avatar {
    position: relative;
    width: 120px;
    overflow: hidden;
    margin: 0 auto 24px;
    border-radius: 50%;
    cursor: pointer;

    .tool-user-upload {
      .text {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        line-height: 120px;
        font-weight: bold;
      }
    }

    .loading {
      position: absolute;
      top: 50%;
      left: 50%;
      margin: -18px 0 0 -18px;
      font-size: 35px;
      font-weight: bold;
      color: #fff;
    }

    .img {
      transition: 0.2s all linear;
    }

    &.active {
      .img {
        filter: blur(3px);
      }
    }
  }
}

.tool-user-info {
  display: flex;
  justify-content: left;
  align-items: center;

  .tool-user-input {
    flex: 1;
    margin-right: 5px;
  }

  .tool-user-title {
    display: flex;
    align-items: center;
    width: 90px;
    text-align: left;
    font-weight: bold;
    word-break: keep-all;
    margin-right: 15px;
  }

  &:nth-child(2) {
    margin-bottom: 15px;
  }
}

.tool-recommend {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;

  .recommend {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    width: 100px;
    height: 100px;
    margin: 15px 10px 0;
    overflow: hidden;
    cursor: pointer;
    transition: 0.3s all linear;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    span {
      position: absolute;
      color: rgba(255, 255, 255, 0.85);
      font-weight: 600;
      transition: 0.3s all linear;
      opacity: 0;
    }

    &:hover {
      box-shadow: 1px 5px 10px gray;

      span {
        opacity: 1;
      }
    }
  }
}

@media screen and (max-width: 788px) {
  .tool-recommend {
    font-size: 12px;

    .recommend {
      width: 80px;
      height: 80px;
    }
  }
}
</style>
