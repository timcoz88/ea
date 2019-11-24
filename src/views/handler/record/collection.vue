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
      <el-table-column align="center" label="host id" prop="host_id" />
      <el-table-column align="center" label="系统登录用户" prop="login_name" />
      <el-table-column align="center" label="执行shell用户" prop="whoami" />
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
      <el-table-column align="center" label="开始时间" prop="start_time">
        <template slot-scope="{row}">
          <span>{{ row.start_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="结束时间" prop="end_time">
        <template slot-scope="{row}">
          <span>{{ row.end_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="80">
        <template slot-scope="{ row, $index}">
          <!-- <el-button type="primary" size="mini" @click="$refs.pollingDialog.show(row, $index)">调度</el-button>
          <el-button type="primary" size="mini" @click.native.prevent="deleteRow(row)">资源</el-button> -->
          <el-button type="primary" size="mini" @click="goResult(row)">结果</el-button>
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

    <el-drawer
      title="结果详情"
      :visible.sync="drawer"
      :direction="direction"
      size="100%"
      :before-close="handleClose"
    >
      <div style="overflow-y: scroll;height: 85vh;padding-left: 25px">
        <el-table :data="result" border>
          <el-table-column align="center" label="检查项" prop="item1" width="200px"></el-table-column>
          <el-table-column align="left" label="检查结果" prop="item2" >
            <template slot-scope="{ row }">
              <div class="pre content-td">{{ row.item2 }}</div>
            </template>
          </el-table-column>
          <el-table-column align="left" label="检查命令" prop="command" width="140px">
            <template slot-scope="{row}">
              <template v-if="row.edit">
                <el-input v-model="row.command" class="edit-input" size="small" />
                <el-button
                  class="cancel-btn"
                  size="small"
                  type="text"
                  @click="cancelEdit(row, 'Command')"
                >
                  取消
                </el-button>
              </template>
              <span v-else>{{ row.command }}</span>
            </template>
          </el-table-column>
          <el-table-column align="left" label="检查是否通过" prop="isPass" width="140px">
            <template slot-scope="{row}">
              <template v-if="row.edit">
                <el-input v-model="row.isPass" class="edit-input" size="small" />
                <el-button
                  class="cancel-btn"
                  size="small"
                  type="text"
                  @click="cancelEdit(row, 'IsPass')"
                >
                  取消
                </el-button>
              </template>
              <span v-else>{{ row.isPass }}</span>
            </template>
          </el-table-column>
          <el-table-column align="left" label="备注" prop="remark" width="140px">
            <template slot-scope="{row}">
              <template v-if="row.edit">
                <el-input v-model="row.remark" class="edit-input" size="small" />
                <el-button
                  class="cancel-btn"
                  size="small"
                  type="text"
                  @click="cancelEdit(row, 'Remark')"
                >
                  取消
                </el-button>
              </template>
              <span v-else>{{ row.remark }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="120">
            <template slot-scope="{row}">
              <el-button
                v-if="row.edit"
                type="success"
                size="small"
                icon="el-icon-circle-check-outline"
                @click="confirmEdit(row)"
              >
                保存
              </el-button>
              <el-button
                v-else
                type="primary"
                size="small"
                icon="el-icon-edit"
                @click="row.edit=!row.edit"
              >
                编辑
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--<div class="">
          <div class="content" style="position: relative">
            <div class="content-th">
              <div class="content-td content-title" style="position: absolute;width: 200px;padding: 15px 10px">检查项</div>
              <div style="margin-left: 200px;padding: 15px 10px" class="content-td content-title">检查结果</div>
            </div>
            <div
              v-for="(code, key) in result"
              :key="key"
              class="content-th"
            >
              <div class="content-td" style="position: absolute;width: 200px;padding: 15px 10px">{{ key }}</div>
              <div style="margin-left: 200px;padding: 15px 10px" class="pre content-td">{{ code }}</div>
            </div>
          </div>
        </div>-->
      </div>

    </el-drawer>

    <polling-dialog ref="pollingDialog" @confirm="confirm" />
  </el-card>
</template>
<script>
import { collectionList, updateCollectionList } from '@/api/resource'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import PollingDialog from './pollingDialog'

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
      result: [],
      drawer: false,
      direction: 'btt',
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
          value: 'host_id',
          label: '请输入服务器id'
        }
      ],
      id: '',
    }
  },
  created() {
    this.search()
  },
  methods: {
    cancelEdit(row, key) {
      row[key] = row['original' + key]
      row.edit = false
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
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
      collectionList(this.getParams())
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
          // deleteHost(row.id).then(res => {
          //   console.log(res)
          // })
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
    confirm() {

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
      // const updateObj = {
      //   hostnm: obj.hostnm,
      //   hostip: obj.hostip,
      //   port: obj.port
      // }
      // updateHost(obj.id, updateObj).then(res => {
      //   console.log(res)
      //   this.$message({
      //     type: 'success',
      //     message: '修改成功!'
      //   })
      //   this.getList()
      // })
      this.$refs[formName].resetFields()
    },
    confirmEdit(row) {
      row.edit = false
      const result = this.result.map(v => {
        const { item1, item2, command, isPass, remark } = v
        return {
          item1,
          item2,
          command,
          isPass,
          remark
        }
      })

      console.log(result)
      updateCollectionList(this.id, {response: result})
        .then(res => {
          this.$message.success('保存成功')
          this.getList()
        })
    },
    goResult(row) {
      this.drawer = true
      this.id = row.id
      let result = []
      if (Array.isArray(row.response)) {
        result = row.response
      } else {
        Object.entries(row.response).forEach(([key, val]) => {
          result.push({ item1: key, item2: val, command: '', isPass: '', remark: '' })
        })
      }
      result.map(v => {
        this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
        v.originalCommand = v.command //  will be used when user click the cancel botton
        v.originalIsPass = v.isPass //  will be used when user click the cancel botton
        v.originalRemark = v.remark //  will be used when user click the cancel botton
        return v
      })
      this.result = result
    }
  }
}
</script>
<style lang="scss">
  .pre {
    font: 12px Monaco, "Courier New", Courier, monospace;
    line-height: 16px;
    white-space: pre-wrap !important;
    word-wrap: break-word !important;
    *white-space: normal !important;
    span{
      float: left;
      display: inline-block;
      min-width: 100px;
    }
  }

  .content {
    border: 1px solid #f0dacf;
    .content-td + .content-td{
      border-left: 1px solid #f0dacf;
    }

    .content-th +.content-th{
      border-top: 1px solid #f0dacf;
    }

    .content-title{
      color: #999;
    }
  }

  .sql-plan-title {
    padding: 10px 0;
    color: #EB4339;
    font-size: 18px;
  }
</style>
<style scoped>
  .edit-input {
    padding-right: 40px;
  }
  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }
</style>
