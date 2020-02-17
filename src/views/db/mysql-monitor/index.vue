<template>
  <div style="margin:20px;">
    <el-row type="flex">
      <el-col :span="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="common-page-title">基本信息</span>
          </div>
          <el-row class="card-content">
            <!-- <el-col :span="4" class="card-content-item">主机名：{{ dbInfo.db_res && dbInfo.db_res.hostnm }}</el-col> -->
            <el-col :span="4" class="card-content-item">主机IP：{{ dbInfo.hostip }}</el-col>
            <el-col :span="4" class="card-content-item">端口：{{ dbInfo.db_res&&dbInfo.db_res.db_port }}</el-col>
            <el-col :span="4" class="card-content-item">数据库名：{{ dbInfo.dbnm }}</el-col>
            <el-col :span="4" class="card-content-item">数据库类型：{{ dbInfo.dbtype }}</el-col>
            <el-col :span="4" class="card-content-item">数据库状态：{{ dbInfo.db_res && dbInfo.db_res.status }}</el-col>
            <el-col :span="4" class="card-content-item">数据库归档：{{ dbInfo.db_res && dbInfo.db_res.archiver }}</el-col>
            <!-- <el-col :span="4" class="card-content-item">实例名：{{ dbInfo.db_res && dbInfo.db_res.instance_nm }}</el-col>
            <el-col :span="4" class="card-content-item">实例ID：{{ dbInfo.db_res && dbInfo.db_res.inst_id }}</el-col> -->
            
            <!-- <el-col :span="4" class="card-content-item">数据库说明：{{ dbInfo.dbinfo }}</el-col> -->
            <el-col :span="4" class="card-content-item">数据库版本：{{ dbInfo.db_res && dbInfo.db_res.version }}</el-col>
            <el-col :span="4" class="card-content-item">启动时间：{{ dbInfo.db_res && dbInfo.db_res.startup_tm }}</el-col>
            <!-- <el-col :span="4" class="card-content-item">当前会话数：{{ dbInfo.session_res && dbInfo.session_res.cur_cnt }}</el-col>
            <el-col :span="4" class="card-content-item">活动会话数：{{ dbInfo.session_res && dbInfo.session_res.act_cnt }}</el-col> -->
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <div class="db-manage-detail-page">
      <el-tabs v-model="componentName" type="card" @tab-click="handleClick">
        <el-tab-pane label="监控图表" name="moniorEchar" />
        <el-tab-pane label="会话管理" name="sessionManage" />
        <el-tab-pane label="TOP SQL" name="topSql" />
        <!-- <el-tab-pane label="SQL分析" name="sqlAnalyze"/>
          <el-tab-pane label="表对象管理" name="TableObjManage"/>
          <el-tab-pane label="用户管理" name="userManage"/>
          <el-tab-pane label="锁等待" name="lockWait"/> -->
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
import { fetchDbInfo } from '@/api/sql'
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
    handleClick(tab, event) {
      console.log(tab, event)
    },
    getInfo() {
      const { hostip, dsn } = this.$route.query
      fetchDbInfo({ hostip, dsn })
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
