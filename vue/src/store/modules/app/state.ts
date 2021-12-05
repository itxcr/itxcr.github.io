export interface AppState {
  user: User
  token: string
  // device: Device
  mobile: boolean
  background: string
}

const appState: AppState = {
  user: {
    userId: '',
    username: '',
    password: '',
    avatar: '',
    createTime: 0,
  },
  token: '',
  mobile: false,
  // device: {
  //   engine: '',
  //   engineVs: '',
  //   platform: '',
  //   supporter: '',
  //   supporterVs: '',
  //   system: '',
  //   systemVs: '',
  // },
  background: '',
}

export default appState
