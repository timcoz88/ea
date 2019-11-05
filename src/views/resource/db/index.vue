<template>
  <el-card style="margin: 20px">
    <el-row :gutter="48" style="margin-bottom: 24px">
      <el-form>
        <el-col :span="6">
          <el-form-item>
            <el-input
              v-model.trim="searchForm.searchVal"
              type="text"
              class="filter-input"
              placeholder="请输入搜索内容"
              clearable
              @keyup.enter.native="search"
            >
              <el-select
                slot="prepend"
                v-model="searchType"
                class="filter-select"
                style="width: 160px;"
                placeholder="请选择查询类型"
              >
                <el-option
                  v-for="item in searchOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="search" :disabled="!searchType">查询</el-button>
        </el-col>
      </el-form>

    </el-row>

    <el-table
      v-loading="isLoading"
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column align="center" label="数据库名" prop="dbnm" />
      <el-table-column align="center" label="数据库ip" prop="hostip" />
      <el-table-column align="center" label="端口" prop="dbport" />
      <el-table-column align="center" label="数据库服务名" prop="dsn" />
      <el-table-column align="center" label="类型" prop="dbtype" />
      <el-table-column align="center" label="登录名" prop="dbuser" />
      <el-table-column align="center" label="数据库架构" prop="clflag" />
      <el-table-column align="center" label="数据库版本" prop="dbver" />
      <el-table-column align="center" label="状态" prop="status">
        <template slot-scope="{ row }">
          <el-tag :type="row.status === 0 ? 'success' : 'danger'">{{ isActiveList[row.status] }}</el-tag>
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
      <el-table-column align="center" label="操作">
        <template slot-scope="{row, $index}">
          <el-button type="text" @click="$refs.dbDialog.show(2, row, $index)">编辑</el-button>
          <el-button type="text" @click="rowDel(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="pagination.total > 0"
      :total="pagination.total"
      :page.sync="pagination.page"
      :limit.sync="pagination.pageSize"
      @pagination="changePage"
    />

    <db-dialog ref="dbDialog" @confirm="confirm" />
  </el-card>
</template>
<script>
import { getDbList, delDb, updateDb } from '@/api/resource'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import DbDialog from './DbDialog'
const isActiveList = {
  0: '在用',
  1: '失效'
}
export default {
  components: {
    Pagination,
    DbDialog
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
      },
      searchOptions: [
        {
          value: 'dbnm',
          label: '数据库名'
        },
        {
          value: 'hostip',
          label: '数据库ip'
        },
        {
          value: 'dbtype',
          label: '数据库类型'
        },
        {
          value: 'dsn',
          label: '登录名'
        },
        {
          value: 'clflag',
          label: '数据库架构'
        }
      ],
      searchType: ''
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
      getDbList(this.getParams())
        .then(({ results }) => {
          this.tableData = results.results
          this.pagination.total = results.totalCount
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    getParams() {
      const { searchVal, ...arg } = this.storeForm
      const params = this.searchType ? { [this.searchType]: searchVal } : {}
      return Object.assign({}, {
        page: this.pagination.page,
        pageSize: this.pagination.pageSize,
      }, arg, params)
    },
    confirm(type, form, index) {
      if (type === 1) {
        this.add(form, index)
      } else if (type === 2) {
        this.update(form, index)
      }
    },
    update(form, index) {
      const { id, status } = form
      updateDb(id, { status }).then(res => {
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
        this.getList()
      })
    },
    add(form, index) {
    },
    rowDel(row) {
      this.$confirm('此操作将删除数据库资源, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delDb(row.id).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })

          this.getList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    changePage({ page, limit }) {
      this.pagination.page = page
      this.pagination.pageSize = limit
      this.getList()
    }
  }
}
</script>
