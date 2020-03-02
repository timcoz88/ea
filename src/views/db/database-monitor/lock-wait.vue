<template>
  <div class="page page-session-manage">
    <div class="filter-container">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-button-group>
            <el-button :disabled="radio === ''" type="primary" @click="immediateStop('immediate')">立即终止会话</el-button>
            <el-button :disabled="radio === ''" type="primary" @click="immediateStop()">事务处理后终止</el-button>
          </el-button-group>
        </el-col>
        <el-col :span="12" class="text-right">

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
          highlight-current-row
          border
          style="width: 100%"
          @row-click = "showRow"
        >
          <el-table-column label="选择" width="70" header-align="center" align="center">
            <template slot-scope="scope">
              <el-radio v-model="radio" :label="scope.$index" class="radio">&nbsp;</el-radio>
            </template>
          </el-table-column>
          <el-table-column
            prop="username"
            label="用户名"
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
            label="序列号"
          />
          <el-table-column
            prop="inst_id"
            label="实例"
          />
          <el-table-column
            prop="sql_id"
            label="SQL_ID"
          />
          <el-table-column
            prop="type"
            label="锁类型"
          />
          <el-table-column
            prop="lmode"
            label="持有的模式"
          />
          <el-table-column
            prop="request"
            label="请求的模式"
          />
          <el-table-column
            prop="object_type"
            label="对象类型"
          />
          <el-table-column
            prop="owner"
            label="对象所有者"
          />
          <el-table-column
            prop="object_name"
            label="对象名"
          />
          <el-table-column
            prop="ctime"
            label="请求时间秒"
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

export default {
  components: {
    Pagination
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
      radio: '',
      currentRow: {}
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
    showRow(row) {
      this.radio = this.tableData.indexOf(row)
      this.currentRow = row
    },
    getDbSessionDetail({ sid, serial_id, inst_id }) {
      this.$router.push({
        name: 'ManagementDbSessionDetail',
        query: {
          ...this.$route.query,
          sid,
          serial_id,
          inst_id
        }
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
      const params = {
        ...this.$route.query,
        type: type || '',
        ids: [`${sid}`, `${serial_id}`, `@${inst_id}`]
      }

      ManagementService.killLockWait(params)
        .then(({ results: data }) => {
          this.handleList()
          this.radio = ''
          this.currentRow = {}
        })
        .catch(() => {
        })
    },
    // load data
    handleList() {
      this.loading = true
      const urlParams = qs.stringify(this.getFilter())
      ManagementService.getLockWait(this.$route.query, urlParams)
        .then(({ results: data }) => {
          this.tableData = data.results
          this.total = data.totalCount
        })
        .catch((err) => {
          // this.tableData = []
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
       .card-content-item
         padding: 3px 0
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
