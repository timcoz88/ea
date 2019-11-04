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
      <el-table-column align="center" label="状态" prop="status">
        <template slot-scope="{ row }">
          <el-tag :type="row.next_run_time ? 'success' : 'danger'">{{row.next_run_time ? '在用' : '暂停'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="开始时间" prop="start_date"></el-table-column>
      <el-table-column align="center" label="运行间隔" prop="size">
        <template slot-scope="{ row }">
          <!-- 时间要前端算 -->
          <span>{{diffTimeInterval(row)}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="下一次运行时间" prop="next_run_time"></el-table-column>
      <el-table-column align="center" label="操作" prop="next_run_time">
        <template slot-scope="{ row, $index }">
          <el-button type="text" @click="$refs.taskDialog.show(2, row, $index)">编辑</el-button>
          <el-button type="text" @click="rowDel(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      :total="pagination.total"
      v-show="pagination.total > 0"
      :page.sync="pagination.page"
      :limit.sync="pagination.pageSize"
      @pagination="changePage"/>

    <task-dialog ref="taskDialog" @confirm="confirm"></task-dialog>
  </el-card>
</template>
<script>
import { getTaskList, delTask, updateTask } from '@/api/resource'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import TaskDialog from './TaskDialog'

export default {
  components: {
    Pagination,
    TaskDialog
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
    confirm(type, form, index) {
      if (type === 1) {
        this.addTask(form, index)
      } else if (type === 2) {
        this.updateTask(form, index)
      }
    },
    updateTask(form, index) {
      const { id, cron_value, cron_type } = form
      updateTask(id, { cron_value, cron_type }).then(res => {
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
        this.getList()
      })
    },
    addTask(form, index) {
    },
    rowDel(row) {
      this.$confirm('此操作将删除任务, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delTask(row.id).then(() => {
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
    editor() {
      this.$refs.taskDialog.show()
    },
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
      this.getList()
    },
    diffTimeInterval({ weeks, day, hours, minutes, seconds }) {
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
