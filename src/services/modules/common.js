/*
 * @Author: liujie3612
 * @Date:   2018-03-30 11:25:17
 * @Last Modified by: ihoey
 * @Last Modified time: 2018-04-11 10:53:23
 */

import axios from '@/services'

const LOGIN_API = process.env.LOGIN_API
class CommonService {
  constructor(http) {
    this.http = http
  }
  /**
   * baseUrl:https://leyu-admin2.dadaabc.us/api
   * https://admin.dadaabc.com:10013
   * https://test4-ddshow.dadaabc.us
   */
  getConfigUrl() {
    return this.http.post(`${LOGIN_API}/dadashow/get_config_info`)
  }
  getConfig() {
    return this.http.post(`${LOGIN_API}/dadashow/get_basic_info`)
  }
  signOut() {
    return this.http.post('/api/welcome/logout')
  }
}

export default new CommonService(axios)
