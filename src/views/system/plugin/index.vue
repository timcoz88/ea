<template>
  <el-card style="margin: 20px">
    <el-row type="flex" class="row-bg" justify="space-between">
      <el-col :span="18">
        <el-form ref="searchForm" :inline="true" :model="searchForm">
          <el-form-item prop="plugin_name">
            <el-input
              v-model="searchForm.plugin_name"
              placeholder="请输入插件名称"
              class="input-with-select"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button @click="resetForm('searchForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="6" style="text-align:right">
        <el-button type="primary" @click="reload">项目重载</el-button>
        <el-button type="primary" @click="$refs.uploadDialog.show()">新增插件</el-button>
      </el-col>
    </el-row>
    <el-tag class="tag">Plugins: {{ totalCount }}</el-tag>
    <el-table v-loading="isLoading" :data="tableData" border style="width: 100%">
      <el-table-column align="center" label="插件名称" prop="plugin_name" />
      <el-table-column align="center" label="插件描述" prop="plugin_description" />
      <el-table-column align="center" label="插件版本" prop="plugin_version" />
      <el-table-column align="center" label="插件作者" prop="plugin_author" />
      <el-table-column align="center" label="插件链接" prop="plugin_url">
        <template slot-scope="scope">
          <a :href="scope.row.plugin_url" download="插件">{{ scope.row.plugin_url }}</a>
        </template>
      </el-table-column>
      <el-table-column align="center" label="期限" prop="plugin_license" />
      <el-table-column align="center" label="插件状态" prop="plugin_state">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.plugin_state === 'enabled' ? 'success' : 'danger'"
          >{{ scope.row.plugin_state|statusFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="small" :type="scope.row.plugin_state=='enabled'?'danger':'success'" @click="operateStatus(scope.row)">
            <template v-if="scope.row.plugin_state==='enabled'">关闭</template>
            <template v-else>开启</template>
          </el-button>
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
    <upload-dialog ref="uploadDialog" />
  </el-card>
</template>
<script>
import { getPluginList, operateStatus, reload } from '@/api/plugin'
import Pagination from '@/components/Pagination'
import uploadDialog from './uploadDialog'
export default {
  filters: {
    statusFilter(value) {
      const flag = value === 'enabled' ? '启用' : '禁用'
      return flag
    }
  },
  components: {
    Pagination,
    uploadDialog
  },
  data() {
    return {
      totalCount: 0,
      searchForm: {},
      tableData: [],
      isLoading: false,
      pagination: {
        total: 0,
        pageSize: 10,
        page: 1
      }
    }
  },

  created() {
    this.getList()
  },
  methods: {
    reload() {
      reload().then(res => {
        console.log(res)
        this.$message({
          type: 'success',
          message: '重载成功!'
        })
        this.getList()
      })
    },
    search() {
      this.getList()
    },
    getList() {
      this.isLoading = true
      const obj = Object.assign(
        {},
        {
          page: this.pagination.page,
          pageSize: this.pagination.pageSize
        },
        this.searchForm
      )
      console.log(obj)
      getPluginList(obj).then(res => {
        this.isLoading = false
        this.pagination.total = res.results.totalCount
        this.tableData = res.results.results
        this.totalCount = res.results.totalCount
      })
    },
    operateStatus(row) {
      const action =
        row.plugin_state === 'enabled' ? 'disablePlugin' : 'enablePlugin'
      const obj = {
        action: action,
        plugin_name: row.plugin_name
      }
      operateStatus(obj).then(res => {
        this.$message({
          type: 'success',
          message: '修改状态成功!'
        })
        this.getList()
      })
    },
    changePage({ page, limit }) {
      this.pagination.page = page
      this.pagination.pageSize = limit
      this.getList()
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.searchForm = {}
      this.getList()
    }
  }
}
</script>
<style scoped>
.form-list {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.tag{
  margin-bottom: 10px;
}
</style>
