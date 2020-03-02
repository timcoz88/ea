<template>
  <el-card style="margin: 20px">
    <div class="page p20">
      <div class="filter-container">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-input
              v-model.trim="filter.searchVal"
              type="text"
              class="filter-input"
              placeholder="请输入搜索内容"
              @keyup.enter.native="handleSearch"
            >
              <el-select
                slot="prepend"
                v-model="filter.searchType"
                class="filter-select"
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
          <!-- <el-col :span="4">
            <select-os v-model="filter.ostype" placeholder="主机类型" />
          </el-col>-->
          <el-col :span="16" class="text-right">

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
        <div class="table-header">
          <div class="mb-20 text-right">
            <el-button
              type="primary"
              size="small"
              class="btn"
              @click="autoWork"
            >
              自动化巡检
            </el-button>
          </div>
        </div>
        <div class="table-box">
          <ElTable
            v-loading="loading"
            ref="remoteData"
            :data="tableData"
            border
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              type="selection"
              width="40"
            />
            <el-table-column
              type="index"
              label="序号"
            />
            <el-table-column
              prop="hostip"
              label="主机IP"
            />
            <el-table-column
              prop="hostnm"
              label="主机名"
            />
            <el-table-column
              prop="ostype"
              label="系统类型"
            />
            <el-table-column
              prop="dbtype"
              label="数据库类型"
            />
            <el-table-column
              prop="dbnm"
              label="数据库名"
            />
            <el-table-column
              prop="last_time"
              label="上次巡检时间"
            >
              <template slot-scope="{row}">
                <span>{{ row.last_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="start_time"
              label="任务开始时间"
            >
              <template slot-scope="{row}">
                <span>{{ row.start_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="end_time"
              label="任务结束时间"
            >
              <template slot-scope="{row}">
                <span>{{ row.end_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="job_status"
              label="执行状态"
            />
            <el-table-column
              fixed="right"
              label="操作"
              width="306"
            >
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="small"
                  class="btn"
                  @click="openLog(scope.row)"
                >
                  查看日志
                </el-button>
                <el-button
                  type="primary"
                  size="small"
                  class="btn"
                  @click="openReport(scope.row)"
                >
                  查看报告
                </el-button>
                <el-button
                  type="primary"
                  size="small"
                  class="btn"
                  @click="routerGo(scope.row)"
                >
                  历史任务
                </el-button>
              </template>
            </el-table-column>
          </ElTable>
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
        <ReportDetail ref="reportDetail" :report-detail="chooseItemReport" />
        <detail
          ref="detail"
          :item="chooseItem"
        />
      </div>
    </div>
  </el-card>
</template>
<script>
import Pagination from '@/components/Pagination'
import repo from '@/services/modules/polling'
import managementRepo from '@/services/modules/management'
import ReportDetail from './report-detail'
import Detail from './detail'

export default {
  components: {
    Pagination,
    ReportDetail,
    Detail
  },

  data() {
    return {
      chooseItem: {},
      tableData: [],
      pagination: {
        page: 1,
        total: 0,
        pageSize: 20
      },
      loading: false,
      reportDetail: {},
      chooseItemReport: {},
      multipleSelection: [],
      filter: {
        searchType: 'hostip'
      },
      options: [
        {
          value: 'hostnm',
          label: '主机名'
        }, {
          value: 'hostip',
          label: '主机ip'
        }, {
          value: 'dsn',
          label: '数据库名'
        }]
    }
  },

  mounted() {
    this.handleList()
  },

  methods: {
    routerGo({ hostip }) {
      this.$router.push({
        name: 'polling-report',
        query: {
          hostip
        }
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    toggleSelection(flag) {
      if (!flag) {
        return this.$refs.remoteData.clearSelection()
      }
      this.tableData.forEach(row => {
        this.$refs.remoteData.toggleRowSelection(row)
      })
    },
    // pagination
    handlePage({ page, limit }) {
      this.pagination.page = page
      this.pagination.pageSize = limit
      this.handleList()
    },
    getFilter() {
      const filter = Object.assign({}, this.filter)
      delete filter.searchType
      delete filter.searchVal

      const params = {
        [this.filter.searchType]: this.filter.searchVal,
        ...filter
      }
      return Object.assign({}, {
        page: this.pagination.page,
        pageSize: this.pagination.pageSize,
        filter: {
          type: 'and',
          conditions: Object.entries(params).map(([key, val]) => {
            return [key, 'like', val || '']
          })
        }
      })
    },
    // load data
    handleList() {
      this.loading = true
      managementRepo.getManagementList(this.getFilter())
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
      this.filter = {}
      this.pagination.page = 1
      this.handleList()
    },
    openLog({ hostip }) {
      repo.viewLogDetail({ hostip }).then(({ results: data }) => {
        this.chooseItem = data
        this.$refs.detail.show()
      }).then(() => {
      })
    },
    openReport({ hostip }) {
      managementRepo.viewReportDetail({ hostip }).then(({ results: data }) => {
        this.chooseItemReport = data || {}
        this.$refs.reportDetail.show()
      }, Function.prototype).then(() => {
      })
      /* Loading.start()
      managementRepo.getReportLog(id).then(({ results: data }) => {
        this.chooseItemReport = data
        this.$refs.reportDetail.show()
      }, Function.prototype).then(() => {
        Loading.end()
      })*/
    },
    getWorkData() {
      return this.multipleSelection.map((item) => {
        return {
          id: item.id,
          resid: '17',
          type: 'health',
          module: 'health',
          extra: { iplist: item.hostip }
        }
      })
      /*
      * [
 {
 "id": 121,
 "type": "health",
 "module": "health",
 "resid":17,
 "extra": {"iplist": "1.1.1.100"}
 }
]
      * */
      // return this.multipleSelection.map(v => v.hostip)
    },
    autoWork() {
      if (this.multipleSelection.length < 1) {
        return this.$message.error('请选择要执行巡检的服务器')
      }
      const iplist = this.getWorkData()
      /*
      * {
 "id":"122",
 "type":"func",
 "module":"health",
 "extra":{"iplist":{"192.168.254.129/32":{"oracle":"123456"}}}
}
      * */
      repo.doHealth1(iplist).then(({ results: data }) => {
        /* if (data.state !== 0) {
          return this.$message.error(data.msg)
        }*/
        this.$message.success('任务已提交')
        this.loading = true
        setTimeout(() => {
          this.handleList()
        }, 3000)
      }, Function.prototype)
    }
  }
}
</script>
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
