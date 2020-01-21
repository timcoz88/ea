import path from 'path'
import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import { getToken } from '@/utils/auth'

const options = {
  baseURL: process.env.BASE_API,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
}

const service = axios.create(options)

// request 拦截器
service.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers['X-Auth-Token'] = token
    }
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  (response) => {
    const { data } = response
    if (data.error_code !== 0) {
      Message.error(data.message)
      return Promise.reject(new Error(data.message))
    }
    return data
  },
  (error) => {
    // 超时的情况下 报错超时
    // 请求接口出错的情况下 后台返回message 和 code 展现后台返回错误 反之返回 response headers
    const _response = error.response
    const { status } = _response
    if (status === 401) {
      MessageBox.alert('登录失效请重新登录').then(() => {
        location.href = '/login'
      })
      return Promise.reject(new Error('登录失效请重新登录'))
    }
    let code
    let message
    if (_response && _response.data && typeof _response.data === 'object') {
      code = _response.data.error_code ? _response.data.error_code : _response.status
      message = _response.data.message
        ? `${_response.data.message} (${code})`
        : `接口请求报错 (${code})`
    } else {
      message = error.code === 'ECONNABORTED' ? '请求超时' : '服务异常'
    }
    Message({
      message,
      type: 'error',
      duration: 2000
    })
    if (_response && _response.status === 401) {
      localStorage.removeItem('user')
    }
    return Promise.reject(error)
  }
)

function urlChannel(url) {
  const pathArr = url.split('/')
  const baseUrl = pathArr[0] || pathArr[1]
  if (baseUrl === 'api') {
    return url
  }
  return path.join('/v1', url)
}

export default {
  get(url, data) {
    url = urlChannel(url)
    return service.get(url, {
      params: data
    })
  },
  delete(url, data) {
    url = urlChannel(url)
    return service.delete(url, {
      params: data,
      data
    })
  },
  post(url, data) {
    url = urlChannel(url)
    return service.post(url, data)
  },
  put(url, data) {
    url = urlChannel(url)
    return service.put(url, data)
  },
  patch(url, data) {
    url = urlChannel(url)
    return service.patch(url, data)
  }
}
