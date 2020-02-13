import request from '@/utils/request'
export function upLoad(query) {
  return request({
    url: '/v1/autodeploy/deploytask/upload',
    method: 'put',
    headers: {
      'Content-Type': 'x-www-form-urlencoded'
    }
  })
}
export function operationList(query) {
  return request({
    url: '/v1/autodeploy/deploytasks',
    method: 'get',
    params: query
  })
}
export function operationDel(query) {
  return request({
    url: '/v1/autodeploy/deploytask/' + query.taskid,
    method: 'DELETE'
  })
}
export function operationDetail(query) {
  return request({
    url: 'v1/autodeploy/deploytask/' + query.taskid,
    method: 'get'
  })
}
export function operationSave(query) {
  return request({
    url: '/v1/autodeploy/deploytasks',
    method: 'post',
    data: query
  })
}
export function operationRun(query) {
  return request({
    url: '/v1/autodeploy/deploytask/run/' + query.taskid,
    method: 'get'
  })
}

export function operationRunLog(query) {
  return request({
    url: '/v1/autodeploy/deploytask/log/' + query.taskid,
    method: 'get'
  })
}
