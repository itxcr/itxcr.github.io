import axios, { AxiosInstance } from 'axios'
import { socketUrl } from '@/api/fetch/config'
import { requestFail, requestSuccess, responseFail, responseSuccess } from '@/api/fetch/interceptors'

const fetch: AxiosInstance = axios.create({
  timeout: 60000,
  baseURL: socketUrl,
  headers: {
    'Cache-Control': 'no-catch',
    Pragma: 'no-cache',
  },
})

fetch.interceptors.request.use(requestSuccess, requestFail)
fetch.interceptors.response.use(responseSuccess, responseFail)

export default fetch
