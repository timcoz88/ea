<template>
  <div class="history-page">
    <div class="filter-container">
      <el-row :gutter="10">
        <el-col :span="5" style="display: flex">
          <el-input
            v-model.trim="filter.searchVal"
            style="max-width: 500px"
            type="text"
            class="filter-input"
            placeholder="请输入搜索内容"
            @keyup.enter.native="handleSearch"
          >
            <el-select
              slot="prepend"
              v-model="filter.searchType"
              class="filter-select"
              style="width: 120px;"
              placeholder="请选择查询类型">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-select
            v-model="orderByLabel"
            style="margin-left: 20px;width: 100%"
            class="filter-select"
            placeholder="请选择查询类型">
            <el-option
              v-for="item in options1"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-radio-group v-model="orderByType" style="margin-left: 20px;">
            <el-radio label="DESC">倒序</el-radio>
            <el-radio label="ASC">顺序</el-radio>
          </el-radio-group>
          <el-button
            type="primary"
            style="margin-left: 20px"
            @click="handleSearch"
          >
            搜索
          </el-button>
          <el-button @click="handleReload">重置</el-button>
        </el-col>

        <el-col :span="6" class="text-right">
          <el-button-group>
            <el-button
              :disabled="radio === ''"
              type="primary"
              @click="$router.push({name: 'sqlPlanDetail', query: { hostip : $route.query.hostip, sql_id: currentRow.SQL_ID }})"
            >
              查询计划
            </el-button>
            <el-button
              :disabled="radio === ''"
              type="primary"
              @click="$router.push({name: 'fixPlanDetail', query: { hostip : $route.query.hostip, sql_id: currentRow.SQL_ID }})"
            >
              固定执行计划
            </el-button>
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
              prop="INIS_ID"
              label="实例号"
              width="70"

            />
            <el-table-column
              prop="SQL_ID"
              label="SQLID"
              width="150"
            />
            <el-table-column
              prop="SQL_TEXT"
              label="SQL文本"
              width="990"
            />
            <el-table-column
              prop="PLAN_HASH_VALUE"
              label="PLAN_HASH"
              width="120"
            />
            <el-table-column
              prop="PARSING_SCHEMA_NAME"
              label="SQL执行用户"
              width="120"
            />
            <el-table-column
              prop="ELAPSED_TIME"
              label="执行用时"
              width="120"
            />
            <el-table-column
              prop="CPU_TIME"
              label="CPU时间"
              width="120"
            />
            <el-table-column
              prop="EXECUTIONS"
              label="执行次数"
              width="120"
            />
            <el-table-column
              prop="BUFFER_GETS"
              label="逻辑读"
              width="120"
            />
                                    <el-table-column
              prop="DISK_READS"
              label="磁盘读"
              width="120"
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

    <addUserManage ref="addUserDialog" @success="handleReload" />
  </div>
</template>
<script>
import ManagementService from '@/services/modules/management'
import Pagination from '@/components/Pagination'
import addUserManage from './add-user-manage.vue'
import qs from 'qs'

export default {
  components: {
    Pagination,
    addUserManage
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
        searchType: 'SQL_ID'

      },
      orderByLabel: 'ELAPSED_TIME',
      orderByType: 'DESC',
      currentRow: {},
      options: [
        {
          value: 'SQL_ID',
          label: 'SQL_ID'
        },
        {
          value: 'SQL_FULLTEXT',
          label: 'SQL文本'
        },
        {
          value: 'PARSING_SCHEMA_NAME',
          label: 'SQL执行用户'
        }],
      options1: [
        {
          label: '按执行时间排序',
          value: 'ELAPSED_TIME'
        },
        {
          label: '按CPU时间排序',
          value: 'CPU_TIME'
        },
        {
          label: '按逻辑读排序',
          value: 'BUFFER_GETS'
        },
        {
          label: '按执行次数排序',
          value: 'EXECUTIONS'
        },
        {
          label: '按磁盘读排序',
          value: 'DISK_READS'
        }
      ],
      isShowDialog: false,
      params: {}
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
      return Object.assign({}, this.params, {
        page: this.pagination.page,
        pageSize: this.pagination.pageSize
      })
    },
    // load data
    handleList() {
      this.loading = true
      const { hostip, dsn } = this.$route.query
      const urlParams = qs.stringify(this.getFilter())
      ManagementService.sqlAnalyze({ hostip, dsn }, urlParams)
        .then(({ results: data }) => {
          this.tableData = data.results
          this.pagination.total = data.totalCount
          this.currentRow = {}
          this.radio = ''
        })
        .catch((err) => {
          // this.tableData = []
          this.pagination.total = 0

          this.$message.error(err.message)
        }).then(() => {
          this.loading = false
        })
    },
    userLock(data) {
      ManagementService.userLock(data)
        .then(() => {
          this.handleSearch()
        })
    },
    userUnLock(data) {
      ManagementService.userUnLock(data)
        .then(() => {
          this.handleSearch()
        })
    },
    // search
    handleSearch() {
      this.pagination.page = 1
      this.pagination.total = 0
      if (this.filter.searchVal) {
        this.params = {
          actor: this.filter.searchType,
          target: this.filter.searchVal
        }
      } else {
        this.params = {}
      }
      this.params.order_by = `${this.orderByLabel} ${this.orderByType}`
      this.handleList(this.getFilter())
    },
    // clear search
    handleClear() {
      this.filter = {
        searchType: 'username'
      }
      this.pagination.page = 1
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
      this.handleClear()
      this.pagination.page = 1
      this.pagination.total = 0
      this.handleList()
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
