<template>
  <div class="history-page">
    <div class="filter-container">
      <div class="filter-box">
        <el-row :gutter="10">
          <el-col :span="6">
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
                disabled
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
          <el-col :span="16" class="text-right">
            <el-button
              type="primary"
              @click="handleSearch"
            >
              搜索
            </el-button>
            <el-button
              @click="handleClear">重置</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="table-content">
      <div class="table-header">
        <div class="header-box">
          <div class="search-box" style="padding-bottom: 15px">
            <el-select
              v-model="resid"
              class="filter-select"
              placeholder="选择执行的程序"
            >
              <el-option
                v-for="(item,key) in procedureList"
                :key="key"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
            <el-button
              :disabled="projectDisabled"
              type="primary"
              class="search-btn"
              @click="handleProject"
            >
              执行
            </el-button>
          </div>
        </div>
      </div>
      <div class="table-box">
        <el-table
          v-loading="loading"
          ref="remoteData"
          :data="tableData"
          border
          style="width: 100%"
          @selection-change="selectList = $event"
        >
          <el-table-column
            type="selection"
            width="40"
          />
          <el-table-column
            prop="id"
            label="序号"
            width="50"
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
            prop="port"
            label="端口号"
          />
          <el-table-column
            prop="ostype"
            label="系统类型"
          />
          <el-table-column
            label="登陆用户"
          >
            <template slot-scope="scope">
              <el-select v-model="scope.row.target">
                <!-- eslint-disable -->

                <el-option
                  v-for="(item, index) in transferData(scope.row)"
                  :key="index"
                  :label="item[0] + '/' + item[1]"
                  :value="item[0] + '/' + item[1]"
                />
                <!-- eslint-disable -->
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="file_name"
            label="调度程序"
          />
          <el-table-column
            prop="start_time"
            label="发起时间"
          >
            <template slot-scope="{row}">
              <span>{{ row.start_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="end_time"
            label="结束时间"
          >
            <template slot-scope="{row}">
              <span>{{ row.end_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="状态"
            width="80"
          >
            <template slot-scope="scope">
              <el-tag :type="scope.row.status.type">{{ scope.row.status.name }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="200"
          >
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="small"
                class="btn"
                @click="goResult(scope.row)"
              >
                查看详情
              </el-button>
              <el-button
                type="primary"
                size="small"
                class="btn"
                @click="openRecordDetail(scope.row)"
              >
                历史调度
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page-box">
        <pagination
          v-if="total > 0"
          :current-page="page"
          :total="total"
          @page="handlePage"
        />
      </div>
    </div>
    <el-dialog title="详情" :visible.sync="isShowDialog">
      <div class="pre content-td">
        <pre v-html="result"/>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { fetchList, getProcedure, executeProcedure, getDispatchDetail } from '@/api/dispatch'
import Pagination from '@/components/Pagination'

const statusMap = {
  0: { name: '空闲', type: 'info' },
  11: { name: '成功', type: 'success' },
  14: { name: '失败', type: 'fail' },
  10: { name: '进行中', type: 'pending' }
}

export default {
  components: {
    Pagination,
  },

  data() {
    return {
      tableData: [],
      page: 1,
      total: 0,
      selectList: [],
      resid: '', // 执行程序的id
      procedureList: [],
      showDetail: false,
      taskid: null,
      createuser: null,
      loading: false,
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
        }],
      isShowDialog: false,
      result: ''
    }
  },

  computed: {
    projectDisabled() {
      return !this.resid || !this.selectList.length
    }
  },

  created() {
    this.handleList(this.getFilter())
    this.getProcedure()
  },

  methods: {
    goResult(row) {
      getDispatchDetail({hostip: row.hostip}).then(res => {
        this.isShowDialog = true
        this.result = res.results.resp
      })
    },
    openRecordDetail(row) {
      console.log(row)
      this.$router.push({
        name: 'dispatchHistory',
        query: {
          hostip: row.hostip
        }
      })
    },
    findDefault(item) {
      if (!item) {
        return ''
      }
      const { su = [] } = item
      if (!su) {
        return ''
      }
      const defaultItem = su.find(v => v[2] === 'default')
      return defaultItem && (defaultItem[0] + '/' + defaultItem[1]) || ''
    },
    transferData(item) {
      if (!item) {
        return []
      }
      const { osusers = [] } = item

      const newRoot = []

      for (let i = 0; i < osusers.length; i++) {
        for (let j = 0; j < osusers.length; j++) {
          newRoot.push([Object.keys(osusers[i])[0], Object.keys(osusers[j])[0]])
        }
      }
      return newRoot // .filter(v => v[0].osuserPassword !== v[1].osuserPassword)
    },
    handleChange() {

    },
    // 获得作业程序
    getProcedure() {
      getProcedure()
        .then((res) => {
          this.procedureList = res.results.results
        })
    },
    // check detail
    openDetail(row) {
      this.taskid = row.taskid
      this.$refs.detail.show(row.id)
    },

    // pagination
    handlePage(page) {
      this.page = page
      this.handleList(this.getFilter())
    },
    getFilter() {
      return Object.assign({}, {
        page: this.page,
        [this.filter.searchType]: this.filter.searchVal
      })
    },
    // load data
    handleList(filter = {}) {
      this.loading = true
      fetchList(filter)
        .then(({ results: data }) => {
          this.tableData = data.results.map(v => {
            const [user] = Object.entries(v.osusers).map(([key]) => key)
            v.osusers.current = user
            v.target = '' // this.findDefault(v)
            return {
              ...v,
              status: statusMap[v.job_status || 0]
            }
          })
          this.total = data.totalCount
        }, Function.prototype).then(() => {
          this.loading = false
        })
    },
    // search
    handleSearch() {
      this.handleList(this.getFilter())
    },
    // clear search
    handleClear() {
      this.filter = {}
    },
    getRunParams() {
      const shell_id = this.resid
      const hosts = this.selectList.map(v => {
        return [v.hostip, v.target.split('/')[0], v.target.split('/')[1]]
      })
      return { shell_id, hosts }

    },
    handleProject() {
      if (this.selectList.some(v => !v.target || !v.target && !v.target.length)) {
        this.$message.error('请选择登录用户')
        return false
      }

      if (this.selectList.length < 1) {
        this.$message.error('您还没有选择服务器')
        return false
      }

      executeProcedure(this.getRunParams())
        .then(() => {
          this.$message.success('执行成功')
          this.handleSearch()
        })
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
    // display: flex
    // align-items: center

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
