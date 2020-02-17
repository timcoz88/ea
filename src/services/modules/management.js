import request from '@/services'

const statusMap = {
  0: '空闲',
  10: '正在执行',
  11: '执行成功',
  14: '执行失败'
}

class ManagementService {
  // 远程调度-搜索
  getManagementList(params = {}) {
    return request.get('proxy/v1/dbs/execute/rpt', params).then((data) => {
      console.log(data)
      data.results.results = data.results.results.map(v => {
        return Object.assign({}, v, {
          status: statusMap[v.tasksta]
        })
      })
      return data
    })
  }
  // 自动化巡检查看报告
  viewReportDetail(params) {
    return request.get('proxy/v1/dbs/execute/rpt/new', params)
  }
  // 自动化巡检查看日志
  viewLogDetail(params) {
    return request.get('proxy/v1/dbs/execute/rpt/new/status', params)
  }

  getPollingList(params) {
    return request.get('proxy/v1/dbs/rpts', params)
  }
  // 远程调度-获得作业程序
  getManagementProject(params) {
    return request.get('/eares', params)
  }
  // 远程调度-获得作业程序
  clearManagementProject(id, data) {
    return request.patch(`/hostinfo/${id}`, data)
  }

  // 远程调度-执行程序
  handleManagementProject(roleusers = 'all') {
    return request.post('/eares/job', {
      roleusers
    })
  }
  // sql执行计划
  getSqlPlanDetail(data) {
    return request.post('proxy/v1/dbs/table/analyse/sql/tp', data)
  }
  // sql 固定执行计划
  getFixPlanDetail(data) {
    return request.post('proxy/v1/dbs/table/analyse/sql/tp/sl', data)
  }
  // sql 固定执行计划
  getFixCuringPlanDetail(data) {
    return request.post('proxy/v1/dbs/table/analyse/sql/tp/curing', data)
  }
  // sql 固定执行计划
  cancelSqlPlan(data) {
    return request.post('proxy/v1/dbs/table/analyse/sql/tp/curing/delete', data)
  }
  // sql 固定执行计划
  confirmSqlPlan(data) {
    return request.post('proxy/v1/dbs/table/analyse/sql/tp/join', data)
  }
  // 远程调度-执行程序2
  handleManagementTwoProject(data) {
    return request.post('/push', data)
  }
  // 远程调度-执行程序2
  getMessages(id) {
    return request.get(`/messages/${id}`)
  }
  // 用户锁定
  userLock(data) {
    return request.post(`proxy/v1/dbs/table/analyse/lock/user`, data)
  }
  // 用户锁定
  sqlAnalyze(data, urlParams) {
    return request.post(`proxy/v1/dbs/table/analyse/sql?${urlParams}`, data)
  }
  // 用户解锁
  userUnLock(data) {
    return request.post(`proxy/v1/dbs/table/analyse/unlock/user`, data)
  }

  getMessagesList() {
    return request.get(`/messages`)
  }
  // 自送巡检列表
  getReportList(params = {}) {
    return request.get(`/rpt`, params)
  }
  // 自送巡检列表-健康分析
  getReportLog(id) {
    return request.get(`/rpt/${id}`)
  }

  getManagementDetail(taskid) {
    return request.get('/taskdetail/', {
      taskid
    })
  }
  // 自动巡检日志
  getAdminEvent(taskid) {
    return request.get(`/event/${taskid}`)
  }
  getDbManageList(params) {
    return request.get(`/dbinfo`, params)
  }
  // 会话管理
  postDbFocus(data) {
    return request.post(`/db/focus`, data)
  }
  // 会话管理列表
  getDbFocusList(data, urlParams) {
    return request.post(`/db/focus/sessions?${urlParams}`, data)
  }
  // 事务处理
  killSessions(data) {
    return request.post(`/dbs/focus/kill/sessions`, data)
  }
  // 运行事件
  getEventList(sid) {
    return request.get(`event/${sid}`)
  }
  // 锁等待
  getLockWait(data, urlParams) {
    return request.post(`proxy/v1/dbs/focus/lock?${urlParams}`, data)
  }// 锁等待 事务处理
  killLockWait(data, urlParams) {
    return request.post(`proxy/v1/dbs/focus/lock/kill`, data)
  }
  // 详情
  getLockWaitItemDetail(id, data) {
    return request.post(`proxy/v1/dbs/focus/lock/${id}`, data)
  }
  // 阻塞树分析
  getTreeAnalyze(data, urlParams) {
    return request.post(`proxy/v1/dbs/focus/lock/tree?${urlParams}`, data)
  }
  // 锁等待详情
  getDbSessionDetail(data) {
    return request.post(`proxy/v1/dbs/focus/lock/detail`, data)
  }
  // 表对象分析
  getTableAnalyzeList(data, urlParams) {
    return request.post(`proxy/v1/dbs/sql/manage?${urlParams}`, data)
  }
  // 表对象分析
  getSqlManageDetail(data) {
    return request.post(`/sql/manage/detail`, data)
  }
  // 表分析统计信息
  getAnalyzeList(data) {
    return request.post('proxy/v1/dbs/table/analyse/count', data)
  }
  // 表分析统计信息
  executeAnalyzeList(data) {
    return request.post('proxy/v1/dbs/table/analyse', data)
  }
  // 表分析统计信息
  getUserManageList(data, urlParams) {
    return request.post(`proxy/v1/dbs/table/analyse/users?${urlParams}`, data)
  }
  // 表分析统计信息
  getProfile(data) {
    return request.post(`proxy/v1/dbs/table/analyse/create/profile`, data)
  }
  // 表分析统计信息
  getTablespace(data) {
    return request.post(`proxy/v1/dbs/table/analyse/create/tablespace`, data)
  }
  // 表分析统计信息
  getOnece(data) {
    return request.post(`proxy/v1/dbs/table/analyse/create/tablespace/onece`, data)
  }
  // 表分析统计信息
  addUser(data) {
    return request.post(`proxy/v1/dbs/table/analyse/create/users`, data)
  }
  editorUser(data) {
    return request.post(`proxy/v1/dbs/table/analyse/update/users`, data)
  }
  getUserAdminDetail(data) {
    return request.post(`proxy/v1/dbs/table/analyse/role/users`, data)
  }
  getRolesList(data) {
    return request.post(`proxy/v1/dbs/table/analyse/role/names`, data)
  }
  userGrant(data) {
    return request.post(`proxy/v1/dbs/table/analyse/role/name/grant`, data)
  }
  userRevoke(data) {
    return request.post(`proxy/v1/dbs/table/analyse/role/name/revoke`, data)
  }
  getSystemAdmin(data) {
    return request.post(`proxy/v1/dbs/table/analyse/role/system`, data)
  }
  getObject(data) {
    return request.post(`proxy/v1/dbs/table/analyse/role/object`, data)
  }
  objectGrant(data) {
    return request.post(`proxy/v1/dbs/table/analyse/role/object/grant`, data)
  }
  objectRevoke(data) {
    return request.post(`proxy/v1/dbs/table/analyse/role/object/revoke`, data)
  }
}

export default new ManagementService()
