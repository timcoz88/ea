<template>
  <div class="page p20">
    <!-- <div class="filter-container">
      <div class="common-page-title mt-10 mb-20">
        搜索条件
      </div>
      <div class="filter-box">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-input
              v-model.trim="filter.name"
              type="text"
              class="filter-input"
              placeholder="用户名"
            />
          </el-col>
          <el-col :span="16" class="text-right">

            <el-button
              type="primary"
              @click="handleSearch"
            >
              搜索
            </el-button>
            <el-button @click="handleClear">重置</el-button>
          </el-col>
        </el-row></div>
    </div>-->
    <div class="table-content">
      <div class="table-header">
        <p class="title common-page-title">
          巡检报告详情
        </p>
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
            prop="dblvl"
            label="系统级别"
            header-align="center"
          />
          <el-table-column
            label="主机"
            prop="hostip"
            header-align="center"
          />
          <el-table-column
            prop="dbtype"
            label="数据库类型"
            header-align="center"
          />
          <el-table-column
            prop="rpt_tm"
            label="巡检时间"
            header-align="center"
          />
          <el-table-column
            label="巡检报告"
            header-align="center"
          >
            <template slot-scope="{row}">
              <a
                :href="`/v1/admin/download/${row.rpt_url}?res=doc&&tm=${row.rpt_url.split('.').find(v => Number.isInteger(+v))}`"
                style="color:#6a6aee;"
                target="_blank">{{ row.rpt_url }}</a>
            </template>
          </el-table-column>
          <el-table-column
            prop="awr_url"
            label="AWR报告"
            header-align="center"
          >
            <template slot-scope="{row}">
              <a
                :href="`/v1/admin/download/${row.awr_url}?res=doc&&tm=${row.awr_url.split('.').find(v => Number.isInteger(+v))}`"
                style="color:#6a6aee;"
                target="_blank">{{ row.awr_url }}</a>
            </template>
          </el-table-column>

          <el-table-column
            prop="trc_url"
            label="TRC文件"
            header-align="center"
          >
            <template slot-scope="{row}">
              <a
                :href="`/v1/admin/download/${row.trc_url}?res=doc&&tm=${row.trc_url.split('.').find(v => Number.isInteger(+v))}`"
                style="color:#6a6aee;"
                target="_blank">{{ row.trc_url }}</a>
            </template>
          </el-table-column>

          <el-table-column
            prop="xml_url"
            label="XML报告"
            header-align="center"
          >
            <template slot-scope="{row}">
              <a
                :href="`/v1/admin/download/${row.xml_url}?res=doc&&tm=${row.xml_url.split('.').find(v => Number.isInteger(+v))}`"
                style="color:#6a6aee;"
                target="_blank">{{ row.xml_url }}</a>
            </template>
          </el-table-column>

        </ElTable>
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
import repo from '@/services/modules/polling'

export default {
  components: {
    Pagination
  },

  data() {
    return {
      filter: {},
      tableData: [],
      page: 1,
      pageSize: 10,
      total: 0,
      loading: false,
      reportDetail: {},
      multipleSelection: [],
      currentChange: {},
      currentChangeUser: {},
      manageVisible: false,
      chooseItemReport: {}
    }
  },

  mounted() {
    this.handleList()
  },

  methods: {
    handleSuccess() {
      this.handleList()
    },
    openReport(item) {
      this.chooseItemReport = item
      this.$router.push({
        name: 'polling-report-detail',
        query: {

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
    handlePage(page) {
      this.page = page
      this.handleList()
    },
    deleteDataById(id) {
      this.tableData = this.tableData.filter(data => data.id !== id)
    },
    getFilter() {
      const { hostip } = this.$route.query
      return Object.assign({ hostip }, this.filter, {
        page: this.page,
        pageSize: this.pageSize
      })
    },
    // load data
    handleList() {
      this.loading = true
      repo.getPollingReportList(this.getFilter())
        .then((data) => {
          const { dblvl, dbtype, dbnm } = this.$route.query
          this.tableData = data.results.results.map(item => {
            return { ...item, ...{ dblvl, dbtype, dbnm }}
          }) || []
          this.total = data.results.totalCount
          this.page = data.results.page
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
      this.filter = {}
      this.page = 1
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
