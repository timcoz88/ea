<template>
  <el-card style="margin: 20px">
    <el-row :gutter="48" style="margin-bottom: 24px">
      <el-col :span="6">
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
      </el-col>
      <!-- <el-col :span="6">
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
      </el-col>-->
      <el-col :span="6">
        <el-button type="primary" :disabled="!searchType" @click="search">查询</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="isLoading" :data="tableData" border style="width: 100%">
      <el-table-column align="center" label="服务器名" prop="hostnm" />
      <el-table-column align="center" label="服务器IP地址" prop="hostip" />
      <el-table-column align="center" label="端口" prop="port" />
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
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="{ row, $index}">
          <el-button type="primary" size="mini" @click="polling(row, $index)" :loading="row.loading">调度</el-button>
          <el-button type="primary" size="mini" @click.native.prevent="goHandleRecord(row)">基线历史</el-button>
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
    <!-- 修改弹窗 -->
    <el-dialog title="修改服务器资源" :visible.sync="editShow">
      <el-form ref="ruleForm" :model="ruleForm">
        <el-form-item label="服务器名" :label-width="formLabelWidth" prop="hostnm">
          <el-input v-model="ruleForm.hostnm" autocomplete="off" />
        </el-form-item>
        <el-form-item label="服务器ip" :label-width="formLabelWidth" prop="hostip">
          <el-input v-model="ruleForm.hostip" autocomplete="off" />
        </el-form-item>
        <el-form-item label="端口" :label-width="formLabelWidth" prop="port">
          <el-input v-model="ruleForm.port" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="maskCancel('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="maskSureUpdate('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>

    <polling-dialog ref="pollingDialog" @confirm="confirm" />
  </el-card>
</template>
<script>
import { getServiceHost, deleteHost, updateHost } from '@/api/resource'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import PollingDialog from './pollingDialog'
import { fetchDetail } from '@/api/handler.js'

const isActiveList = {
  0: '在用',
  1: '失效'
}

export default {
  components: {
    Pagination,
    PollingDialog
  },
  data() {
    return {
      formLabelWidth: '120px',
      editShow: false,
      ruleForm: {},
      type: '',
      placeholderText: '',
      select: '',
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
      searchType: '',
      searchOptions: [
        {
          value: 'hostip',
          label: '请输入服务器ip'
        },
        {
          value: 'hostnm',
          label: '请输入服务器名'
        }
      ]
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
    getParams() {
      const { searchVal, ...arg } = this.storeForm
      const params = this.searchType ? { [this.searchType]: searchVal } : {}
      return Object.assign({}, {
        page: this.pagination.page,
        pageSize: this.pagination.pageSize
      }, arg, params)
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
    changePage({ page, limit }) {
      this.pagination.page = page
      this.pagination.pageSize = limit
      this.getList()
    },
    edit(row) {
      this.editShow = true
      this.ruleForm = Object.assign({}, row)
    },
    deleteRow(row) {
      console.log(row)
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteHost(row.id).then(res => {
            console.log(res)
          })
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.$refs.pollingDialog.hide()
          this.getList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    polling(row) {
      row.loading = true
      this.tableData.splice()
      fetchDetail({ shell_id: 21,check_type:1, hostip: row.hostip })
        .then(res => {
          this.$message.success(res.msg)
          this.getList()
        })
        .finally(() => {
          row.loading = false
          this.tableData.splice()
        })
    },
    confirm() {
      this.getList()
    },
    // 取消弹窗
    maskCancel(formName) {
      this.editShow = false
      this.$refs[formName].resetFields()
    },
    // 确认修改
    maskSureUpdate(formName) {
      this.editShow = false
      const obj = this.ruleForm
      console.log(obj)
      const updateObj = {
        hostnm: obj.hostnm,
        hostip: obj.hostip,
        port: obj.port
      }
      updateHost(obj.id, updateObj).then(res => {
        console.log(res)
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
        this.getList()
      })
      this.$refs[formName].resetFields()
    },
    goHandleRecord(row) {
      console.log(row)
      this.$router.push({ name: 'handlerJxRecord', query: { host_ip: row.hostip, check_type: 1 }})
    }
  }
}
</script>
<style scoped>
  .find {
    width: 130px;
  }
</style>
