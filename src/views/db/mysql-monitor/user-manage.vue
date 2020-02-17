<template>
  <div class="history-page">
    <div class="filter-container">
      <div class="filter-box">
        <el-row :gutter="10">
          <el-col :span="12" style="display: flex">
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
              style="margin-left: 20px"
              @click="handleSearch"
            >
              搜索
            </el-button>
            <el-button @click="handleReload">重置</el-button>
          </el-col>
          <el-col :span="12" class="text-right">
            <el-button-group>
              <el-button
                type="primary"
                @click="$refs.addUserDialog.show()"
              >
                新增用户
              </el-button>
              <el-button
                :disabled="radio === ''"
                type="primary"
                @click="$refs.addUserDialog.show(currentRow, 'editor')"
              >
                用户修改
              </el-button>
              <el-button
                :disabled="radio === ''"
                type="primary"
                @click="$router.push({name: 'userAdminEdit', query: {
                  hostip: $route.query.hostip,
                  username: currentRow.USERNAME,
                  dsn: $route.query.dsn
                }})"
              >
                权限修改
              </el-button>
              <el-button
                :disabled="radio === ''"
                type="primary"
                @click="userLock({hostip: $route.query.hostip,
                                  dsn: $route.query.dsn,
                                  username: currentRow.USERNAME})"
              >
                锁定用户
              </el-button>
              <el-button
                :disabled="radio === ''"
                type="primary"
                @click="userUnLock({hostip: $route.query.hostip,
                                    dsn: $route.query.dsn,
                                    username: currentRow.USERNAME})"
              >
                用户解锁
              </el-button>
            </el-button-group>
          </el-col>
        </el-row>
      </div>
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
              prop="USERNAME"
              label="用户名"
            />
            <el-table-column
              prop="ACCOUNT_STATUS"
              label="用户状态"
            />
            <el-table-column
              prop="LOCK_DATE"
              label="锁定日期"
            />
            <el-table-column
              prop="EXPIRY_DATE"
              label="失效日期"
            />
            <el-table-column
              prop="DEFAULT_TABLESPACE"
              label="默认表空间"
            />
            <el-table-column
              prop="TEMPORARY_TABLESPACE"
              label="临时表空间"
            />
            <el-table-column
              prop="CREATED"
              label="概要文件"
            />
            <el-table-column
              prop="PROFILE"
              label="创建日期"
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
        searchType: 'username'
      },
      currentRow: {},
      options: [
        {
          value: 'username',
          label: '用户名'
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
          [this.filter.searchType]: this.filter.searchVal
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
      ManagementService.getUserManageList({ hostip, dsn }, urlParams)
        .then(({ results: data }) => {
          this.tableData = data.results
          this.total = data.totalCount
          this.currentRow = {}
          this.radio = ''
        })
        .catch((err) => {
          // this.tableData = []
          this.total = 0

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
