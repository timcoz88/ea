<!-- 表分析详情 -->
<template>
  <div class="page table-analyze-page">
    <div class="filter-container">
      <div class="common-page-title mt-10 mb-20">
        统计信息
      </div>
    </div>
    <div class="table-content">

      <div class="table-box">
        <el-table
          v-loading="loading"
          ref="remoteData"
          :data="tableData"
          border
          highlight-current-row
          style="width: 100%"
        >
          <el-table-column
            prop="OWNER"
            label="用户名"
          />
          <el-table-column
            prop="TABLE_NAME"
            label="表名"
          />
          <el-table-column
            prop="PARTITION_NAME"
            label="分区名"
          />
          <el-table-column
            prop="SUBPARTITION_NAME"
            label="子分区"
          />
          <el-table-column
            prop="NUM_ROWS"
            label="行数（采样）"
          />
          <el-table-column
            prop="BLOCKS"
            label="BLOCKS（采样）"
          />
          <el-table-column
            prop="SAMPLE_SIZE"
            label="采样行数"
          />
          <el-table-column
            prop="stattype_locked"
            label="是否锁定"
          />
          <el-table-column
            prop="LAST_ANALYZED"
            label="分析时间"
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
    <div class="common-page-title mt-10 mb-20">
      分析设定
    </div>
    <el-card style="padding: 20px 0" class="analyze-setting-card">
      <analyze-setting :loading="btnLoading" @confirm="executeAnalyzeList"/>
    </el-card>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import ManagementService from '@/services/modules/management'
import AnalyzeSetting from './analyze-setting.vue'

export default {
  components: {
    Pagination,
    AnalyzeSetting
  },

  data() {
    return {
      filter: {
      },
      tableData: [],
      multipleSelection: [],
      dbInfo: {},
      page: 1,
      total: 0,
      loading: false,
      currentData: {},
      currentRow: {},
      radio: '',
      btnLoading: false
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
  },
  methods: {
    executeAnalyzeList(data) {
      const params = {
        ...data,
        ...this.$route.query
      }
      this.btnLoading = true
      ManagementService.executeAnalyzeList(params)
        .then(res => {
          console.log(res)
          this.$message.success('执行成功')
          this.handleList()
        })
        .finally(() => {
          this.btnLoading = false
        })
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

      return Object.assign({}, params, {
        page: this.page,
        pageSize: 10
      })
    },
    immediateStop(type) {
      const { sid, serial_id, inst_id } = this.currentRow
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
          .then(({ results: data }) => {
            //
            this.$message.success(data.msg)
            this.handleList()
          })
          .catch(() => {
          })
      }).catch(() => {

      })
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
    // load data
    handleList() {
      this.loading = true
      ManagementService.getAnalyzeList(this.$route.query)
        .then(({ results: data }) => {
          this.tableData = data.results
          this.total = data.totalCount
          this.radio = ''
          this.currentRow = {}
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
  .table-analyze-page
    .box-card
      .el-card__header
        padding: 10px
      .card-content
        font-size: 14px
        .card-content-item
          padding: 3px 0
    .analyze-setting-card .el-card__body
      padding: 0
</style>
<style lang="sass" scoped>
  .page
    padding: 20px
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
