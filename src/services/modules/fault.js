import request from '@/services'

class FaultService {
  // 获取错误信息
  getErrorMsg(err) {
    const { message } = err
    if (!message) {
      throw new Error('数据格式错误')
    }
    throw new Error(message)
  }

  getWarningList(params) {
    return request.get('sw/moninfo', params)
  }

  analysisWarning(data = {}) {
    return request.patch(`sw/moninfo/${data.id}`, data)
  }

  getFaultWarningItem(id, params) {
    return request.get(`sw/moninfo/${id}`, params)
  }

  getHistory(data = {}) {
    return request.get('sw/moninfo/his', data)
  }
  getQueryDetail(chkid, params) {
    // window.open(targetRouter.href, "_blank");
    return request.post(`sw/moninfo/${chkid}/time`, params)
  }
}

export default new FaultService()
