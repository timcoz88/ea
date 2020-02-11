<template>
  <el-card style="margin: 20px">
    <el-row :gutter="48" style="margin-bottom: 24px">
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
      <el-col :span="14" class="text-right">

        <el-button
          type="primary"
          @click="handleSearch"
        >
          搜索
        </el-button>
        <el-button @click="handleClear">重置</el-button>
      </el-col>
    </el-row>
    <div class="table-content">
      <div class="table-box">
        <ElTable
          v-loading="loading"
          ref="remoteData"
          :data="tableData"
          border
          style="width: 100%"
        >

          <el-table-column
            prop="dblvl"
            label="系统级别"
          />
          <el-table-column
            prop="hostip"
            label="主机ip"
          />
          <el-table-column
            prop="host_nm"
            label="主机名"
          />
          <el-table-column
            prop="dsn"
            label="数据库名"
          />
          <el-table-column
            prop="clflag"
            label="实例名"
          />
          <el-table-column
            prop="dbtype"
            label="数据库类型"
          />
          <el-table-column
            prop="dbinfo"
            label="数据库说明"
          />
          <el-table-column
            prop="db_status"
            label="运行状态"
          >
            <template slot-scope="scope">
              <el-tag :type="'success'">{{ scope.row.db_status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="db_ver"
            label="数据库版本"
          >
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="196"
          >
            <template slot-scope="props">
              <el-button
                :loading="!!props.row.loading"
                type="primary"
                size="small"
                class="btn"
                @click="manageFocus(props.row, props.$index)"
              >

                {{ !!props.row.loading ? '尝试连接...' : '管理' }}
              </el-button>
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
  </el-card>
</template>
<script>
import Pagination from '@/components/Pagination'
import { fetchList, postDbFocus } from '@/api/sql'

export default {
  components: {
    Pagination
  },

  data() {
    return {
      filter: {
        searchType: 'hostip'
      },
      tableData: [],
      page: 1,
      total: 0,
      loading: false,
      options: [{
        value: 'hostip',
        label: '主机ip'
      }, {
        value: 'hostnm',
        label: '主机名'
      }, {
        value: 'dbnm',
        label: '数据库名'
      }, {
        value: 'dbtype',
        label: '数据库类型'
      }, {
        value: 'dbstatus',
        label: '运行状态'
      }]
    }
  },

  mounted() {
    this.handleList()
  },

  methods: {
    // pagination
    handlePage(page) {
      this.page = page
      this.handleList()
    },
    getFilter() {
      return Object.assign({}, {
        page: this.page,
        pageSize: 10,
        hostip: this.filter.searchVal
      })
    },
    // load data
    handleList() {
      this.loading = true

      fetchList(this.getFilter())
        .then(({ results: data }) => {
          this.tableData = data.results
          this.total = data.totalCount
        })
        .catch((err) => {
          this.tableData = []
          this.total = 0
          this.$message.error(err.message)
        }).then(() => {
          this.loading = false
        })
    },
    manageFocus({ hostip, dsn }, index) {
      this.tableData[index].loading = true
      this.tableData = this.tableData.slice(0, this.tableData.length)
      postDbFocus({ hostip, dsn })
        .then(({ results: data }) => {
          this.tableData[index].loading = false
          this.tableData = this.tableData.slice(0, this.tableData.length)
          this.$router.push({
            name: 'dbOracleDetail',
            query: {
              hostip: hostip,
              dsn
            }
          })
        })
        .catch(() => {
          this.tableData[index].loading = false
          this.tableData = this.tableData.slice(0, this.tableData.length)
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
        searchType: 'hostip'
      }
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
