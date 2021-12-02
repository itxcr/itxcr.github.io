const axios = require('axios')
const API = axios.create()
API.defaults.baseURL = 'http://127.0.0.1:3000'
API.defaults.headers['Content-Type'] = 'multipart/form-data'
API.defaults.transformRequest = (data, headers) => {
  const contentType = headers['Content-Type']
  if (contentType === 'application/x-www-form-urlencoded') return JSON.stringify(data)
  return data
}

API.interceptors.response.use(response => {
  return response.data
})
export default API