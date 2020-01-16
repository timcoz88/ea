import request from '@/utils/request'

class FaultService {
  // 获取错误信息
  getErrorMsg(err) {
    const { message } = err
    if (!message) {
      throw new Error('数据格式错误')
    }
    throw new Error(message)
  }

  getWarningList(data = {}) {
    return request.get('/moninfo', data)
  }

  analysisWarning(data = {}) {
    return request.patch(`/moninfo/${data.id}`, data)
  }

  getFaultWarningItem(id, params) {
    return request.get(`/moninfo/${id}`, params)
  }

  getHistory(data = {}) {
    return request.get('/moninfo', data)
  }
  getQueryDetail(chkid, params) {
    // window.open(targetRouter.href, "_blank");
    return request.get(`sql/${chkid}`, params)
  }
}

export default new FaultService()
