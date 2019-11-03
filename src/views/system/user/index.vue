<template>
  <el-card style="margin: 20px">
    <el-row :gutter="48" style="margin-bottom: 24px">
      <el-col :span="6">
        <el-input
          v-model="searchForm.mobile"
          @keyup.enter.native="search"
          placeholder="请输入手机号"></el-input>
      </el-col>
      <el-col :span="6">
        <el-input
          v-model="searchForm.email"
          @keyup.enter.native="search"
          placeholder="请输入邮箱"></el-input>
      </el-col>
      <el-col :span="6">
        <el-input
          v-model="searchForm.username"
          @keyup.enter.native="search"
          placeholder="请输入用户名"></el-input>
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
      <el-table-column align="center" label="用户名" prop="username"></el-table-column>
      <el-table-column align="center" label="邮箱" prop="email"></el-table-column>
      <el-table-column align="center" label="手机号" prop="mobile"></el-table-column>
      <el-table-column align="center" label="是否激活" prop="is_active">
        <template slot-scope="{row}">
          {{isActiveList[row.is_active]}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="管理员级别" prop="is_superuser">
        <template slot-scope="{row}">
          {{ superUserList[row.is_superuser] }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" prop="created_at">
        <template slot-scope="{ row }">
          <span>{{ row.created_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="登录时间" prop="last_login">
        <template slot-scope="{ row }">
          <span>{{ row.last_login | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
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
import { getUserList } from '@/api/system'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const superUserList = {
  0: '超级管理员',
  1: '管理员',
  2: '普通管理员'
}

const isActiveList = {
  0: '在用',
  1: '封停'
}

export default {
  components: {
    Pagination
  },
  data() {
    return {
      superUserList,
      isActiveList,
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
      getUserList(this.getParams())
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
