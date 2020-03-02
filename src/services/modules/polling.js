import request from '@/services'

function handleResponse({ data }) {
  if (data.state !== 0) {
    return Promise.reject(data.msg)
  }
  return data
}

class PollingService {
  // 获取错误信息
  getErrorMsg(err) {
    const { message } = err
    if (!message) {
      throw new Error('数据格式错误')
    }
    throw new Error(message)
  }

  // 健康分析-搜索
  async getHealthList(params) {
    return request.get('/rptinfo', params).then(handleResponse).then(data => {
      return data
    })
  }

  // 自动巡检-查看报告
  async getPollingReport(host_ip, rptid) {
    const data = await request.get('/viewrpt/', {
      host_ip,
      rptid
    })
    if (data.state !== 0) {
      throw this.getErrorMsg(data)
    }
    return data
  }
  // 自动化巡检查看日志
  viewLogDetail(params) {
    return request.get('proxy/v1/dbs/execute/rpt/new/status', params)
  }
  // 自动巡检列表
  // getReportList(params = {}) {
  //   return request.post('/health/job', params).then(handleResponse).then(data => {
  //     data.results = data.results.map(v => {
  //       return Object.assign({}, v, {
  //         status: statusMap[v.tasksta]
  //       })
  //     })
  //     return data
  //   })
  // }

  doHealth(params = {}) {
    return request.post('/health/job', params)
  }

  doHealth1(params = {}) {
    return request.post('/s/paramiko/push/rpt', params)
  }

  // 自动巡检-查看日志
  getPollLog(id) {
    return request.get(`/hostinfo/${id}`)
  }

  getPollingReportList(params) {
    return request.get('/rpts', params)
  }

  getReportDetail(id) {
    return request.get('/rptinfo/detail/', {
      rptid: id
    })
  }

  // 自动巡检-执行巡检
  async handelDealCheck(iplist) {
    const data = await request.post('/dbcheck/', iplist)
    if (data.state !== 0) {
      throw this.getErrorMsg(data)
    }
    return data
  }
}

export default new PollingService()
