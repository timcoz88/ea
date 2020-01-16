import request from '../index'

class UserApi {
  getUserList(data = {}) {
    return request.get('/auth/users', data)
  }
  deleteItem(id) {
    return request.delete(`/auth/users/${id}`)
  }
  updateUser(data = {}) {
    const { id } = data
    delete data.id
    return request.patch(`/auth/users/${id}`, data)
  }
  createUser(data = {}) {
    return request.post('/auth/users', data)
  }

  getRoles(data = {}) {
    return request.get('/roles', data)
  }

  createRole(data = {}) {
    return request.post(`/roles`, data)
  }

  updateRole(data = {}) {
    const { id } = data
    delete data.id
    return request.patch(`/roles/${id}`, data)
  }

  deleteRole(id) {
    return request.delete(`/roles/${id}`)
  }

  getSections() {
    return request.get('/sections')
  }
}

export default new UserApi()
