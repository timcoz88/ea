import request from '../index'

class Repository {
  connectTest(data = {}) {
    return request.post('/hostinfo/conntst', data)
  }

  addHost(data = {}) {
    return request.post('/hostinfo', data)
  }
  putHost(id, data = {}) { // 更新
    return request.patch(`/hostinfo/${id}`, data)
  }

  searchHost(data = {}) {
    return request.get('/hostinfo', data)
  }

  deleteHost(id) {
    return request.delete(`/hostinfo/${id}`)
  }

  modifyHost(data = {}) {
    return request.get('/hostmod', data)
  }

  searchResources(data = {}) {
    return request.get('/eares', data)
  }

  addResource(data = {}) {
    return request.post('/eares', data)
  }

  changeResource({ id, audsta }) {
    return request.put(`/eares/${id}`, {
      audsta
    })
  }

  deleteResource(id) {
    return request.delete(`/eares/${id}`)
  }

  // validateResource({id, audsta}) {
  //   return request.put('/eares/id', data)
  // }

  getDBList(data = {}) {
    return request.get('/dbinfo', data)
  }

  addDB(data = {}) {
    return request.post('/dbinfo', data)
  }

  changeDB(id, data = {}) {
    return request.put(`/dbinfo/${id}`, data)
  }

  deleteDB(id, data = {}) {
    return request.delete(`/dbinfo/${id}`, data)
  }

  getTaskList(data) {
    return request.get(`/crons`, data)
  }
  deleteTask(id) {
    return request.delete(`/crons/${id}`)
  }
  changeTaskStatus(id, data) {
    return request.patch(`/crons/${id}`, data)
  }
  getEmailsList(params) {
    return request.get(`/emails`, params)
  }
  changeEmailSetting(id, data) {
    return request.patch(`/emails/${id}`, data)
  }
  delEmailSetting(id, data) {
    return request.delete(`/emails/${id}`, data)
  }
  createdEmailSetting(data) {
    return request.post(`/emails`, data)
  }
  getEaresList() {
    return request.get(`/eares`)
  }
  getHostinfoList() {
    return request.get(`/hostinfo`)
  }
  createTask(data) {
    return request.post(`/crons`, data)
  }
  getSqlList(params) {
    return request.get(`/sqls`, params)
  }
  changeSqlSetting(id, data) {
    return request.patch(`/sqls/${id}`, data)
  }
  delSqlSetting(id, data) {
    return request.delete(`/sqls/${id}`, data)
  }
  createdSqlSetting(params) {
    return request.post(`/sqls`, params)
  }
  getTermMsg(params) {
    return request.post(`/terminal`, params)
  }

  // connectTestDB(data = {}) {
  //   return request.post('/dbinfo/conntst', data)
  // }
}

export default new Repository()
