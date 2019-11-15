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
      <el-col :span="6">
        <el-button type="primary" :disabled="!searchType" @click="search">查询</el-button>
        <el-button type="primary" @click="addShow=true">新增邮箱</el-button>
      </el-col>
    </el-row>
    <el-table v-loading="isLoading" :data="tableData" border style="width: 100%">
      <el-table-column align="center" label="邮箱名" prop="email" />
      <el-table-column align="center" label="电话" prop="phone" />
      <el-table-column align="center" label="姓名" prop="name" />
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
      <el-table-column align="center" label="操作" width="300">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" icon="el-icon-delete" @click.native.prevent="deleteRow(scope.row)">删除</el-button>
          <el-dropdown @command="handleCommand">
            <el-button
              type="danger"
              size="small"
            >PING
              <i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="phone">手机</el-dropdown-item>
              <el-dropdown-item command="email">邮箱</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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
    <!-- 新增弹窗 -->
    <el-dialog title="新增邮箱" :visible.sync="addShow">
      <el-form ref="addForm" :model="addForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addForm.name" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="addForm.phone" />
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="email"
          :rules="[
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
          ]"
        >
          <el-input v-model="addForm.email" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitFormAdd('addForm')">确定</el-button>
          <el-button @click="addShow=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 修改弹窗 -->
    <el-dialog
      title="编辑邮箱"
      :visible.sync="editShow"
    >
      <el-form ref="ruleForm" :model="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="ruleForm.phone" />
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="email"
          :rules="[
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
          ]"
        >
          <el-input v-model="ruleForm.email" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="ruleForm.status" style="width: 60%">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
          <el-button @click="editShow=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- ping弹窗 -->
    <el-dialog
      title="ping"
      :visible.sync="pingShow"
    >
      <el-select v-model="pingValue" style="width: 60%">
        <el-option
          v-for="item in pingOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button type="primary" @click="surePing">确定</el-button>
    </el-dialog>
  </el-card>
</template>

<script>
import { emailList, delEmail, editEmail, addEmail } from '@/api/resource'
import Pagination from '@/components/Pagination'
const isActiveList = {
  0: '在用',
  1: '停用'
}

export default {
  components: {
    Pagination
  },
  data() {
    return {
      addForm: {
        name: '',
        phone: '',
        email: ''
      },
      addShow: false,
      pingValue: 0,
      pingOptions: [{
        value: 0,
        label: '邮箱'
      }, {
        value: 1,
        label: '手机'
      }],
      options: [{
        value: 0,
        label: '在用'
      }, {
        value: 1,
        label: '停用'
      }],
      formLabelWidth: '200',
      pingShow: false,
      ruleForm: {},
      editShow: false,
      tableData: [],
      searchForm: {},
      storeForm: {},
      searchType: '',
      isLoading: false,
      isActiveList,
      pingId: '',
      searchOptions: [
        {
          value: 'phone',
          label: '手机号'
        },
        {
          value: 'email',
          label: '邮箱'
        }
      ],
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
    handleCommand(command) {

      this.$message('click on item ' + command)
    },
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
      emailList(this.getParams())
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
          delEmail(row.id).then(res => {
            console.log(res)
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getList()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    submitFormAdd(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          addEmail(this.addForm).then(res => {
            this.$message({
              type: 'success',
              message: '新增成功!'
            })
            this.addShow = false
            this.getList()
            this.$refs[formName].resetFields()
          })
        }
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const obj = this.ruleForm
          const updateObj = {
            name: obj.name,
            phone: obj.phone,
            status: obj.status,
            email: obj.email
          }
          editEmail(obj.id, updateObj).then(res => {
            console.log(res)
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            this.editShow = false
            this.getList()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    ping(row) {
      this.pingShow = true
      this.pingId = row.id
    },
    surePing() {
      this.$message({
        type: 'success',
        message: 'ping成功!'
      })
    }
  }
}
</script>

<style>
</style>
