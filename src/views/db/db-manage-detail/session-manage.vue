<template>
  <div v-loading="loading" class="page page-session-manage">
    <div class="common-page-title mt-10 mb-20">
      <el-row :gutter="20" type="flex">
        <el-col :span="8">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span class="common-page-title">基本信息</span>
            </div>
            <el-row class="card-content">
              <el-col :sm="24" :lg="12" class="card-content-item">主机名：{{ dbInfo.db_res && dbInfo.db_res.hostnm }}
              </el-col>
              <el-col :sm="24" :lg="12" class="card-content-item">主机IP：{{ dbInfo.hostip }}</el-col>
              <el-col :sm="24" :lg="12" class="card-content-item">数据库名：{{ dbInfo.dbnm }}</el-col>
              <el-col :sm="24" :lg="12" class="card-content-item">数据库状态：{{ dbInfo.db_res && dbInfo.db_res.status }}</el-col>
              <el-col :sm="24" :lg="12" class="card-content-item">数据库归档：{{ dbInfo.db_res && dbInfo.db_res.archiver }}</el-col>
              <el-col :sm="24" :lg="12" class="card-content-item">实例名：{{ dbInfo.db_res && dbInfo.db_res.instance_nm
              }}</el-col>
              <el-col :sm="24" :lg="12" class="card-content-item">实例ID：{{ dbInfo.db_res && dbInfo.db_res.inst_id }}</el-col>
              <el-col :sm="24" :lg="12" class="card-content-item">数据库类型：{{ dbInfo.dbtype }}</el-col>
              <el-col :sm="24" :lg="12" class="card-content-item">数据库说明：{{ dbInfo.dbinfo }}</el-col>
              <el-col :sm="24" :lg="12" class="card-content-item">数据库版本：{{ dbInfo.db_res && dbInfo.db_res.version }}</el-col>
              <el-col :sm="24" :lg="12" class="card-content-item">启动时间：{{ dbInfo.db_res && dbInfo.db_res.startup_tm }}</el-col>
            </el-row>

          </el-card>
        </el-col>
        <el-col :span="8" class="module-container">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span class="common-page-title">会话信息</span>
            </div>
            <div class="card-content">
              <div class="card-content-item">当前会话数：{{ dbInfo.session_res && dbInfo.session_res.ACTIVE +dbInfo.session_res.INACTIVE }}</div>
              <div class="card-content-item">活动会话数：{{ dbInfo.session_res && dbInfo.session_res.INACTIVE }}</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span class="common-page-title">运行事件</span>
            </div>
            <div class="card-content" style="max-height: 125px;overflow-y: auto">
              <div v-for="(item, index) in eventList" :key="index" class="card-content-item">
                <span style="color: #999;padding-right: 5px">{{ index === 0 ? nowFormatDate : item.time }}</span>
                <span style="color: #666;padding-right: 5px">{{ item.id && item.id.id ?
                  `sid：${item.id.id.split(',')[0]} serial：${item.id.id.split(',')[1]}` : ''
                }}</span>
                {{ item.msg }}
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="filter-container" style="margin-top: 20px">
      <el-row :gutter="10">
        <el-col :span="12" style="display: flex">
          <el-button-group style="flex: 0 0 280px">
            <el-button :disabled="!multipleSelection.length" type="primary" @click="immediateStop('immediate')">立即终止会话</el-button>
            <el-button :disabled="!multipleSelection.length" type="primary" @click="immediateStop">事务处理后终止</el-button>
          </el-button-group>
          <div style="line-height: 30px;margin-right: 15px">
            <el-checkbox v-model="filter.background">type</el-checkbox>
          </div>
          <el-input
            v-model.trim="filter.searchVal"
            type="text"
            class="filter-input"
            placeholder="请输入搜索内容"
            style="width: 60%"
            @keyup.enter.native="handleSearch"
          >
            <el-select
              slot="prepend"
              v-model="filter.searchType"
              style="width: 160px;"
              placeholder="请选择查询类型">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </el-input>
        </el-col>

        <el-col :span="6" class="text-right">

          <el-button
            type="primary"
            @click="handleSearch"
          >
            搜索
          </el-button>
          <el-button @click="handleClear">重置</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="table-content">

      <div class="table-box">
        <el-table
          v-loading="loading"
          ref="remoteData"
          :data="tableData"
          :row-class-name="tableRowClassName"
          border
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="40"
          />
          <el-table-column
            prop="sid"
            label="会话ID"
          >
            <template slot-scope="scope">
              <el-button type="text" @click="getDbSessionDetail(scope.row)">{{ scope.row.sid }}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="serial_id"
            label="序列ID"
          />
          <el-table-column
            prop="username"
            label="用户名"
          />
          <el-table-column
            prop="status"
            label="状态"
          />
          <el-table-column
            prop="event"
            label="事件"
            width="240"
          />
          <el-table-column
            prop="process"
            label="系统进程"
          />
          <el-table-column
            prop="machine"
            label="主机"
          />
          <el-table-column
            prop="terminal"
            label="终端"
            width="120"

          />
          <el-table-column
            prop="program"
            label="应用程序"
            width="240"

          />
          <el-table-column
            prop="type"
            label="类型"
            width="140"

          />
          <!---<el-table-column
            prop="sql_hash_value"
            label="SQL_HASH_VALUE"
            width="140"--->
          />
          <el-table-column
            prop="sql_id"
            label="SQL_ID"
            width="140"
          />
          <el-table-column
            prop="sql_exec_start"
            label="SQL执行时间"
            width="140"
          />
          <el-table-column
            prop="final_blocking_session_status"
            label="阻塞会话状态"
            width="140"
          />
          <el-table-column
            prop="final_blocking_instance"
            label="阻塞会话实例"
            width="140"
          />
          <el-table-column
            prop="final_blocking_session"
            label="阻塞会话"
            width="140"
          />
          <el-table-column
            prop="logon_time"
            label="登录时间"
            width="170"
          />
        </el-table>
      </div>
      <div class="page-box">
        <Pagination
          v-if="total > 0"
          :current-page="page"
          :total="total"
          @page="handlePage"
        />
      </div>
    </div>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import ManagementService from '@/services/modules/management'
import qs from 'qs'
import {fetchDbInfo, fetchDbSessionList} from '@/api/sql'

export default {
  components: {
    Pagination
  },

  data() {
    return {
      filter: {
        searchType: 'SID'
      },
      tableData: [],
      multipleSelection: [],
      dbInfo: {},
      eventList: [
        { time: '', msg: '连接成功' }
      ],
      page: 1,
      total: 0,
      loading: false,
      options: [{
        value: 'SID',
        label: 'SID'
      }, {
        value: 'USERNAME',
        label: 'USERNAME'
      }, {
        value: 'STATUS',
        label: 'STATUS'
      }, {
        value: 'PROCESS',
        label: 'PROCESS'
      }, {
        value: 'MACHINE',
        label: 'MACHINE'
      }, {
        value: 'SQL_ID',
        label: 'SQL_ID'
      }, {
        value: 'SQL_HASH_VALUE',
        label: 'SQL_HASH_VALUE'
      }]
    }
  },
  computed: {
    nowFormatDate() {
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
      console.log(currentdate)
      return currentdate
    }
  },

  created() {
    this.handleList()
    this.getInfo()
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (row.username === 'SYS') {
        return 'warning-row'
      }
      return ''
    },
    getDbSessionDetail({ sid, serial_id, inst_id }) {
      const { hostip } = this.$route.query
      this.$router.push({
        name: 'ManagementDbSessionDetail',
        query: {
          hostip,
          sid,
          serial_id,
          inst_id
        }
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // pagination
    handlePage(page) {
      this.page = page
      this.handleList()
    },
    getFilter() {
      let params = {}
      if (this.filter.searchVal) {
        params = {
          actor: this.filter.searchType,
          target: this.filter.searchVal
        }
      }
      const { hostip, dsn } = this.$route.query

      return Object.assign({}, params, {
        page: this.page,
        pageSize: 10,
        background: this.filter.background,
        hostip,
        dsn
      })
    },
    immediateStop(type) {
      let sidList = []
      this.multipleSelection.forEach(item => {
        sidList = [...sidList, ...[{ sid: item.sid.toString(), serial: item.serial_id.toString() }]]
      })
      const hostip = this.$route.query.hostip
      const params = {
        hostip,
        type: type || '',
        kill_ids: sidList
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
              this.handleList()
              this.getInfo()
              this.eventList = [...this.eventList, ...data]
            })
            .catch(() => {
              this.eventList.push({ time: this.getNowFormatDate(), msg: `执行失败` })
            })
        })
        .catch(() => {})
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
    },
    // load data
    handleList() {
      this.loading = true
      fetchDbSessionList(this.getFilter())
        .then(({ results: data }) => {
          this.tableData = data.results
          this.total = data.totalCount
        })
        .catch((err) => {
          this.tableData = []
          this.total = 0
          this.$message.error(err.message)
        }).then(() => {
          this.loading = false
        })
    },
    // search
    handleSearch() {
      this.page = 1
      this.handleList()
    },
    // clear search
    handleClear() {
      this.filter = {
        filter: {
          searchType: 'SID'
        }
      }
      this.page = 1
      this.handleList()
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
      console.log(currentdate)
      return currentdate
    }
  }
}
</script>
<style lang="sass">
  .page-session-manage
    .box-card
      .el-card__header
       padding: 10px
      .card-content
       font-size: 14px
       height: 140px
       overflow-y: auto
       .card-content-item
         padding: 3px 0
    .el-table .warning-row
      background: #ECEFF1

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

</style>
