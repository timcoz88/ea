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
      <el-table-column align="center" label="参数" prop="body">
        <template slot-scope="{row}">
          {{ row.body }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="条件" prop="args" >
        <template slot-scope="{row}">
          {{ row.args }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="路由" prop="url" />
      <el-table-column align="center" label="请求类型" prop="method" />
      <el-table-column align="center" label="执行人" prop="user_name" />
      <el-table-column align="center" label="返回结果" width="200">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-view" @click="edit(scope.row)">查看详情</el-button>
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
    <el-dialog title="详情" :visible.sync="editShow">
      <pre v-html="ruleForm.response"/>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editShow = false">关 闭</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
import { getAuditList } from '@/api/resource'
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
      getAuditList(this.getParams())
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
      this.ruleForm.response = this.syntaxHighlight(row.response)
    },
    syntaxHighlight(json) {
      if (typeof json !== 'string') {
        json = JSON.stringify(json, undefined, 2)
      }
      json = json.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>')
      return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
        var cls = 'number'
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'key'
          } else {
            cls = 'string'
          }
        } else if (/true|false/.test(match)) {
          cls = 'boolean'
        } else if (/null/.test(match)) {
          cls = 'null'
        }
        return '<span class="' + cls + '">' + match + '</span>'
      })
    },
    /* deleteRow(row) {
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
          this.getList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },*/
    // 取消弹窗
    maskCancel(formName) {
      this.editShow = false
      this.$refs[formName].resetFields()
    }
    // 确认修改
    /* maskSureUpdate(formName) {
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
    } */
  }
}
</script>
<style>
  pre {outline: 1px solid #ccc; padding: 5px; margin: 5px;text-align: left;
    white-space: pre-wrap!important;
    word-wrap: break-word!important;
    *white-space: normal!important;
  }
  .string { color: green; }
  .number { color: darkorange; }
  .boolean { color: blue; }
  .null { color: magenta; }
  .key { color: red; }
</style>
