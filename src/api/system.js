import request from '@/utils/request'

export function getUserList(params) {
  return request({
    url: 'v1/users',
    method: 'get',
    params
  })
}

