<template>
  <div class="page p20">
    <div class="filter-container">
      <div class="common-page-title mt-10 mb-20">
        会话详情
      </div>
    </div>
    <el-button-group>
      <el-button type="primary" @click="immediateStop('immediate')">立即终止会话</el-button>
      <el-button type="primary" @click="immediateStop">事务处理后终止</el-button>
    </el-button-group>
    <div class="page-session-detail">
      <el-row :gutter="20">

        <el-col :span="12" style="padding-top: 10px; padding-bottom: 10px">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span class="common-page-title">服务器</span>
            </div>
            <el-row class="card-content">
              <el-col :sm="24" :lg="12" class="card-content-item">当前状态：{{ service.status }}</el-col>
              <el-col :sm="24" :lg="12" class="card-content-item">序列号：{{ service.serial_id }}</el-col>
              <el-col :sm="24" :lg="12" class="card-content-item">数据库用户名：{{ service.username }}</el-col>
              <el-col :sm="24" :lg="12" class="card-content-item">操作系统进程ID：{{ service.sp_id }}</el-col>
              <el-col :sm="24" :lg="12" class="card-content-item">登录时间：{{ service.logon_time }}</el-col>
              <el-col :sm="24" :lg="12" class="card-content-item">类型：{{ service.type }}</el-col>
              <el-col :sm="24" :lg="12" class="card-content-item">操作系统进程：{{ service.sp_id }}</el-col>
              <el-col :sm="24" :lg="12" class="card-content-item">当前会话id：{{ service.sid }}</el-col>
            </el-row>
          </el-card>
        </el-col>
        <el-col :span="12" style="padding-top: 10px; padding-bottom: 10px">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span class="common-page-title">客户机</span>
            </div>
            <el-row class="card-content">
              <el-col :sm="24" :lg="12" class="card-content-item">操作系统用户名：{{ host.osuser }}</el-col>
              <el-col :sm="24" :lg="12" class="card-content-item">客户系统进程：{{ host.process }}</el-col>
              <el-col :sm="24" :lg="12" class="card-content-item">主机：{{ host.machine }}</el-col>
              <el-col :sm="24" :lg="12" class="card-content-item">终端：{{ host.terminal }}</el-col>
              <el-col :sm="24" :lg="12" class="card-content-item">应用程序：{{ host.program }}</el-col>
            </el-row>

          </el-card>
        </el-col>
        <el-col :span="12" style="padding-top: 10px; padding-bottom: 10px">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span class="common-page-title">应用程序</span>
            </div>
            <el-row class="card-content">
              <el-col :sm="24" :lg="12" class="card-content-item">当前SQL：{{ proaram.sql_id }}
              </el-col>
              <el-col :sm="24" :lg="12" class="card-content-item">当前SQL开始执行时间：{{ proaram.sql_exec_start }}</el-col>
              <el-col :sm="24" :lg="12" class="card-content-item">上一条SQL ID：{{ proaram.prev_sql_id }}</el-col>
              <el-col :sm="24" :lg="12" class="card-content-item">上一条SQL开始执行时间：{{ proaram.prev_exec_start }}</el-col>
              <el-col :sm="24" :lg="12" class="card-content-item">当前模块：{{ proaram.module }}</el-col>
              <!--<el-col :sm="24" :lg="12" class="card-content-item">带有等待信息的跟踪：{{ }}</el-col>-->
              <!--<el-col :sm="24" :lg="12" class="card-content-item">带有绑定信息的跟踪：{{ }}</el-col>-->
              <!--<el-col :sm="24" :lg="12" class="card-content-item">打开的游标程序：{{  }}</el-col>-->
            </el-row>

          </el-card>
        </el-col>
        <el-col :span="12" style="padding-top: 10px; padding-bottom: 10px">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span class="common-page-title">等待时间</span>
            </div>
            <el-row class="card-content">
              <el-col :sm="24" :lg="12" class="card-content-item">当前等待事件：{{ wait.event }}</el-col>
              <el-col :sm="24" :lg="12" class="card-content-item">当前等待类：{{ wait.wait_class }}</el-col>
              <el-col :sm="24" :lg="12" class="card-content-item">等待持续时间：{{ wait.dbnm }}</el-col>
              <el-col :sm="24" :lg="12" class="card-content-item">P1：{{ wait.p1 }}</el-col>
              <el-col :sm="24" :lg="12" class="card-content-item">P1TEXT：{{ wait.p1text }}</el-col>
              <el-col :sm="24" :lg="12" class="card-content-item">P2：{{ wait.p2 }}</el-col>
              <el-col :sm="24" :lg="12" class="card-content-item">P2TEXT：{{ wait.p2text }}</el-col>
              <el-col :sm="24" :lg="12" class="card-content-item">失败堵塞会话: {{ wait.final_blocking_session }}</el-col>
              <el-col :sm="24" :lg="12" class="card-content-item">失败堵塞状态: {{ wait.final_blocking_status }}</el-col>
              <el-col :sm="24" :lg="12" class="card-content-item">失败堵塞实例: {{ wait.final_blocking_instance }}</el-col>
            </el-row>

          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import ManagementService from 'service/management'

export default {
  components: {},

  data() {
    return {
      wait: {},
      host: {},
      proaram: {},
      service: {}
    }
  },

  created() {
    this.getDbSessionDetail()
  },
  methods: {
    getDbSessionDetail() {
      const { hostip, sid, serial_id, inst_id } = this.$route.query
      const params = {
        hostip,
        ids: [`${sid}`, `${serial_id}`, `${inst_id}`]
      }
      ManagementService.getDbSessionDetail(params)
        .then(({ results: data }) => {
          const { wait, host, proaram, service } = data
          this.service = service
          this.host = host
          this.proaram = proaram
          this.wait = wait
        })
    },
    immediateStop(type) {
      // this.$message()
      const { sid, serial_id, inst_id } = this.$route.query
      const hostip = this.$route.query.hostip
      this.$confirm(`是否终止进程，该操作不可返回`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          hostip,
          type: type || '',
          ids: [`${sid}`, `${serial_id}`, `@${inst_id}`]
        }

        ManagementService.killLockWait(params)
          .then(() => {
            //
            this.$message.success('执行成功')
            this.getDbSessionDetail()
          })
          .catch(() => {
          })
      }).catch(() => {

      })
    }
  }
}
</script>
<style lang="sass">
  .page-session-detail
    .box-card
      .el-card__header
        padding: 10px
      .card-content
        font-size: 14px
        min-height: 150px
        .card-content-item
          padding: 3px 0
</style>
<style lang="sass" scoped>
  .page

    .filter-header
      margin: 20px 0
      line-heght: 24px

    .filter-box
      display: flex
      align-items: center

    .table-content

      .table-header

        .title
          margin: 38px 0 20px 0
          line-heght: 24px

        .header-box
          display: flex
          justify-content: space-between

          .choice-btn
            border: 1px solid #DCDFE6
            width: 136px
            height: 36px
            line-heght: 36px
            margin-bottom: 11.5px
            display: flex
            align-items: center
            border-radius: 5px

            .btn
              padding: 0 15px
              font-size: 14px
              color: #C0C4CC

            .active
              color: #5E6166

            .btn-all
              border-right: 1px solid #DCDFE6

          .search-box
            flex: 1
            text-align: right

            .search-btn
              margin-right: 10px
              margin-left: 0
              padding: 10px 19px

      .table-box

        .operate
          display: flex
          align-items: center

          .btn
            margin-left: 6px
            padding: 7px 12px

    .default-label
      border-radius: 4px
      font-size: 14px
      letter-spacing: 0
      text-align: center
      line-height: 28px
      width: 82px
      height: 28px

      .success
        background: #EFF9EB
        border: 1px solid #D3EEC7
        color: #4CBB4F

      .fail
        background: #FEF0F0
        border: 1px solid #FCD5D5
        color: #F66C80

      .pending
        background: #F0F9FE
        border: 1px solid #D5E7FC
        color: #409EFF

</style>
