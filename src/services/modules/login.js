import request from '../index'

class Login {
  login(data = {}) {
    return request.post('/auth/tokens', data)
  }

  logout() {
    return request.get('/auth/logout')
  }
}

export default new Login()
