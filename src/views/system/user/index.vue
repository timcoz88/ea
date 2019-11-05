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
        <el-button type="primary" @click="search" :disabled="!searchType">查询</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="isLoading" :data="tableData" border style="width: 100%">
      <el-table-column align="center" label="用户名" prop="username" />
      <el-table-column align="center" label="邮箱" prop="email" />
      <el-table-column align="center" label="手机号" prop="mobile" />
      <el-table-column align="center" label="是否激活" prop="is_active">
        <template slot-scope="{row}">
          <el-tag
            :type="row.is_active === 0 ? 'success' : 'danger'"
          >{{ isActiveList[row.is_active] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="管理员级别" prop="is_superuser">
        <template slot-scope="{row}">{{ superUserList[row.is_superuser] }}</template>
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
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="edit(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click.native.prevent="deleteRow(scope.row)">删除</el-button>
          <el-button type="text" size="small">修改密码</el-button>
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
    <el-dialog title="修改用户信息" :visible.sync="editShow">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input v-model="ruleForm.username" autocomplete="off" disabled />
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="ruleForm.email" autocomplete="off" />
        </el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth" prop="phone">
          <el-input v-model="ruleForm.mobile" autocomplete="off" />
        </el-form-item>
        <el-form-item label="是否激活" :label-width="formLabelWidth" prop="is_active">
          <el-select v-model="ruleForm.is_active" placeholder="请选择">
            <el-option label="在用" :value="0" />
            <el-option label="失效" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="管理员级别" :label-width="formLabelWidth" prop="is_superuser">
          <el-select v-model="ruleForm.is_superuser" placeholder="请选择管理员">
            <el-option label="超级管理员" :value="0" />
            <el-option label="管理员" :value="1" />
            <el-option label="普通管理员" :value="2" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="maskCancel('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="maskSureUpdate('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
import { getUserList, deleteUser, updateUser } from '@/api/system'
import Pagination from '@/components/Pagination'// secondary package based on el-pagination

const superUserList = {
  0: '超级管理员',
  1: '管理员',
  2: '普通管理员'
}

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
      ruleForm: {}, // 修改弹窗
      rules: {
        email: [
          // { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ]
      },
      formLabelWidth: '120px',
      editShow: false, // 编辑是否弹出
      type: '', // 筛选类型
      select: '', // 下拉
      selectContext: '', // 搜索文本框内容
      placeholderText: '', // 文本框提示
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
      },
      searchType: '',
      searchOptions: [
        {
          value: 'phone',
          label: '手机号'
        },
        {
          value: 'email',
          label: '邮箱'
        },
        {
          value: 'username',
          label: '用户名'
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
        pageSize: this.pagination.pageSize,
      }, params, arg)
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
    changePage({ page, limit }) {
      this.pagination.page = page
      this.pagination.pageSize = limit
      this.getList()
    },
    deleteRow(row) {
      console.log(row)
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteUser(row.id).then(res => {
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
    },
    // 确认修改
    maskSureUpdate(formName) {
      this.editShow = false
      const obj = this.ruleForm
      const updateObj = {
        email: obj.email,
        mobile: obj.mobile,
        is_active: obj.is_active,
        is_superuser: obj.is_superuser
      }
      updateUser(obj.id, updateObj).then(res => {
        console.log(res)
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
        this.getList()
      })
      this.$refs[formName].resetFields()
    },
    edit(row) {
      this.editShow = true
      this.ruleForm = Object.assign({}, row)
    },
    // 取消弹窗
    maskCancel(formName) {
      this.editShow = false
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style scoped>
.find {
  width: 130px;
}
</style>
