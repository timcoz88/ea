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
      <el-table-column label="操作" v-if="!!tableHeader.length">
        <template slot-scope="{row}">
          <el-button
            type="danger"
            size="small"
            @click="rowPing(row)"
          ><i class="el-icon-s-promotion" />
            PING
          </el-button>
          <el-button
            type="primary"
            size="small"
            @click="showEdit(row)"
            v-if="!row.edit"
          >
            <i class="el-icon-edit" />
            修改
          </el-button>
          <el-button
            type="primary"
            size="small"
            @click="rowUpdate(row)"
            v-else
          >
            <i class="el-icon-edit" />
            更新
          </el-button>
          <el-button
            type="success"
            size="small"
            @click="rowSave(row)"
          >
            <i class="el-icon-check" />
            保存
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
<script>
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import { ExcelPingHost, ExcelUpdateHost, ExcelSaveHost } from '@/api/resource'
const headerKey = [
  'hostip',
  'type',
  'user',
  'pwd',
  'user1',
  'pwd1'
]

export default {
  name: 'UploadExcel',
  components: { UploadExcelComponent },
  data() {
    return {
      tableData: [],
      tableHeader: [],
      isCanEditList: ['pwd', 'pwd1']
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
      ExcelPingHost(params)
        .then(res => {
          this.$message.success('操作成功')
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
      ExcelUpdateHost(params)
        .then(res => {
          this.$message.success('操作成功')
        })
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
  .edit-input {
    padding-right: 100px;
  }
  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }
</style>
