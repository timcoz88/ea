<template>
  <el-dialog
    :visible.sync="showDialog"
    width="80%"
    title="远程调度详情"
    @click="emit('click')"
  >
    <div class="detail">
      <div class="detail-content">
        <div class="detail-item">
          <div class="user-box">
            <div class="item-title">
              作业名称:
            </div>
          </div>
          <el-table :data="tableData">
            <el-table-column
              prop="creatuser"
              label="创建人"
            />
            <el-table-column
              prop="created"
              label="创建时间"
            />
            <el-table-column
              prop="jobnm"
              label="调用程序名称"
            />
            <el-table-column
              prop="job_start"
              label="作业发起时间"
            />
            <el-table-column
              prop="job_end"
              label="作业结束时间"
            />
          </el-table>
        </div>
        <div class="detail-item">
          <div class="user-box">
            <div class="item-title">
              任务执行状态:
            </div>
          </div>
          <el-table :data="tableData">
            <el-table-column
              prop="hostip"
              label="主机IP"
            />
            <el-table-column
              prop="job_start"
              label="任务发起时间"
            />
            <el-table-column
              prop="job_end"
              label="任务结束时间"
            />
            <el-table-column
              prop="jobsta"
              label="任务执行状态"

            >
              <template slot-scope="scope">
                <el-tag :type="scope.row.jobsta | msgType">{{ scope.row.jobsta | msgTypeText }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="item">
          <div class="item-title">
            执行日志:
          </div>
          <pre v-html="stdout"/>

        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
// import ManagementService from '@/services/modules/management'

export default {
  filters: {
    msgType(state) {
      if (state === -1) {
        return 'danger'
      }
      if (state === 0) {
        return 'success'
      }
      if (state === 1) {
        return 'warning'
      }

      if (state === 2) {
        return 'warning'
      }
      return ''
    },
    msgTypeText(state) {
      if (state === -1) {
        return '失败'
      }
      if (state === 0) {
        return '成功'
      }
      if (state === 1) {
        return '正在执行'
      }

      if (state === 2) {
        return '等待'
      }
      return ''
    }
  },
  props: {
    id: {
      type: [String, Number],
      default: ''
    },

    showDetail: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      tableData: [],
      showDialog: false,
      stdout: ''

    }
  },
  beforeDestroy() {
    this.showDialog = false
  },

  created() {
    this.showDialog = this.showDetail
  },

  methods: {
    handleDetail() {
      /*ManagementService.getManagementDetail(this.id)
        .then((res) => {
          console.log(res)
          // this.tableData = res.data.results
        })
        .catch((err) => {
          this.$message.error(err.message)
        })*/
    },

    show(id) {
      // this.handleDetail();
      this.getMessage(id)
      this.showDialog = true
    },
    getMessage(id) {
      /*ManagementService.getMessages(id)
        .then(({ results: data }) => {
          console.log(data)
          this.tableData = [data]
          this.stdout = this.syntaxHighlight(data.args.stdout)
        })*/
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
    }
  }
}
</script>
<style lang="sass" scoped>
.detail
  &-content
    .item-title
      height: 45px
      line-height: 45px
      margin-bottom: 10px

    .textarea
      width: 100%
      height: 200px
      border: 1px solid #e6e6e6
      padding: 16px

</style>
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
