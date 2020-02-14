import request from '@/utils/request'

export function getDbSessionDetail(params) {
  return request({
    url: '/v1/dbs/focus/lock/detail',
    method: 'post',
    data: params
  })
}
export function killLockWait(params) {
  return request({
    url: '/v1/dbs/focus/lock/kill',
    method: 'post',
    data: params
  })
}
export function topsqlDetail(params) {
  return request({
    url: '/v1/dbs/oracle/topsql/detail',
    method: 'post',
    data: params
  })
}

