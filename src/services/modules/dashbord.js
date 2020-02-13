
import request from '@/services'

class Service {
  getList(data = {}) {
    return request.get('/dash5', data)
  }

  dash3(data = {}) {
    return request.get('/dash3', data)
  }

  dash1(data = {}) {
    return request.get('/dash1', data)
  }

  dash2(data = {}) {
    return request.get('/dash2', data)
  }

  dash4(data = {}) {
    return request.get('/dash4', data)
  }

  getMoninfo(data = {}) {
    return request.get('/moninfo', data)
  }
}

export default new Service()
