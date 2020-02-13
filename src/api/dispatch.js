import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: 'v1/service/hosts',
    method: 'get',
    params
  })
}

export function getProcedure(params) {
  return request({
    url: '/v1/s/paramiko/files',
    method: 'get',
    params
  })
}
// 执行程序
export function executeProcedure(data) {
  return request({
    url: '/v1/s/paramiko/push/su',
    method: 'post',
    data
  })
}

// 执行程序
export function getDispatchHistory(params) {
  return request({
    url: '/v1/service/shell/his',
    method: 'get',
    params
  })
}

// 执行程序
export function getDispatchDetail(params) {
  return request({
    url: '/v1/service/shell/new',
    method: 'get',
    params
  })
}
