import request from '@/utils/request'

export function operationList(query) {
  return request({
    url: '/ops/deploy_task/list',
    method: 'get',
    params: query
  })
}
export function operationDel(query) {
    return request({
      url: '/ops/deploy_task/delete',
      method: 'post',
      params: query
    })
}
export function operationDetail(query) {
    return request({
      url: '/ops/deploy_task/detail',
      method: 'get',
      params: query
    })
}
export function operationSave(query) {
    return request({
      url: '/ops/deploy_task/save',
      method: 'post',
      params: query
    })
}
export function operationRun(query) {
    return request({
      url: '/ops/deploy_task/run',
      method: 'post',
      params: query
    })
}

export function operationRunLog(query) {
    return request({
      url: '/ops/deploy_task/runlog',
      method: 'get',
      params: query
    })
}