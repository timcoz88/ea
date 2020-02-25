<template>
  <div style="margin:20px;">
    <div style="text-align: right;margin-bottom:20px;">
      <el-button @click="callback">返回</el-button>
    </div>
    <el-row type="flex">
      <el-col :span="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="common-page-title">基本信息</span>
          </div>
          <el-row class="card-content">
            <el-col :span="6" class="card-content-item">服务器名：{{ dbInfo.hostnm }}</el-col>
            <el-col :span="6" class="card-content-item">服务器ip：{{ dbInfo.hostip }}</el-col>
            <el-col :span="6" class="card-content-item">数据库名：{{ dbInfo.dbnm }}</el-col>
            <el-col :span="6" class="card-content-item">binlog：{{ dbInfo.variable_value }}</el-col>
            <el-col :span="6" class="card-content-item">数据库类型：{{ dbInfo.db_type }}</el-col>
            <el-col :span="6" class="card-content-item">数据库版本：{{ dbInfo.db_ver }}</el-col>
            <el-col :span="6" class="card-content-item">启动时间：{{ dbInfo.start_time }}</el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <div class="db-manage-detail-page">
      <el-tabs v-model="componentName" type="card">
        <el-tab-pane label="监控图表" name="moniorEchar" />
        <el-tab-pane label="会话管理" name="sessionManage" />
        <el-tab-pane label="TOP SQL" name="topSql" />
        <el-tab-pane label="阻塞树分析" name="treeAnalyze" />
      </el-tabs>

      <component :is="componentName" />
    </div>
  </div>

</template>
<script>
import moniorEchar from './monior-echar.vue'
import topSql from './top-sql.vue'
import sessionManage from './session-manage.vue'
import lockWait from './lock-wait.vue'
import TableObjManage from './table-obj-manage.vue'
import treeAnalyze from './tree-analyze.vue'
import sqlAnalyze from './sql-analyze.vue'
import UserManage from './user-manage.vue'
import { mysqlInfor } from '@/api/mysql'
export default {
  components: {
    moniorEchar,
    topSql,
    sessionManage,
    lockWait,
    treeAnalyze,
    TableObjManage,
    UserManage,
    sqlAnalyze
  },
  data() {
    return {
      componentName: 'moniorEchar',
      dbInfo: {}
    }
  },
  created() {
    this.getInfo()
    if (this.$route.query.componentName) {
      this.componentName = this.$route.query.componentName
    }
  },
  methods: {
    callback(){
      this.$router.push({name:'dbOverview'})
    },
    getInfo() {
      const { hostip, dsn } = this.$route.query
      mysqlInfor({ hostip, dsn })
        .then(({ results: data }) => {
          this.dbInfo = data
        })
        .catch((err) => {
          this.$message.error(err.message)
        }).then(() => {
        })
    }
  }
}
</script>
<style lang="sass" scoped>
  .db-manage-detail-page
    padding-top: 20px
  .box-card
      .el-card__header
       padding: 10px
      .card-content
       font-size: 14px
       height: 100px
       overflow-y: auto
       .card-content-item
         padding: 3px 0
         line-height: 30px
         height: 30px
</style>
