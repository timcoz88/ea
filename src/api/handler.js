import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/v1/s/paramiko/push',
    method: 'get',
    params
  })
}

export function fetchDetail(data) {
  return request({
    url: '/v1/s/paramiko/push',
    method: 'post',
    data
  })
}
