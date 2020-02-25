<template>
  <div>
    <el-input
      v-model.trim="filter.searchVal"
      type="text"
      class="filter-input"
      placeholder="请输入搜索内容"
      style="width: 30%"
      @keyup.enter.native="handleSearch"
    >
      <el-select
        slot="prepend"
        v-model="filter.searchType"
        style="width: 160px;"
        placeholder="请选择查询类型"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-input>
    <el-select v-model="order" name="grouping">
      <el-option v-for="(item,key) in sortOrder" :key="key" :label="item.label" :value="item.value" />
    </el-select>
    <el-radio v-model="radio" label="desc" style="margin-left:20px;">顺序</el-radio>
    <el-radio v-model="radio" label="asc">倒序</el-radio>
    <el-button @click="handleSearch">搜索</el-button>
    <el-button @click="reset">重置</el-button>
    <div style="margin-top:20px;">
      <el-table
        ref="remoteData"
        v-loading="loading"
        :data="tableData"
        border
        style="width: 100%"
        @row-dblclick="getDetail"
      >
        <el-table-column prop="sql_id" label="SQL ID" />
        <el-table-column prop="sql_text" label="SQL文本">
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              width="400"
              trigger="hover"
            >
              <div>
                {{ scope.row.sql_text }}
              </div>
              <span
                slot="reference"
                style="overflow: hidden;
text-overflow:ellipsis;
white-space: nowrap;"
              >{{ scope.row.sql_text }}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="schema_name" label="数据库" />
        <el-table-column prop="time_per" label="耗时比例" width="120" />
        <el-table-column prop="avg_latency" label="平均耗时(s)" width="120" />
        <el-table-column prop="avg_row_sent" label="平均返回行数" width="120" />
        <el-table-column prop="count" label="执行次数" width="120" />
      </el-table>
    </div>
    <div class="page-box">
      <Pagination v-if="total > 0" :current-page="page" :total="total" @pagination="handlePage" />
    </div>
  </div>
</template>
<script>
import { mysqlTopSqlList } from '@/api/management'
import Pagination from '@/components/Pagination'
export default {
  components: {
    Pagination
  },
  data() {
    return {
      loading: true,
      tableData: [],
      filter: {
        searchVal: '',
        searchType: ''
      },
      options: [],
      radio: 'desc',
      sortOrder: [
        {
          label: '耗时比例',
          value: 'time_per'
        },
        {
          label: '平均耗时(s)',
          value: 'avg_latency'
        },
        {
          label: '执行次数',
          value: 'count'
        },
        {
          label: '平均返回行数',
          value: 'avg_row_sent'
        }
      ],
      order: 'count',
      options: [{
        value: 'sql_text',
        label: 'SQL文本'
      }],
      page: 1,
      pageSize: 10,
      total: 0
    }
  },
  created() {
    this.getList({})
  },
  methods: {
    handlePage(value) {
      this.page = value.page
      this.pageSize = value.limit
      if (this.filter.searchType == 'sql_text') {
        this.getList({
          'sql_text': this.filter.searchVal
        })
      } else {
        this.getList({})
      }
    },
    getList(data) {
      this.loading = true
      const { hostip, dsn } = this.$route.query
      mysqlTopSqlList(Object.assign({}, {
        hostip,
        dsn,
        page: this.page,
        pageSize: this.pageSize,
        ORDER: this.radio,
        ORDER_TYPE: this.order
      }, data)).then(({ results: data }) => {
        this.tableData = data.results
        this.total = data.totalCount
      }).catch(err => {
        this.tableData = []
        this.total = 0
        this.page = 1
        this.pageSize = 10
        this.$message.error(err.message)
      })
        .then(() => this.loading = false)
    },
    handleSearch() {
      let param = {}
      this.page = 1
      this.pageSize = 10
      if (this.filter.searchType == 'sql_text') {
        param = { 'sql_text': this.filter.searchVal }
      }
      this.getList(Object.assign({}, param, {
        page: this.page,
        pageSize: this.pageSize,
        ORDER: this.radio,
        ORDER_TYPE: this.order
      }))
    },
    reset() {
      this.filter.searchVal = ''
      this.filter.searchType = ''
      this.radio = 'desc'
      this.order = 'count'
      this.handleSearch()
    },
    getDetail(row, column, event) {
      const { hostip, dsn, dbid } = this.$route.query
      // this.$router.push({name:'mysqlTopSql',query:{hostip, dsn,sql_id:row.sql_id}})
      this.$router.push({ name: 'topSql', query: { hostip, dsn, dbid, 'dbtype': 'mysql' }})
      localStorage.setItem('selectTopSql', JSON.stringify(row))
    }
  }
}
</script>
