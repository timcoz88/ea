import request from '@/utils/request'

export function getUserList(params) {
  return request({
    url: 'v1/users',
    method: 'get',
    params
  })
}

export function deleteUser(id) {
  return request({
    url: `v1/users/${id}`,
    method: 'delete'
  })
}

export function updateUser(id, data) {
  return request({
    url: `v1/users/${id}`,
    data,
    method: 'patch'
  })
}
