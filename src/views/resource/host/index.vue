<template>
  <el-card style="margin: 20px">
    <el-row :gutter="48" style="margin-bottom: 24px">
      <el-col :span="6">
        <el-input
          v-model="searchForm.hostnm"
          @keyup.enter.native="search"
          placeholder="请输入服务器名"></el-input>
      </el-col>
      <el-col :span="6">
        <el-input
          v-model="searchForm.hostip"
          @keyup.enter.native="search"
          placeholder="请输入服务器ip"></el-input>
      </el-col>
      <el-col :span="6">
        <el-button type="primary" @click="search">查询</el-button>
      </el-col>
    </el-row>

    <el-table
      :data="tableData"
      v-loading="isLoading"
      border
      style="width: 100%"
    >
      <el-table-column align="center" label="服务器名" prop="hostnm"></el-table-column>
      <el-table-column align="center" label="服务器IP地址" prop="hostip"></el-table-column>
      <el-table-column align="center" label="端口" prop="port"></el-table-column>
      <el-table-column align="center" label="状态" prop="status">
        <template slot-scope="{ row }">
          <span>{{ row.status === 0 ? '新建' : '失效'  }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" prop="created_at">
        <template slot-scope="{row}">
          <span>{{ row.created_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="修改时间" prop="modify_at">
        <template slot-scope="{row}">
          <span>{{ row.modify_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
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
import { getServiceHost } from '@/api/resource'
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
      getServiceHost(this.getParams())
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
    }
  }
}
</script>
