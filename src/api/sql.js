import request from '@/utils/request'

export function postDbFocus(data) {
  return request({
    url: '/v1/dbs/ping',
    method: 'post',
    data
  })
}

export function fetchList(params) {
  return request({
    url: '/v1/service/dbs',
    method: 'get',
    params
  })
}

export function fetchDbInfo(data) {
  return request({
    url: '/v1/dbs/focus',
    method: 'post',
    data
  })
}

export function fetchDbSessionList(params) {
  return request({
    url: '/v1/dbs/focus/sessions',
    method: 'get',
    params
  })
}
