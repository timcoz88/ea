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
            prop="id"
            label="序号"
            width="50"
          />
          <el-table-column
            prop="hostip"
            label="服务器IP"
          />
          <el-table-column
            prop="user"
            label="登录用户"
          />
          <el-table-column
            prop="whoami"
            label="执行用户"
          />
          <el-table-column
            prop="shell_name"
            label="脚本名"
          />
          <el-table-column
            prop="start_time"
            label="开始时间"
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
            label="调度状态"
            width="80"
          >
            <template slot-scope="scope">
              <el-tag :type="scope.row.job_status === 'true' ? 'success' :''">{{ scope.row.job_status === 'true' ? '成功' : '失败'}}</el-tag>
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
                结果
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

    <el-dialog title="结果" :visible.sync="isShowDialog">
      <div class="pre content-td">
        <pre v-html="result"/>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getDispatchHistory } from '@/api/dispatch'
import Pagination from '@/components/Pagination'

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
      result: '',
      isShowDialog: false
    }
  },

  computed: {
    projectDisabled() {
      return !this.resid || !this.selectList.length
    }
  },

  created() {
    this.handleList(this.getFilter())
  },

  methods: {
    goResult(row) {
      this.isShowDialog = true
      /*  */
      this.result = row.resp
    },
    openRecordDetail(row) {
      this.$router.push({
        name: 'dispatchHistory',
        query: {
          hostip: row.hotsip
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
        [this.filter.searchType]: this.filter.searchVal,
        hostip: this.$route.query.hostip
      })
    },
    // load data
    handleList(filter = {}) {
      this.loading = true
      getDispatchHistory(filter)
        .then(({ results: data }) => {
          this.tableData = data.results

          this.total = data.totalCount
        })
        .then(() => {
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
    handleReload() {

    },

    handeSelectUser(val) {
      this.createuser = val
    }

  }
}
</script>
<style lang="scss">
  pre {outline: 1px solid #ccc; padding: 5px; margin: 5px;text-align: left;
    white-space: pre-wrap!important;
    word-wrap: break-word!important;
    *white-space: normal!important;
  }
  .string { color: green; }
  .number { color: darkorange; }
  .boolean { color: blue; }
  .null { color: magenta; }
  .key { color: red; }
</style>
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
