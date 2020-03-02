<template>
  <div v-loading="loading" class="page page-session-manage">
    <div>
      <h4>会话管理</h4>
      <el-row class="card-content">
        <el-col :span="4" class="card-content-item">最大会话数：{{ dbInfo.session_res && dbInfo.session_res.max_cnt }}</el-col>
        <el-col :span="4" class="card-content-item">当前会话数：{{ dbInfo.session_res && dbInfo.session_res.cur_cnt }}</el-col>
        <el-col :span="4" class="card-content-item">活动会话数：{{ dbInfo.session_res && dbInfo.session_res.act_cnt }}</el-col>
        <el-col :span="4" class="card-content-item">阻塞会话数：{{ dbInfo.session_res && dbInfo.session_res.block_cnt }}</el-col>
      </el-row>
    </div>
    <div class="filter-container" style="margin-top: 20px">
      <el-row :gutter="10">
        <el-col :span="18" style="display: flex">
          <el-button-group style="flex: 0 0 280px">
            <el-button :disabled="!multipleSelection.length" type="primary" @click="immediateStop('immediate')">立即终止会话</el-button>
            <el-button :disabled="!multipleSelection.length" type="primary" @click="immediateStop()">事务处理后终止</el-button>
          </el-button-group>
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
              placeholder="请选择查询类型"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-input>
          <div style="line-height: 30px;margin-left: 15px">
            <el-checkbox v-model="filter.background">显示系统会话</el-checkbox>
          </div>
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
          ref="remoteData"
          v-loading="loading"
          :data="tableData"
          :row-class-name="tableRowClassName"
          border
          style="width: 100%"
          @row-dblclick="getDetail"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="40"
          />
          <el-table-column
            prop="sid"
            label="会话ID"
            width="90"
          >
            <!-- <template slot-scope="scope">
              <el-button type="text" @click="getDbSessionDetail(scope.row)">{{ scope.row.sid }}</el-button>
            </template> -->
          </el-table-column>
          <el-table-column
            prop="serial_id"
            label="序列ID"
            width="90"
          />
          <el-table-column
            prop="username"
            label="用户名"
            width="140"
          />
          <el-table-column
            prop="status"
            label="状态"
            width="100"
          />
          <el-table-column
            prop="event"
            label="事件"
            width="240"
          />
          <el-table-column
            prop="process"
            label="系统进程"
            width="140"
          />
          <el-table-column
            prop="machine"
            label="主机"
            width="200"
          />
          <el-table-column
            prop="terminal"
            label="终端"
            width="120"
          />
          <el-table-column
            prop="program"
            label="应用程序"
          />
          <!-- <el-table-column
            prop="type"
            label="类型"
            width="140"
          /> -->
          <!---<el-table-column
            prop="sql_hash_value"
            label="SQL_HASH_VALUE"
            width="140"
          />--->
          <el-table-column
            prop="sql_id"
            label="SQL_ID"
            width="140"
          />
          <el-table-column
            prop="sql_exec_start"
            label="SQL执行时间"
            width="160"
          />
          <el-table-column
            prop="sql_text"
            width="250"
            label="SQL明细"
          >
            <template slot-scope="scope">
              <el-popover
                placement="top-start"
                width="200"
                trigger="hover"
              >
                <div>
                  {{ scope.row.sql_text }}
                </div>
                <span
                  slot="reference"
                  style="overflow: hidden;
text-overflow:ellipsis;
white-space: nowrap;"
                >{{ scope.row.sql_text }}</span>
              </el-popover>
            </template>
          </el-table-column>
          <!-- <el-table-column
            prop="final_blocking_session_status"
            label="阻塞会话状态"
            width="140"
          />
          <el-table-column
            prop="final_blocking_instance"
            label="阻塞会话实例"
            width="140"
          /> -->
          <!-- <el-table-column
            prop="final_blocking_session"
            label="阻塞会话"
            width="140"
          />
          <el-table-column
            prop="logon_time"
            label="登录时间"
            width="170"
          /> -->
        </el-table>
      </div>
      <div class="page-box">
        <pagination
          v-show="pagination.total > 0"
          :total="pagination.total"
          :page.sync="pagination.page"
          :limit.sync="pagination.pageSize"
          @pagination="handlePage"
        />
      </div>
    </div>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import ManagementService from '@/services/modules/management'
import { fetchDbInfo, fetchDbSessionList } from '@/api/sql'
export default {
  components: {
    Pagination
  },

  data() {
    return {
      dbInfo: {},
      filter: {
        searchType: 'SID'
      },
      tableData: [],
      multipleSelection: [],
      dbInfo: {},
      eventList: [
        { time: '', msg: '连接成功' }
      ],
      pagination: {
        page: 1,
        pageSize: 20,
        total: 0
      },
      loading: false,
      options: [{
        value: '',
        label: '全部'
      }, {
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
    // getDbSessionDetail({ sid, serial_id, inst_id }) {
    //   const { hostip } = this.$route.query
    //   this.$router.push({
    //     name: 'ManagementDbSessionDetail',
    //     query: {
    //       hostip,
    //       sid,
    //       serial_id,
    //       inst_id
    //     }
    //   })
    // },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    getDetail({ sid, serial_id, inst_id }) {
      this.$router.push({ name: 'sessionDetail', query: {
        hostip: this.$route.query.hostip,
        dsn: this.$route.query.dsn,
        sid,
        serial_id,
        inst_id
      }})
    },
    // pagination
    handlePage({ page, limit }) {
      this.pagination.page = page
      this.pagination.pageSize = limit
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
        page: this.pagination.page,
        pageSize: this.pagination.pageSize,
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
      const dsn = this.$route.query.dsn
      const params = {
        hostip,
        dsn,
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
          this.pagination.total = data.totalCount
        })
        .catch((err) => {
          this.tableData = []
          this.pagination.total = 0
          this.$message.error(err.message)
        }).then(() => {
          this.loading = false
        })
    },
    // search
    handleSearch() {
      this.pagination.page = 1
      this.handleList()
    },
    // clear search
    handleClear() {
      this.filter = {
        filter: {
          searchType: 'SID'
        }
      }
      this.pagination.page = 1
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
       height: 100px
       overflow-y: auto
       .card-content-item
         padding: 3px 0
         line-height: 30px
         height: 30px
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
