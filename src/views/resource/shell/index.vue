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
          <el-button type="primary" :disabled="!searchType" @click="search">查询</el-button>
          <el-button type="primary" @click="$refs.uploadDialog.show()">
            <i class="el-icon-plus" />新增资源
          </el-button>
        </el-col>
      </el-form>

    </el-row>

    <el-table
      v-loading="isLoading"
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column align="center" label="文件名" prop="name" />
      <el-table-column align="center" label="后缀名" prop="extension" />
      <el-table-column align="center" label="路径" prop="path" />
      <el-table-column align="center" label="上传类型" prop="type">
        <template slot-scope="{ row }">
          <el-tag>{{ row.type === 1 ? 'shell' : 'other' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="大小" prop="size" />
      <el-table-column align="center" label="状态" prop="audsta">
        <template slot-scope="{ row }">
          <el-tag :type="row.audsta|statusFilter">{{ isActiveList[row.audsta] }}</el-tag>
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
      <el-table-column align="center" label="操作" width="360">
        <template slot-scope="scope">
          <!-- <el-button type="primary" icon="el-icon-edit" size="mini" @click="$refs.shellDialog.show(2, row, $index)">编辑</el-button> -->
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="rowDel(scope.row)">删除</el-button>
          <!-- <el-button type="primary" icon="el-icon-check" size="mini" @click="rowConfirm(row)">审核</el-button> -->
          <el-dropdown @command="handleCommand">
            <el-button
              type="danger"
              size="mini"
            >审核
              <i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="{status:1,row:scope.row}">通过</el-dropdown-item>
              <el-dropdown-item :command="{status:2,row:scope.row}">未通过</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button type="primary" icon="el-icon-download" size="mini" @click="rowDownload(scope.row)">下载</el-button>
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

    <shell-dialog ref="shellDialog" @confirm="confirm" />
    <upload-dialog ref="uploadDialog" @successUplod="successUplod" />
    <!-- <image-cropper
      v-show="imagecropperShow"
      :key="imagecropperKey"
      url="https://httpbin.org/post"
      lang-type="zh"
      @close="close"
      @crop-upload-success="cropSuccess"
    /> -->
  </el-card>
</template>
<script>
import { getShellList, delShell, confirmShell, updateShell, downloadShell } from '@/api/resource'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import ShellDialog from './ShellDialog'
import uploadDialog from './uploadDialog'

const isActiveList = {
  0: '待审核',
  1: '审核通过',
  2: '未通过'
}
export default {
  components: {
    Pagination,
    ShellDialog,
    uploadDialog

  },
  filters: {
    statusFilter(value) {
      let status = ''
      switch (value) {
        case 0:
          status = 'warning'
          break
        case 1:
          status = 'success'
          break

        default:
          status = 'danger'
      }
      return status
    }
  },
  data() {
    return {
      imagecropperShow: false,
      imagecropperKey: 0,
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
          value: 'name',
          label: '文件名'
        },
        {
          value: 'type',
          label: '文件类型'
        },
        {
          value: 'extension',
          label: '后缀名'
        }
      ]
    }
  },
  created() {
    this.search()
  },
  methods: {
    successUplod(data) {
      console.log(data)
      if (data === 'success') {
        this.getList()
      }
    },
    handleCommand(command) {
      if (command.status === 1) {
        this.$confirm('是否审核通过', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const obj = {
            audsta: 1
          }
          confirmShell(command.row.id, obj).then(() => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })

            this.getList()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      } else {
        this.$confirm('是否审核不通过', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const obj = {
            audsta: 2
          }
          confirmShell(command.row.id, obj).then(() => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })

            this.getList()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      }
    },
    cropSuccess(resData) {
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey + 1
      console.log(resData)
    },
    close() {
      this.imagecropperShow = false
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
      updateShell(id, { status }).then(res => {
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
        this.$refs.shellDialog.hide()
        this.getList()
      })
    },
    add(form, index) {
    },
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
      const { searchVal, ...arg } = this.storeForm
      const params = this.searchType ? { [this.searchType]: searchVal } : {}
      return Object.assign({}, {
        page: this.pagination.page,
        pageSize: this.pagination.pageSize
      }, arg, params)
    },
    changePage({ page, limit }) {
      this.pagination.page = page
      this.pagination.pageSize = limit
      this.getList()
    },
    rowDel(row) {
      this.$confirm('此操作将删除脚本资源, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delShell(row.id).then(() => {
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
    rowConfirm(row) {
      this.$confirm('是否审核通过', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        confirmShell(row.id).then(() => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })

          this.getList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    rowDownload(row) {
      downloadShell(row.id).then(res => {
        console.log(res)
      })
    }
  }
}
</script>
