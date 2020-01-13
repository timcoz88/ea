import request from '@/utils/request'

// 左右布局饼图
export function getDashboard(params) {
  return request({
    url: 'v1/web/dash1',
    method: 'get',
    params
  })
}

// 预警模块
export function getDashboard4(params) {
  return request({
    url: 'v1/web/dash4',
    method: 'get',
    params
  })
}

// 表格模块
export function getDashboard5(params) {
  return request({
    url: 'v1/web/dash5',
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
