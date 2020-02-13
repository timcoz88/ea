<template>
  <el-card style="margin: 20px">
    <el-row :gutter="48" style="margin-bottom: 24px">
      <el-form>
        <el-col :span="6">
          <el-form-item>
            <el-input
              v-model="searchForm.monnm"
              placeholder="请输入监控名称"
              @keyup.enter.native="search"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="search">查询</el-button>
        </el-col>
      </el-form>

    </el-row>

    <el-table
      v-loading="isLoading"
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column align="center" label="id" prop="id"/>
      <el-table-column align="center" label="监控名称" prop="monnm" show-overflow-tooltip/>
      <el-table-column align="center" label="问题级别" prop="msglvl">
        <template slot-scope="{ row }">
          <el-tag>{{ row.msglvl }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="采样频率" prop="freq">
        <template slot-scope="{row}">
          <span>{{ row.freq}}/分</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建时间" prop="created_at" width="150px">
        <template slot-scope="{row}">
          <span>{{ row.created_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="修改时间" prop="modify_at" width="150px">
        <template slot-scope="{row}">
          <span>{{ row.modify_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="解决建议" prop="start_date">
        <template slot-scope="{row}">
          <el-button type="text" @click="viewDetail(row, 'recommand', '解决建议')">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="监控SQL" prop="start_date">
        <template slot-scope="{row}">
          <el-button type="text" @click="viewDetail(row, 'monsql', '监控SQL')">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="详细SQL" prop="start_date">
        <template slot-scope="{row}">
          <el-button type="text" @click="viewDetail(row, 'detailsql', '详细SQL')">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" prop="start_date" width="120">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter('type')">{{row.status | statusFilter('text')}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" prop="next_run_time" width="200">
        <template slot-scope="{ row, $index }">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="$refs.warningSqlDialog.show(2, row, $index)">编辑
          </el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="rowDel(row)">删除</el-button>
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
    <el-dialog :title="dialogTitle" :visible.sync="isShowDialog">
      <pre v-html="detailSql"/>
    </el-dialog>

    <WarningSqlDialog ref="warningSqlDialog" @confirm="rowUpdate"></WarningSqlDialog>
  </el-card>
</template>
<script>
import { getWarningSqlList, delWarningSql, updateWarningSql } from '@/api/resource'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import WarningSqlDialog from './WarningSqlDialog' // secondary package based on el-pagination

export default {
  components: {
    Pagination,
    WarningSqlDialog
  },
  data() {
    return {
      pagination: {
        total: 0,
        pageSize: 10,
        page: 1
      },
      searchForm: {},
      storeForm: {},
      isLoading: false,
      tableData: [],
      isShowDialog: false,
      detailSql: '',
      dialogTitle: ''
    }
  },
  created() {
    this.search()
  },
  methods: {
    rowDel(row) {
      this.$confirm('此操作将删除任务, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delWarningSql(row.id).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })

          this.getWarningSqlList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    rowUpdate(form, index, loading) {
      const { id, ...restForm } = form
      updateWarningSql(id, restForm).then(res => {
        loading()
        this.$refs.warningSqlDialog.hide()
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
        this.getWarningSqlList()
      })
    },
    search() {
      this.pagination.page = 1
      this.storeForm = this.searchForm
      this.getWarningSqlList()
    },
    getParams() {
      return Object.assign({}, {
        page: this.pagination.page,
        pageSize: this.pagination.pageSize
      },
      this.storeForm
      )
    },
    getWarningSqlList() {
      this.isLoading = true
      getWarningSqlList(this.getParams()).then(({ results }) => {
        this.tableData = results.results
        this.pagination.total = results.totalCount
      })
        .finally(() => {
          this.isLoading = false
        })
    },
    changePage({ page, limit }) {
      this.pagination.page = page
      this.pagination.pageSize = limit
      this.getWarningSqlList()
    },
    viewDetail(row, type, title) {
      this.dialogTitle = title + '详情'
      this.detailSql = row[type]
      this.isShowDialog = true
    }
  },
  filters: {
    statusFilter(val, type) {
      /* 0:待审核
      -1:软删除
      1 审核通过
      2禁用 */
      const list = {
        0: {
          type: 'warning',
          text: '待审核'
        },
        1: {
          type: 'success',
          text: '审核通过'
        },
        2: {
          type: 'danger',
          text: '禁用'
        }
      }

      return list[val][type]
    }
  }
}
</script>
<style scoped>
  pre {outline: 1px solid #ccc; padding: 5px; margin: 5px;text-align: left;
    white-space: pre-wrap!important;
    word-wrap: break-word!important;
    *white-space: normal!important;}
  .string { color: green; }
  .number { color: darkorange; }
  .boolean { color: blue; }
  .null { color: magenta; }
  .key { color: red; }
</style>
