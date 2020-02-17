<template>
  <div class="history-page">
    <div class="filter-container">
      <el-row :gutter="10">
        <el-col :span="12" style="display: flex">
          <el-input
            v-model.trim="filter.searchVal"
            type="text"
            class="filter-input"
            style="margin-right: 50px"
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
          <el-button
            type="primary"
            @click="handleSearch"
          >
            搜索
          </el-button>
          <el-button
            @click="handleClear">重置</el-button>
        </el-col>
        <el-col :span="12" class="text-right">
          <el-button-group style="flex: 0 0 140px">
            <el-button :disabled="radio === ''" type="primary" @click="getSqlManageDetail(currentRow)">表分析</el-button>
          </el-button-group>
        </el-col>
      </el-row>
    </div>
    <div class="table-content">
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
              prop="OWNER"
              label="用户名"
            />
            <el-table-column
              prop="TABLE_NAME"
              label="表名"
            >
              <template slot-scope="scope">
                <el-button type="text" @click="getSqlManageDetail(scope.row)">{{ scope.row.TABLE_NAME }}</el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="TABLESPACE_NAME"
              label="表空间"
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
              prop="LAST_ANALYZED"
              label="上一次分析时间"
            />
            <el-table-column
              prop="PARTITIONED"
              label="是否分区表"
            />
            <el-table-column
              prop="DEGREE"
              label="DEGREE"
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

    <el-dialog
      :visible.sync="isShowDialog"
      class="dark-small">
      <AnalyzeSetting ref="analyzeSetting" @confirm="executeAnalyzeList"/>
    </el-dialog>
  </div>
</template>
<script>
import ManagementService from '@/services/modules/management'
import Pagination from '@/components/Pagination'
import AnalyzeSetting from '../table-analyze/analyze-setting.vue'
import qs from 'qs'

export default {
  components: {
    Pagination,
    AnalyzeSetting
  },

  data() {
    return {
      tableData: [],
      radio: '',
      pagination: {
        page: 1,
        total: 0,
        pageSize: 20
      },
      selectList: [],
      resid: '', // 执行程序的id
      procedureList: [],
      showDetail: false,
      taskid: null,
      createuser: null,
      loading: false,
      filter: {
        searchType: 'owner'
      },
      currentRow: {},
      options: [
        {
          value: 'owner',
          label: '用户名'
        }, {
          value: 'TABLE_NAME',
          label: '表名'
        }],
      isShowDialog: false
    }
  },

  computed: {
    projectDisabled() {
      return !this.resid && !this.createuser && !this.filter.hostnm
    }
  },

  created() {
    // this.handleList()
  },

  methods: {
    showRow(row) {
      this.radio = this.tableData.indexOf(row)
      this.currentRow = row
    },
    tableAnalyze() {
      this.isShowDialog = true
      this.$refs.analyzeSetting.init()
    },
    executeAnalyzeList(data) {
      const { OWNER, TABLE_NAME } = this.currentRow
      const params = {
        ...data,
        ...this.$route.query,
        name: OWNER,
        table: TABLE_NAME
      }
      ManagementService.executeAnalyzeList(params)
        .then(res => {
          console.log(res)
          this.$message.success('执行成功')
          this.currentRow = {}
          this.radio = ''
          this.isShowDialog = false
          this.handleList()
        })
    },
    getSqlManageDetail({ OWNER, TABLE_NAME }) {
      this.$router.push({
        name: 'sqlManageDetail',
        query: {
          hostip: this.$route.query.hostip,
          name: OWNER,
          table: TABLE_NAME
        }
      })
      // window.open(`/management/sql-manage-detail?hostip=${this.$route.query.hostip}&name=${OWNER}&table=${TABLE_NAME}`)
    },
    // check detail
    openDetail(row) {
      this.taskid = row.taskid
      this.$refs.detail.show()
    },

    // pagination
    handlePage({ page, limit }) {
      this.pagination.page = page
      this.pagination.pageSize = limit
      this.handleList(this.getFilter())
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
        page: this.pagination.page,
        pageSize: this.pagination.pageSize
      })
    },
    // load data
    handleList() {
      this.loading = true
      const { hostip, dsn } = this.$route.query
      const urlParams = qs.stringify(this.getFilter())
      ManagementService.getTableAnalyzeList({ hostip, dsn }, urlParams)
        .then(({ results: data }) => {
          this.tableData = data.results
          this.pagination.total = data.totalCount
        })
        .catch((err) => {
          // this.tableData = []
          this.pagination.total = 0
          this.$message.error(err.message)
        }).then(() => {
          this.loading = false
        })
    },
    // search
    handleSearch() {
      this.pagination.page = 1
      this.pagination.total = 0
      this.handleList(this.getFilter())
    },
    // clear search
    handleClear() {
      this.filter = {
        searchType: 'owner'
      }
    },
    getRunParams() {
      if (this.selectList.length < 1) {
        return void this.$message.error('您还没有选择服务器')
      }
      const result = {}
      this.selectList.forEach(v => {
        result[v.hostip] = v.osusers.current
      })
      return result
    },
    handleReload() {

    },

    handeSelectUser(val) {
      this.createuser = val
    }

  }
}
</script>
<style lang="sass" scoped>
  .history-page
    padding: 20px

    .filter-header
      margin: 20px 0
      line-heght: 24px

    .filter-box
      display: flex
      align-items: center

    .table-content .table-header
      .title
        margin: 38px 0 20px 0
        line-heght: 24px

      .header-box
        display: flex

        .choice-btn
          border: 1px solid #DCDFE6
          width: 120px
          height: 36px
          line-heght: 36px
          margin-bottom: 11.5px
          display: flex
          align-items: center
          border-radius: 5px

          .btn
            padding: 0 15px
            height: 19px
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
            margin: 0 10px
            padding: 10px 19px

</style>
