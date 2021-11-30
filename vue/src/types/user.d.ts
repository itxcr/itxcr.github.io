interface User {
  userId: string
  username: string
  password: string
  avatar: string
  role?: string
  tag?: string
  createTime: number
}

interface Device {
  engine: string,
  engineVs: string,
  platform: string,
  supporter: string,
  supporterVs: string,
  system: string,
  systemVs: string
}
