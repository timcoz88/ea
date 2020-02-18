<template>
  <el-card style="margin:20px;">
    <div class="df">
        <el-button @click="immediateStop('immediate')">立即终止会话</el-button>
        <el-button @click="callback">返回</el-button>
    </div>
    <el-row class="card-content"  style="margin-top:20px;">
      <el-col :span="4" class="card-content-item">当前状态：{{ dbInfo.current_status }}</el-col>
      <el-col :span="4" class="card-content-item">当前会话ID：{{ dbInfo.id }}</el-col>
      <el-col :span="4" class="card-content-item">主机：{{ dbInfo.host }}</el-col>
      <el-col :span="4" class="card-content-item">等待持续时间：{{ dbInfo.wait_time }}</el-col>
      <el-col :span="4" class="card-content-item">当前SQL开始执行时间：{{ dbInfo.start_time }}</el-col>
    </el-row>
    <el-row :gutter="20" type="flex" style="margin-top:20px;">
      <el-col :span="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="common-page-title">SQL明细</span>
          </div>
          <div class="card-content">
            <span>{{dbInfo.info}}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
import { mysqlSessionDetail } from '@/api/management'
import {mysqlSessionKill} from '@/api/mysql'
export default {
  data() {
    return {
      dbInfo:{},
    }
  },
  created() {
    this.getSessionDetail()
  },
  methods: {
    callback() {
      const { hostip, dsn } = this.$route.query
      this.$router.push({ name: 'mysqlMonitor', query: { hostip: hostip, dsn: dsn, componentName: 'sessionManage' }})
    },
    getSessionDetail() {
      const { hostip, dsn, session_id } = this.$route.query
      const params = {
        hostip,
        dsn,
        session_id
      }
      mysqlSessionDetail(params)
        .then(({ results: data }) => {
          this.dbInfo = data
        }).catch(err => {
          this.$message.error(err.message)
        })
    },
    immediateStop(type) {
      const { hostip, dsn } = this.$route.query
      let kill_ids = []
      kill_ids.push(this.dbInfo.id)
      const params = {
        hostip,
        dsn,
        kill_ids
      }
      this.$confirm(`是否终止进程，该操作不可返回`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          mysqlSessionKill(params)
            .then((data) => {
              this.$message.success(data.message)
            })
            .catch((err) => {
              this.$message.err(err.message)
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
<style>
.el-table th {
	display: table-cell!important; 
}
</style>
