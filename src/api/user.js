import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'v1/users/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: 'v1/users/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
