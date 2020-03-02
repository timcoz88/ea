<template>
  <el-card style="margin: 20px" class="warning-page" >
    <div class="filter-container">
      <div class="filter-box">
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
          <el-col :span="8">
            <el-radio-group v-model="filter.msglvl" @click="handleSearch">
              <el-radio-button label="">全部</el-radio-button>
              <el-radio-button label="关注"/>
              <el-radio-button label="重要"/>
              <el-radio-button label="紧急"/>
            </el-radio-group>
          </el-col>
          <el-col :span="8" class="text-right">

            <el-button
              type="primary"
              @click="handleSearch"
            >
              搜索
            </el-button>
            <el-button type="dark" @click="handleClear">重置</el-button>
          </el-col>
      </el-row></div>
    </div>
    <div class="table-content">
      <div class="table-box">
        <el-table
          v-loading="tableLoading"
          :data="tableData"
          border
          style="width: 100%"
        >
          <el-table-column
            prop="id"
            label="序号"
            width="70"
          />
          <el-table-column
            label="级别"
            width="70"
          >
            <template slot-scope="scope">
              <el-tag :type="scope.row.msglvl | msgType">{{ scope.row.msglvl }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="dsn"
            label="数据库"
            width="100"
          />
          <el-table-column
            prop="dbtype"
            label="数据类型"
            width="100"
          />
          <el-table-column
            prop="dbinfo"
            width="240"
            label="数据库说明"
          />
          <el-table-column
            prop="hostip"
            label="主机地址"
            width="125"
          />
          <el-table-column
            prop="msgdata"
            label="事件"
          />
          <el-table-column
            prop="msgtm"
            label="预警时间"
            width="160"
          >
            <template slot-scope="{ row }">
              {{ row.msgtm | parseTime('{y}-{m}-{d} {h}:{i}') }}
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态"
            width="100"
          />
          <el-table-column
            fixed="right"
            label="操作"
            width="180"
          >
            <template slot-scope="scope">
              <!--<el-button
                :loading="scope.row.btnLoading"
                type="primary"
                size="small"
                class="btn primary-btn"
                @click="confirmMsg(scope.row)"
              >
                确认
              </el-button>-->
              <el-button
                type="primary"
                class="btn primary-btn"
                size="small"
                @click="getFaultWarningItem(scope.row)"
              >
                处理
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="page-box">
      <Pagination
        v-if="total > 0"
        :current-page="page"
        :total="total"
        @page="handlePage"
      />
    </div>
    <detail
      ref="dialog"
      :data="currentData"
      @refresh="getWarningList"
    />
  </el-card>
</template>
<script>
import repo from '@/services/modules/fault'
import Detail from './detail'
import Pagination from '@/components/Pagination'

const statusMap = {
  0: 'NEW',
  1: '待处理',
  2: '已处理',
  3: '忽略'
}

export default {
  components: {
    Detail,
    Pagination
  },

  filters: {
    msgType(msg) {
      if (msg === '紧急') {
        return 'danger'
      }
      if (msg === '重要' || msg === '严重') {
        return 'warning'
      }
      return ''
    }
  },

  data() {
    return {
      tableData: [],
      tableLoading: false,
      currentData: {},
      filter: {
        searchType: 'hostip',
        msglvl: ''
      },
      /* {
        value: 'hostip2',
        label: '系统级别'
      }, {
        value: 'hostip4',
        label: '预警状态'
      },  {
        value: 'hostip5',
        label: '预警事件'
      }, */
      page: 1,
      total: 0,
      options: [
        {
          value: 'dbinfo',
          label: '数据库说明'
        }, {
          value: 'hostip',
          label: '主机ip'
        }, {
          value: 'dsn',
          label: '数据库名'
        }, {
          value: 'dbtype',
          label: '数据库类型'
        }]
    }
  },

  beforeDestroy() {
    clearInterval(this.timer)
  },

  created() {
    this.tableLoading = true
    this.getWarningList().then(() => {
      this.tableLoading = false
      this.timer = setInterval(() => {
        this.getWarningList()
      }, 10000)
    })
  },

  methods: {
    // pagination
    handlePage(page) {
      this.page = page
      this.getWarningList()
    },
    /*
    *  conditions: Object.entries(this.filter).map(([key, val]) => {
            return [key, 'like', val]
          })
    * */
    getFilter() {
      // const { msgstat } = this.$route.query

      return Object.assign({}, {
        page: this.page,
        pageSize: 10,
        [this.filter.searchType]: this.filter.searchVal,
        msglvl: this.filter.msglvl
      })
    },
    handleSearch() {
      this.page = 1
      this.getWarningList()
    },
    getWarningList() {
      const params = {
        ...this.$route.query,
        ...this.getFilter()
      }
      return repo.getWarningList(params).then(({ results: data }) => {
        if (!Array.isArray(data.results)) {
          data.results = []
        }
        this.total = data.totalCount
        this.tableData = data.results.map(v => {
          return {
            ...v,
            status: statusMap[v.msgstat],
            btnLoading: false
          }
        })
      }, Function.prototype)
    },
    handleClear() {
      this.filter = {
        searchType: 'hostip'
      }
      this.page = 1
      this.getWarningList()
    },
    showDialog(row) {

    },
    getFaultWarningItem({ id }) {
      repo.getFaultWarningItem(id)
        .then(({ results: data }) => {
          this.currentData = data
          this.$refs.dialog.show()
        })
    },
    addSuccess() {
      if (this.page === 1) {
        this.handleTableList(1)
      }
    },
    confirmMsg(row) {
      // 确认将状态改为待处理
      row.btnLoading = true
      repo.analysisWarning({
        id: row.id,
        opresult: row.opresult,
        msgstat: 1
      }).then(() => {
        row.msgstat = 1
        row.status = '待处理'
        this.$message.success('状态修改成功')
      }, Function.prototype).then(() => {
        row.btnLoading = false
      })
    }
  }

}
</script>
<style lang="sass">
.el-table
  thead
    th
      background: #f5f7fa
</style>
<style lang="sass" scoped>
.warning-page

  .btn
    margin-left: 6px
    padding: 7px 12px

  .fast-query-content
    border-radius: 5px
    margin-top: 22px
    border: 1px solid #dcdfe6

    .query-header
      background: #F5F7FA
      height: 44px
      line-height: 44px
      text-align: center
      color: #606266
      border-bottom: 1px solid #dcdfe6

    .query-content
      padding-left: 41px

      .query-item
        display: flex
        align-items: center
        margin-bottom: 20px
        margin-top: 38px

        .item-left
          min-width: 80px
          margin-right: 26px
</style>
