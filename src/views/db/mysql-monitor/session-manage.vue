<template>
  <div v-loading="loading" class="page page-session-manage">
    <div>
      <h4>会话管理</h4>
      <el-row class="card-content">
        <el-col :span="4" class="card-content-item">最大会话数：{{ dbInfo.max }}</el-col>
        <el-col :span="4" class="card-content-item">当前会话数：{{ dbInfo.new }}</el-col>
        <el-col :span="4" class="card-content-item">活跃会话数：{{ dbInfo.active }}</el-col>
        <el-col :span="4" class="card-content-item">阻塞会话数：{{ dbInfo.block }}</el-col>
      </el-row>
    </div>
    <div class="filter-container" style="margin-top: 20px">
      <el-row :gutter="10">
        <el-col :span="18" style="display: flex">
          <el-button-group style="flex: 0 0 280px">
            <el-button :disabled="!multipleSelection.length" type="primary" @click="immediateStop('immediate')">立即终止会话</el-button>
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
            prop="id"
            label="会话ID"
          >
          </el-table-column>
          <el-table-column
            prop="user"
            label="会话用户"
          />
          <el-table-column
            prop="state"
            label="执行状态"
          />
          <el-table-column
            prop="info"
            label="SQL详情"
          >
          <template slot-scope="scope">
              <el-popover
                placement="top-start"
                width="300"
                trigger="hover"
                >
                <div >
                  {{scope.row.info}}
                </div>
                <span slot="reference" style="overflow: hidden;
text-overflow:ellipsis;
white-space: nowrap;">{{scope.row.info}}</span>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            prop="time"
            label="持续时间(s)"
          />
          <el-table-column
            prop="host"
            label="主机"
          />
          <el-table-column
            prop="command"
            label="会话状态"
          />
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
import {mysqlSessionList} from '@/api/management'
import {mysqlSessionKill,mysqlSessionCount} from '@/api/mysql'
export default {
  components: {
    Pagination
  },
  data() {
    return {
      dbInfo: {},
      filter: {
        searchType: 'user'
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
      },{
        value: 'user',
        label: '用户名'
      },{
        value:'command',
        label:'状态'
      },
       {
        value: 'host',
        label: '主机'
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
    getDetail({ id }) {
      this.$router.push({ name: 'mysqlSessionDetail', query: {
        hostip: this.$route.query.hostip,
        dsn: this.$route.query.dsn,
        session_id:id
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
      if (this.filter.searchVal&&this.filter.searchType) {
          params[this.filter.searchType] = this.filter.searchVal
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
        sidList.push(item.id)
      })
      const hostip = this.$route.query.hostip
      const dsn = this.$route.query.dsn
      const params = {
        hostip,
        dsn,
        kill_ids: sidList
      }

      this.$confirm(`是否终止进程，该操作不可返回`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.eventList.push({ time: this.getNowFormatDate(), msg: `当前执行事件${sidList.length}个` })
          mysqlSessionKill(params)
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
      mysqlSessionCount({ hostip, dsn })
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
      mysqlSessionList(this.getFilter())
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
          searchType: 'user',
          searchVal:''
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
