<template>
  <el-card style="margin: 20px">
    <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />

    <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
      <el-table-column v-for="item of tableHeader" :key="item.prop" :prop="item.prop" :label="item.label">
        <template slot-scope="{row}">
          <template v-if="isCanEditList.includes(item.prop) &&  row.edit">
            <el-input v-model="row[item.prop]" class="edit-input" size="small" />
            <el-button
              class="cancel-btn"
              size="small"
              icon="el-icon-refresh"
              type="warning"
              @click="cancelEdit(row)"
            >
              取消
            </el-button>
          </template>
          <span v-else>{{ row[item.prop] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" v-if="!!tableHeader.length" width="210px">
        <template slot-scope="{row}">
          <el-button
            type="danger"
            size="small"
            :loading="row.loading"
            @click="rowPing(row)"
          ><i class="el-icon-s-promotion" />
            PING
          </el-button>
          <!--<el-button
            type="primary"
            size="small"
            @click="showEdit(row)"
            v-if="!row.edit"
          >
            <i class="el-icon-edit" />
            修改
          </el-button>-->
          <el-button
            type="success"
            size="small"
            :disabled="!row.success"
            @click="rowUpdate(row)"
          >
            <i class="el-icon-edit" />
            更新
          </el-button>
          <!--<el-button
            type="success"
            size="small"
            @click="rowSave(row)"
          >
            <i class="el-icon-check" />
            保存
          </el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="详情"
      :visible.sync="isShowDialog">
      <span v-if="isResultLoading">请求中<i class="el-icon-loading"></i></span>
      <div>
        <pre v-html="result"></pre>
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import { ExcelPingHost, ExcelUpdateHost, ExcelSaveHost } from '@/api/resource'
const headerKey = [
  'hostip',
  'os_user',
  'os_pwd',
  'name',
  'db_user',
  'db_pwd'
]

export default {
  name: 'UploadExcel',
  components: { UploadExcelComponent },
  data() {
    return {
      tableData: [],
      tableHeader: [],
      isCanEditList: ['pwd', 'pwd1'],
      isShowDialog: false,
      isResultLoading: false,
      result: ''
    }
  },
  methods: {
    beforeUpload(file) {
      const isLt10M = file.size / 1024 / 1024 < 10

      if (isLt10M) {
        return true
      }

      this.$message({
        message: '请上传小于10M的文件',
        type: 'warning'
      })
      return false
    },
    handleSuccess({ results, header }) {
      this.tableData = results.map((v, i) => {
        const obj = {}
        headerKey.forEach((k, j) => {
          obj[k] = Object.values(v)[j]
          obj['original' + k] = Object.values(v)[j]
        })
        return obj
      })
      this.tableHeader = headerKey.map((v, i) => {
        return {
          label: header[i],
          prop: headerKey[i]
        }
      })
    },
    rowPing(row) {
      const params = {}
      Object.keys(row)
        .forEach(v => {
          if (headerKey.includes(v)) {
            params[v] = row[v]
          }
        })
      console.log(row, params)
      row.loading = true
      this.tableData.splice()
      ExcelPingHost(params)
        .then(res => {
          row.success = true
          this.$message.success(res.message)
        }).finally(() => {
          row.loading = false
          this.tableData.splice()
        })
    },
    rowUpdate(row) {
      const params = {}
      Object.keys(row)
        .forEach(v => {
          if (headerKey.includes(v)) {
            params[v] = row[v]
          }
        })
      console.log(row, params)
      this.isShowDialog = true
      this.isResultLoading = true
      ExcelUpdateHost(params)
        .then(res => {
          this.result = res.results
        })
        .finally(() => {
          this.isResultLoading = false
        })
      /* this.$confirm('此操作将更新并保存账号密码, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {

        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        }) */
    },
    rowSave(row) {
      const params = {}
      Object.keys(row)
        .forEach(v => {
          if (headerKey.includes(v)) {
            params[v] = row[v]
          }
        })
      console.log(row, params)
      ExcelSaveHost(params)
        .then(res => {
          this.$message.success('操作成功')
        })
    },
    cancelEdit(row) {
      Object.keys(row)
        .filter(v => !(v.substr(0, 8).includes('original')))
        .forEach(v => {
          if (headerKey.includes(v)) {
            row[v] = row['original' + v]
          }
        })
      row.edit = false
      this.tableData.splice()
    },
    showEdit(row) {
      row.edit = !row.edit
      this.tableData.splice()
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
  .edit-input {
    padding-right: 100px;
  }
  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }
</style>
