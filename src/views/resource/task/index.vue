<template>
  <el-card style="margin: 20px">
    <el-row :gutter="48" style="margin-bottom: 24px">
      <el-form>
        <el-col :span="6">
          <el-form-item>
            <el-input
              v-model="searchForm.name"
              @keyup.enter.native="search"
              placeholder="请输入文件名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="search">查询</el-button>
        </el-col>
      </el-form>

    </el-row>

    <el-table
      :data="tableData"
      v-loading="isLoading"
      border
      style="width: 100%"
    >
      <el-table-column align="center" label="id" prop="id"></el-table-column>
      <el-table-column align="center" label="任务名" prop="name"></el-table-column>
      <el-table-column align="center" label="时间类型" prop="trigger"></el-table-column>
      <el-table-column align="center" label="开始时间" prop="start_date"></el-table-column>
      <el-table-column align="center" label="运行间隔" prop="size">
        <template slot-scope="{ row }">
          <!-- 时间要前端算 -->
          <span>{{diffTimeInterval(row)}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="下一次运行时间" prop="next_run_time"></el-table-column>
    </el-table>

    <pagination
      :total="pagination.total"
      v-show="pagination.total > 0"
      :page.sync="pagination.page"
      :limit.sync="pagination.pageSize"
      @pagination="changePage"/>
  </el-card>
</template>
<script>
import { getTaskList } from '@/api/resource'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  components: {
    Pagination
  },
  data() {
    return {
      tableData: [],
      searchForm: {},
      storeForm: {},
      isLoading: false,
      pagination: {
        total: 0,
        pageSize: 10,
        page: 1
      }
    }
  },
  created() {
    this.search()
  },
  methods: {
    search() {
      this.pagination.page = 1
      this.storeForm = this.searchForm
      this.getList()
    },
    getList() {
      this.isLoading = true
      getTaskList(this.getParams())
        .then(({ results }) => {
          this.tableData = results.results
          this.pagination.total = results.totalCount
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    getParams() {
      return Object.assign({}, {
        page: this.pagination.page,
        pageSize: this.pagination.pageSize
      },
      this.storeForm
      )
    },
    changePage({ page, limit }) {
      this.pagination.page = page
      this.pagination.pageSize = limit
    },
    diffTimeInterval({weeks, day, hours, minutes, seconds }) {
      let str = ''
      if (weeks) {
        str += `${weeks}周`
      }
      if (day) {
        str += `${day}天`
      }
      if (hours) {
        str += `${hours}小时`
      }
      if (minutes) {
        str += `${minutes}分钟`
      }
      if (seconds) {
        str += `${seconds}秒`
      }

      return str
    }
  }
}
</script>
