import request from '@/utils/request'

export function getPluginList(params) {
  return request({
    url: 'v1/managers',
    method: 'get',
    params
  })
}

// 开启关闭按钮

export function operateStatus(data) {
  return request({
    url: 'v1/managers/update',
    method: 'post',
    data
  })
}

export function reload() {
  return request({
    url: 'v1/reload',
    method: 'get'
  })
}
// 上传
export function uploadPlugin(data) {
  return request({
    url: 'v1/managers/upload',
    method: 'put',
    data
  })
}
