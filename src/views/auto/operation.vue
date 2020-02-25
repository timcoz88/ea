<template>
  <el-card v-loading="loading" style="margin: 20px">
    <div class="df">
      <div>
        <el-button type="primary" @click="addOper">新增</el-button>
        <el-button :disabled="JSON.stringify(multipleSelection) == '{}' || multipleSelection.runstatus == 'deploy'?true:false" @click="operationRunStart">运行</el-button>
        <el-button @click="edit" :disabled="typeof(multipleSelection.taskid) == 'undefined'?true:false">配置</el-button>
        <el-button @click="logBtn" :disabled="typeof(multipleSelection.taskid) == 'undefined'?true:false">日志</el-button>
        <el-button :disabled="multipleSelection.runstatus == 'deploy'?true:false" @click="delBtn">删除</el-button>
      </div>
      <div class="df2">
        <div class="df2">
          <label for="ts" style="width:80px;line-height:36px;">任务状态</label>
          <el-select v-model="taskStatus" name="ts" @change="statusChange">
            <el-option
              v-for="item in statusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <el-input v-model="content" placeholder="请输入内容" style="width:50%;margin-left:10px;"> <el-button slot="append" icon="el-icon-search" @click="selectID" /></el-input>
      </div>
    </div>
    <div style="margin-top:20px;">
      <el-table
        :data="opterationList"
        style="width: 100%"
      >
        <el-table-column
          width="50"
          align="center"
        >
          <template slot-scope="scope">
            <el-radio v-model="radio" :label="scope.$index" @change="selectDbchange">&nbsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column
          prop="taskid"
          label="任务ID"
        />
        <el-table-column
          prop="node_ip"
          label="分配IP"
        />
        <el-table-column
          label="部署状态"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.runstatus == 'fail'">失败</span>
            <span v-else-if="scope.row.runstatus == 'success'">成功</span>
            <span v-else-if="scope.row.runstatus == 'deploy'">部署中</span>
            <span v-else-if="scope.row.runstatus == 'new'">已创建</span>
            <span v-else>{{ scope.row.runstatus }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-box">
        <Pagination
          v-if="total > 0"
          :current-page="page"
          :total="total"
          @pagination="handlePage"
        />
      </div>
    </div>
  </el-card>
</template>
<script>
import { operationList, operationDel, operationRun } from '@/api/operation'
import Pagination from '@/components/Pagination'
export default {
  name: 'AutoOperation',
  components: {
    Pagination
  },
  data() {
    return {
      loading: true,
      radio: 0,
      statusList: [{
        label: '全部',
        value: ''
      },{
        label: '失败',
        value: 'fail'
      },
      {
        label: '部署中',
        value: 'deploy'
      }, {
        label: '已创建',
        value: 'new'
      }, {
        label: '成功',
        value: 'success'
      }],
      taskStatus: '',
      content: '',
      opterationList: [],
      total: 0,
      page: 1,
      pageSize: 10,
      multipleSelection: {}
    }
  },
  created() {
    this.opterList()
  },
  methods: {
    operationRunStart() {
      this.loading = true
      operationRun({
        taskid: this.multipleSelection.taskid
      }).then((results) => {
        this.$message.success(results.message)
        this.opterList()
      }).catch((err) => {
        this.$message.error(err.message)
      }).then(() => {
        this.loading = false
      })
    },
    handlePage(val) {
      this.page = val.page
      this.pageSize = val.limit
      this.opterList()
    },
    addOper() {
      this.$router.push({ name: 'addOper' })
    },
    edit() {
      this.$router.push({ name: 'addOper', query: { taskid: this.multipleSelection.taskid }})
    },
    logBtn() {
      this.$router.push({ name: 'deploymentLog', query: { taskid: this.multipleSelection.taskid }})
    },
    selectDbchange(index) {
      this.multipleSelection = this.opterationList[index]
    },
    selectID() {
      this.taskStatus = ''
      operationList({
        page: this.page,
        pageSize: this.pageSize,
        taskid: this.content,
        for_select: true
      }).then(({ results: data }) => {
        this.opterationList = data
        this.total = 0
        if (this.opterationList.length > 0) {
          this.multipleSelection = this.opterationList[0]
        }
      }).catch(err => {
        this.opterationList = []
        this.total = 0
        this.$message.error(err.message)
      })
    },
    statusChange(val) {
      this.content = ''
      operationList({
        page: this.page,
        pageSize: 10,
        runstatus: val,
        for_select: true
      }).then(({ results: data }) => {
        this.opterationList = data
        this.total = 0
        if (this.opterationList.length > 0) {
          this.multipleSelection = this.opterationList[0]
        }
      }).catch(err => {
        this.opterationList = []
        this.total = 0
        this.$message.error(err.message)
      })
    },
    opterList() {
      this.loading = true
      operationList({
        page: this.page,
        pageSize: this.pageSize
      }).then(({ results: data }) => {
        this.opterationList = data.results
        this.total = data.totalCount
        if (this.opterationList.length > 0) {
          this.multipleSelection = this.opterationList[0]
        }
      }).catch(err => {
        this.opterationList = []
        this.total = 0
        this.$message.error(err.message)
      }).then(() => this.loading = false)
    },
    delBtn() {
      this.$confirm(`此操作将永久删除${this.multipleSelection.taskid}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        operationDel({
          taskid: [this.multipleSelection.taskid]
        }).then((data) => {
          this.$message.success(data.message)
          this.opterList()
        }).catch((err) => {
          this.$message.error(err.message)
        }).then(_ => this.loading = false)
      }).catch(() => {})
    }
  }
}
</script>
<style lang="sass" scoped>
.df
    display: flex
    justify-content: space-between
    .df2
        display: flex
        flex-direction:row
</style>
