import axios from 'axios'
import qs from 'qs'
import config from './config.js'

var api = axios.create(config)

api.interceptors.request.use(config => {
  return config
}, error => {
  return Promise.reject(error)
})

api.interceptors.response.use(response => {
  return response.data
}, error => {
  console.log('error')
  return Promise.reject(error)
})

const getHeader = () => {
  var headers = {}
  return headers
}
export default {
  put (url, params) {
    return api({
      method: 'put',
      url,
      data: params,
      headers: getHeader()
    })
  },
  delete (url, params) {
    return api({
      method: 'delete',
      url,
      data: params,
      headers: getHeader()
    })
  },
  post (url, params) {
    return api({
      method: 'post',
      url,
      data: params,
      headers: getHeader()
    })
  },
  postForm (url, params) {
    var headers = getHeader()
    headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    return api({
      method: 'post',
      url,
      data: qs.stringify(params),
      headers
    })
  },
  get (url, params) {
    return api({
      method: 'get',
      url,
      params,
      headers: getHeader()
    })
  }
}
