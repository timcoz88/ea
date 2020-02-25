import request from '@/utils/request'
export function mysqlInfor(query) {
  return request({
    url: '/v1/dbs/mysql/info',
    method: 'post',
    data: query
  })
}
export function mysqlTreeWait(query) {
  return request({
    url: '/v1/dbs/mysql/wait',
    method: 'post',
    data: query
  })
}
export function mysqlSessionKill(query) {
  return request({
    url: '/v1/dbs/mysql/session/kill',
    method: 'post',
    data: query
  })
}
export function mysqlTopSqlDetail(query) {
  return request({
    url: '/v1/dbs/mysql/topsql/detail',
    method: 'post',
    data: query
  })
}
export function mysqlTreeWaitKill(query) {
  return request({
    url: '/v1/dbs/mysql/wait/kill',
    method: 'post',
    data: query
  })
}
export function mysqlSessionCount(query) {
  return request({
    url: '/v1/dbs/mysql/session/count',
    method: 'post',
    data: query
  })
}
