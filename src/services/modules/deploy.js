import request from '../index'

class Deploy {
  login(data = {}) {
    return request.post('/v1/users/login', data)
  }
}

export default new Deploy()
