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
// 删除任务
export function delTask(id, data) {
  return request({
    url: `v1/cy_aps/remove/${id}`,
    method: 'delete',
    data
  })
}
// 更新任务
export function updateTask(id, data) {
  return request({
    url: `v1/cy_aps/reschedule/${id}`,
    method: 'put',
    data
  })
}

// 上传资源
// export function uploadShell(id, data) {
//   return request({
//     url: `v1/s/paramiko/upload/${id}`,
//     method: 'post',
//     data
//   })
// }
export function uploadShell(data) {
  return request({
    url: 'v1/s/paramiko/upload',
    method: 'put',
    data
  })
}

// 删除脚本资源
export function delShell(id, data) {
  return request({
    url: `v1/s/paramiko/files/${id}`,
    method: 'delete',
    data
  })
}

// 删除脚本资源
export function confirmShell(id, data) {
  return request({
    url: `v1/s/paramiko/files/${id}`,
    method: 'patch',
    data
  })
}

// 删除脚本资源
export function updateShell(id, data) {
  return request({
    url: `v1/s/paramiko/files/${id}`,
    method: 'put',
    data
  })
}

// 删除数据库资源
export function delDb(id, data) {
  return request({
    url: `v1/service/dbs/${id}`,
    method: 'delete',
    data
  })
}

// 更新数据库资源
export function updateDb(id, data) {
  return request({
    url: `v1/service/dbs/${id}`,
    method: 'put',
    data
  })
}

export function deleteHost(id) {
  return request({
    url: `v1/service/hosts/${id}`,
    method: 'delete'
  })
}

export function updateHost(id, data) {
  return request({
    url: `v1/service/hosts/${id}`,
    method: 'patch',
    data
  })
}

export function collectionList(params) {
  return request({
    url: 'v1/service/records',
    method: 'get',
    params
  })
}

export function updateCollectionList(id, data) {
  return request({
    url: `v1/service/records/${id}`,
    method: 'patch',
    data
  })
}

export function getAuditList(id, params) {
  return request({
    url: `v1/wiki/audits`,
    method: 'get',
    params
  })
}

export function addDb(data) {
  return request({
    url: '/v1/service/dbs',
    method: 'post',
    data
  })
}

export function emailList(params) {
  return request({
    url: '/v1/users/sends',
    method: 'get',
    params
  })
}

export function delEmail(id) {
  return request({
    url: `/v1/users/sends/${id}`,
    method: 'delete'
  })
}

export function editEmail(id, data) {
  return request({
    url: `/v1/users/sends/${id}`,
    method: 'patch',
    data
  })
}

export function addEmail(data) {
  return request({
    url: '/v1/users/sends',
    method: 'post',
    data
  })
}

export function downloadShell(id, params) {
  return request({
    url: `/v1/s/paramiko/download/${id}`,
    method: 'get',
    params
  })
}

export function postServiceHost(data) {
  return request({
    url: 'v1/service/hosts',
    method: 'post',
    data
  })
}

export function getWarningSqlList(params) {
  return request({
    url: 'v1/sw/sqls',
    method: 'get',
    params
  })
}

export function delWarningSql(id, data) {
  return request({
    url: `v1/sw/sqls/${id}`,
    method: 'delete',
    data
  })
}

export function updateWarningSql(id, data) {
  return request({
    url: `v1/sw/sqls/${id}`,
    method: 'patch',
    data
  })
}

export function ExcelPingHost(data) {
  return request({
    url: `v1/service/ping`,
    method: 'post',
    data
  })
}

export function ExcelUpdateHost(data) {
  return request({
    url: `v1/service/update`,
    method: 'post',
    data
  })
}

export function ExcelSaveHost(data) {
  return request({
    url: `v1/service/save`,
    method: 'post',
    data
  })
}

export function killSession(data) {
  return request({
    url: `/v1/dbs/focus/kill/sessions`,
    method: 'post',
    data
  })
}

