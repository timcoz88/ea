<template>
  <el-table :data="list" v-loading="isLoading" style="width: 100%;padding-top: 15px;">
    <el-table-column
      label="系统级别"
      prop="dblvl"
      width="90"
    />
    <el-table-column
      prop="dsn"
      label="数据库名"
    />
    <el-table-column
      prop="dbinfo"
      label="数据库说明"
    />
    <el-table-column
      prop="clflag"
      label="数据库架构"
    />
    <el-table-column
      prop="hostip"
      label="主机地址"
      width="160"
    />
    <el-table-column
      label="紧急事件"
      width="100"
    >
      <template slot-scope="scope">
        <div
          :class="{'pointer': scope.row.hcnt}"
          class="text-red"
          @click="redirectToWaring('紧急', scope.row)">
          {{ scope.row.hcnt }}
        </div>
      </template>
    </el-table-column>
    <el-table-column
      label="重要事件"
      width="100"
    >
      <template slot-scope="scope">
        <div
          :class="{'pointer': scope.row.mcnt}"
          class="text-blue"
          @click="redirectToWaring('重要', scope.row)">
          {{ scope.row.mcnt }}
        </div>
      </template>
    </el-table-column>
    <el-table-column
      label="关注事件"
      width="100"
    >
      <template slot-scope="scope">
        <div
          :class="{'pointer': scope.row.lcnt}"
          class="text-yellow"
          @click="redirectToWaring('关注', scope.row)">
          {{ scope.row.lcnt }}
        </div>
      </template>
    </el-table-column>
    <el-table-column
      :formatter="filterData"
      prop="lasttm"
      label="最后采集时间"
      width="160"
    />
  </el-table>
</template>

<script>
import { getDashboard5 } from '@/api/home'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[status]
    },
    orderNoFilter(str) {
      return str.substring(0, 30)
    }
  },
  data() {
    return {
      list: null,
      isLoading: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    filterData(row, column, cellValue) {
      return cellValue || '-'
    },
    fetchData() {
      this.isLoading = true
      getDashboard5().then(({results}) => {
        this.isLoading = false
        this.list = results.results
      })
        .finally(() => {
          this.isLoading = false
        })
    }
  }
}
</script>
