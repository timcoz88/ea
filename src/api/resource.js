import request from '@/utils/request'

export function getServiceHost(params) {
  return request({
    url: 'v1/service/hosts',
    method: 'get',
    params
  })
}

export function getDbList(params) {
  return request({
    url: 'v1/service/dbs',
    method: 'get',
    params
  })
}

export function getShellList(params) {
  return request({
    url: 'v1/s/paramiko/files',
    method: 'get',
    params
  })
}

export function getTaskList(params) {
  return request({
    url: 'v1/cy_aps',
    method: 'get',
    params
  })
}

