import request from '@/utils/request'
export function databaseOverview(query) {
    return request({
      url: '/v1/dbs/card',
      method: 'get',
      params: query
    })
}
export function groupList() {
  return request({
    url: '/v1/dbs/oracle/groups',
    method: 'get'
  })
}
export function tps(query) {
  return request({
    url: '/v1/dbs/oracle/tps',
    method: 'post',
    data: query
  })
}

export function tpsSqlList(data) {
  return request({
    url: '/v1/dbs/oracle/topsql',
    method: 'post',
    data
  })
}