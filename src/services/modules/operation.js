import request from '../index'

class OperationApi {
  getOperationHistoryList(data = {}) {
    return request.get('/event/msg', data)
  }
}

export default new OperationApi()
