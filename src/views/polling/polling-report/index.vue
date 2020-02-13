<template>
  <el-card style="margin: 20px">
    <div class="page p20">
      <!--<div class="filter-container">
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
          &lt;!&ndash; <el-col :span="4">
            <select-os v-model="filter.ostype" placeholder="主机类型" />
          </el-col>&ndash;&gt;
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
      </div>-->
      <div class="table-content">
        <div class="table-header">
          <!--<div class="mb-20 text-right">
            <el-button
              type="primary"
              size="small"
              class="btn"
              @click="showAddUserPopup"
            >
              新增用户
            </el-button>
          </div>-->
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
              prop="id"
              label="序号"
              width="50"
            />
            <el-table-column
              label="服务器ip"
              header-align="center"
            >
              <template slot-scope="{row}">
                {{ row.hostip }}
              </template>
            </el-table-column>

            <el-table-column
              label="系统级别"
              header-align="center"
            >
              <template slot-scope="{row}">
                {{ row.dblvl }}
              </template>
            </el-table-column>

            <el-table-column
              label="数据库类型"
              header-align="center"
            >
              <template slot-scope="{row}">
                {{ row.dbtype }}
              </template>
            </el-table-column>

            <el-table-column
              label="数据库名"
              header-align="center"
            >
              <template slot-scope="{row}">
                {{ row.dsn }}
              </template>
            </el-table-column>

            <el-table-column
              prop="lastchktm"
              label="最后一次巡检时间"
              header-align="center"
            ><template slot-scope="{row}">
              {{row.lastchktm | parseTime('{y}-{m}-{d} {h}:{i}') }}
            </template>
            </el-table-column>
            <el-table-column
              prop="user"
              label="巡检人"
              header-align="center"
            >
              <template slot-scope="{row}">
                {{ row.user }}
              </template>

            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="196"
              header-align="center"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="small"
                  class="btn"
                  @click="openReport(scope.row)"
                >
                  查看详情
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
      </div>
    </div>

    <ReportDetail ref="reportDetail" :report-detail="chooseItemReport" />

  </el-card>
</template>
<script>
import Pagination from '@/components/Pagination'
import managementRepo from '@/services/modules/management'
import ReportDetail from '../auto-polling/report-detail'

export default {
  components: {
    Pagination,
    ReportDetail
  },

  data() {
    return {
      filter: {
        searchType: 'hostip'
      },
      tableData: [],
      pagination: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      loading: false,
      reportDetail: {},
      multipleSelection: [],
      currentChange: {},
      currentChangeUser: {},
      manageVisible: false,
      chooseItemReport: {},
      options: [{
        value: 'hostip',
        label: '服务器ip'
      }, {
        value: 'eaops_db.dsn',
        label: '数据库名'
      }]
    }
  },

  mounted() {
    this.handleList()
  },

  methods: {
    handleSuccess() {
      this.handleList()
    },
    openReport(data) {
      this.chooseItemReport = data
      this.$refs.reportDetail.show()
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
    deleteDataById(id) {
      this.tableData = this.tableData.filter(data => data.id !== id)
    },
    getFilter() {
      return Object.assign({}, {
        page: this.pagination.page,
        pageSize: this.pagination.pageSize,
        hostip: this.$route.query.hostip,
        filter: {
          type: 'and',
          conditions: [[this.filter.searchType, 'like', this.filter.searchVal || '']]
        }
      })
    },
    // load data
    handleList() {
      this.loading = true
      managementRepo.getPollingList(this.getFilter())
        .then((data) => {
          this.tableData = data.results.results || []
          console.log(data.results.results)
          this.pagination.total = data.results.totalCount
          this.pagination.page = data.results.page
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
        searchType: 'hostip'
      }
      this.pagination.page = 1
      this.handleList()
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

