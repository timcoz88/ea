<template>
  <el-card style="margin:20px;">
    <div class="df">
      <div>
        <el-button @click="immediateStop('immediate')">立即终止会话</el-button>
        <el-button @click="immediateStop">事务处理后会话</el-button>
      </div>
      <div>
        <el-button @click="callback">返回</el-button>
      </div>
    </div>
    <el-row :gutter="20" type="flex" style="margin-top:20px;">
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="common-page-title">服务器</span>
          </div>
          <el-row class="card-content">
            <el-col :sm="24" :lg="12" class="card-content-item">当前状态：{{ service.status }}
            </el-col>
            <el-col :sm="24" :lg="12" class="card-content-item">ID：{{ service.hostip }}</el-col>
            <el-col :sm="24" :lg="12" class="card-content-item">序列号：{{ service.serial_id }}</el-col>
            <el-col :sm="24" :lg="12" class="card-content-item">登录时间：{{ service.logon_time }}</el-col>
            <el-col :sm="24" :lg="12" class="card-content-item">数据库用户名：{{ service.username }}</el-col>
            <el-col :sm="24" :lg="12" class="card-content-item">类型：{{ service.type }}</el-col>
            <el-col :sm="24" :lg="12" class="card-content-item">操作系统进程：{{ service.sp_id }}</el-col>
            <el-col :sm="24" :lg="12" class="card-content-item">当前会话ID：{{ service.sid }}</el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="8" class="module-container">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="common-page-title">客户机</span>
          </div>
          <div class="card-content">
            <el-col :sm="24" :lg="12" class="card-content-item">操作系统用户名：{{ host.osuser }}
            </el-col>
            <el-col :sm="24" :lg="12" class="card-content-item">客户系统进程：{{ host.process }}</el-col>
            <el-col :sm="24" :lg="12" class="card-content-item">主机：{{ host.machine }}</el-col>
            <el-col :sm="24" :lg="12" class="card-content-item">终端：{{ host.terminal }}</el-col>
            <el-col :sm="24" :lg="12" class="card-content-item">应用程序：{{ host.program }}</el-col>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" type="flex" style="margin-top:20px;">
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="common-page-title">应用程序</span>
          </div>
          <el-row class="card-content">
            <el-col :sm="24" :lg="12" class="card-content-item">当前SQL：{{ proaram.sql_id }}
            </el-col>
            <el-col :sm="24" :lg="12" class="card-content-item">当前SQL开始执行：{{ proaram.sql_exec_start }}</el-col>
            <el-col :sm="24" :lg="12" class="card-content-item">上一条SQL ID：{{ proaram.prev_sql_id }}</el-col>
            <el-col :sm="24" :lg="12" class="card-content-item">上一条SQL开始执行时间：{{ proaram.prev_exec_start }}</el-col>
            <el-col :sm="24" :lg="12" class="card-content-item">当前模块：{{ proaram.module }}</el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="8" class="module-container">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="common-page-title">等待时间</span>
          </div>
          <div class="card-content">
            <el-col :sm="24" :lg="12" class="card-content-item">当前等待事件：{{ wait.event }}
            </el-col>
            <el-col :sm="24" :lg="12" class="card-content-item">当前等待类：{{ wait.hostip }}</el-col>
            <el-col :sm="24" :lg="12" class="card-content-item">等待持续时间：{{ wait.wait_class }}</el-col>
            <el-col :sm="24" :lg="12" class="card-content-item">P1：{{ wait.p1 }}</el-col>
            <el-col :sm="24" :lg="12" class="card-content-item">P1TEXT：{{ wait.p1text }}</el-col>
            <el-col :sm="24" :lg="12" class="card-content-item">P2：{{ wait.p2 }}
            </el-col>
            <el-col :sm="24" :lg="12" class="card-content-item">P2TEXT：{{ wait.p2text }}</el-col>
            <el-col :sm="24" :lg="12" class="card-content-item">失败堵塞会话：{{ wait.final_blocking_session }}</el-col>
            <el-col :sm="24" :lg="12" class="card-content-item">失败堵塞状态：{{ wait.final_blocking_status }}</el-col>
            <el-col :sm="24" :lg="12" class="card-content-item">失败堵塞实例：{{ wait.final_blocking_instance }}</el-col>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" type="flex" style="margin-top:20px;">
      <el-col :span="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="common-page-title">SQL明细</span>
          </div>
          <div class="card-content">
            <span>{{sql_text}}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
import { getDbSessionDetail, killLockWait } from '@/api/management'
import ManagementService from '@/services/modules/management'
export default {
  data() {
    return {
      wait: {},
      proaram: {},
      host: {},
      service: {},
      sql_text: ''
    }
  },
  created() {
    this.getSessionDetail()
  },
  methods: {
    callback() {
      const { hostip, dsn } = this.$route.query
      this.$router.push({ name: 'databaseMonitor', query: { hostip: hostip, dsn: dsn, componentName: 'sessionManage' }})
    },
    getSessionDetail() {
      const { hostip, dsn, sid, serial_id, inst_id } = this.$route.query
      const params = {
        hostip,
        dsn,
        SID: sid,
        SERIAL_ID: serial_id,
        INST_ID: inst_id
      }
      getDbSessionDetail(params)
        .then(({ results: data }) => {
          const { wait, host, proaram, service, sql_text } = data
          this.service = service
          this.host = host
          this.proaram = proaram
          this.wait = wait
          this.sql_text = sql_text
        }).catch(err => {
          this.$message.error(err.message)
        })
    },
    immediateStop(type) {
      const { hostip, dsn, sid, serial_id, inst_id } = this.$route.query
      const params = {
        hostip,
        dsn,
        type: type || '',
        kill_ids: [{ sid: sid.toString(), serial: serial_id.toString() }]
      }

      this.$confirm(`是否终止进程，该操作不可返回`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.eventList.push({ time: this.getNowFormatDate(), msg: `当前执行事件${sidList.length}个` })
          ManagementService.killSessions(params)
            .then(({ results: data }) => {
              this.$message.success('执行成功')
              this.eventList = [...this.eventList, ...data]
            })
            .catch(() => {
              this.eventList.push({ time: this.getNowFormatDate(), msg: `执行失败` })
            })
        })
        .catch(() => {})
    },
    getNowFormatDate() {
      const date = new Date()
      const seperator1 = '-'
      const seperator2 = ':'
      let month = date.getMonth() + 1
      let strDate = date.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      const currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
        ' ' + date.getHours() + seperator2 + date.getMinutes() +
        seperator2 + date.getSeconds()
      return currentdate
    }
  }
}
</script>
<style lang="sass" scoped>
.box-card
      .el-card__header
       padding: 10px
      .card-content
       font-size: 14px
       height: 160px
       overflow-y: auto
       .card-content-item
         line-height: 30px
         height: 30px
.df
    display: flex;
    justify-content: space-between;
</style>
