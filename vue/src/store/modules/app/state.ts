export interface AppState {
  user: User
  token: string
  device: Device
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
  device: {
    engine: '',
    engineVs: '',
    platform: '',
    supporter: '',
    supporterVs: '',
    system: '',
    systemVs: '',
  },
  background: '',
}

export default appState
