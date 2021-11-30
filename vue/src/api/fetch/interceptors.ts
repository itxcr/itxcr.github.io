import cookie from 'js-cookie'
import { AxiosRequestConfig, AxiosResponse } from 'axios'

// 请求拦截器
export const requestSuccess = (request: AxiosRequestConfig) => {
  const token = cookie.get('token')
  // @ts-ignore
  request.headers.token = token
  return request
}
export const requestFail = (error: AxiosRequestConfig) => {
  return Promise.reject(error)
}

// 响应拦截器
export const responseSuccess = (response: AxiosResponse) => {
  return response
}

export const responseFail = (error: AxiosResponse) => {
  return Promise.reject(error)
}
