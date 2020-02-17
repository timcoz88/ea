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

// mysql
export function mysqlSessionList(params) {
  return request({
    url: '/v1/dbs/mysql/session',
    method: 'post',
    data: params
  })
}
export function mysqlSessionDetail(params) {
  return request({
    url: '/v1/dbs/mysql/session/detail',
    method: 'post',
    data: params
  })
}
export function mysqlTopSqlList(params) {
  return request({
    url: '/v1/dbs/mysql/topsql',
    method: 'post',
    data: params
  })
}


