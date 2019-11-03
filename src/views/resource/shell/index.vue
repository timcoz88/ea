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
          <el-form-item>
            <el-input
              v-model="searchForm.type"
              @keyup.enter.native="search"
              placeholder="请输入文件类型"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-input
              v-model="searchForm.extension"
              @keyup.enter.native="search"
              placeholder="请输入后缀名"></el-input>
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
      <el-table-column align="center" label="文件名" prop="name"></el-table-column>
      <el-table-column align="center" label="后缀名" prop="extension"></el-table-column>
      <el-table-column align="center" label="路径" prop="path"></el-table-column>
      <el-table-column align="center" label="上传类型" prop="type">
        <template slot-scope="{ row }">
          <el-tag>{{ row.type === 1 ? 'shell' : 'other'  }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="大小" prop="size"></el-table-column>
      <el-table-column align="center" label="状态" prop="status">
        <template slot-scope="{ row }">
          <el-tag :type="row.status === 0 ? 'success' : 'danger'">{{isActiveList[row.status]}}</el-tag>
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
import { getShellList } from '@/api/resource'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
const isActiveList = {
  0: '在用',
  1: '失效'
}
export default {
  components: {
    Pagination
  },
  data() {
    return {
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
      getShellList(this.getParams())
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
