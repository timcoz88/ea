<template>
  <el-dialog
    :visible.sync="showDialog"
    title="查看日志"
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
          <el-table :data="jobs">
            <el-table-column
              prop="createuser"
              label="创建人"
            />
            <el-table-column
              prop="created"
              label="创建时间"
            />
            <el-table-column
              prop="resnm"
              label="调用程序名称"
            />
            <el-table-column
              prop="taskstm"
              label="作业发起时间"
            />
            <el-table-column
              prop="tasketm"
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
          <el-table :data="task">
            <el-table-column
              prop="hostip"
              label="主机IP"
            />
            <el-table-column
              prop="taskstm"
              label="任务发起时间"
            />
            <el-table-column
              prop="tasketm"
              label="任务结束时间"
            />
            <el-table-column
              prop="statusText"
              label="任务执行状态"
            />
          </el-table>
        </div>
        <div class="item">
          <div class="item-title">
            执行日志:
          </div>
          <ul ref="elTimeline" class="el-timeline" style="max-height: 200px; overflow-y: auto">
            <timeline-item
              v-for="(item, index) in eventData"
              :key="index"
              :icon="index < (eventData.length -1) ? 'el-icon-check' : ''"
              :color="index === (eventData.length -1) ? '#0bbd87': ''"
              :timestamp="item.time"
            >
              {{ item.desc }}
            </timeline-item>
          </ul>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import ManagementService from '@/services/modules/management'
import TimelineItem from './timeline.vue'

const statusMap = {
  0: '空闲',
  11: '成功',
  14: '失败',
  10: '进行中'
}
export default {
  components: {
    TimelineItem
  },
  props: {
    item: {
      type: Object,
      default: () => {}
    },

    showDetail: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showDialog: false,
      tasklog: '',
      jobs: [],
      task: [],
      timer: null,
      eventData: []
    }
  },
  computed: {
    itemId() {
      return this.item.hostip
    }
  },
  watch: {
    itemId() {
      const { createuser, created, resnm, taskstm, tasketm, hostip, tasksta } = this.item
      this.jobs = [{
        createuser,
        created,
        resnm,
        taskstm,
        tasketm
      }]
      const statusText = statusMap[tasksta]
      this.task = [{
        taskstm,
        tasketm,
        hostip,
        statusText
      }]
    },
    showDialog(val) {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      if (val) {
        this.getAdminEvent()
      }
    }
  },
  beforeDestroy() {
    this.showDialog = false
    clearTimeout(this.timer)
  },

  created() {
    this.showDialog = this.showDetail
  },

  methods: {
    getAdminEvent() {
      ManagementService.getAdminEvent({hostip: this.item.hostip})
        .then(({ results: data }) => {
          this.eventData = (data || [])
          this.$nextTick(() => {
            this.$refs.elTimeline.scrollTop = this.$refs.elTimeline.scrollHeight
          })
          this.timer = setTimeout(() => {
            this.getAdminEvent()
          }, 500)
        })
    },
    handleDetail() {
      ManagementService.getManagementDetail(this.id)
        .then((res) => {
          console.log(res)
          this.tableData = res.data.results
        })
        .catch((err) => {
          this.$message.error(err.message)
        })
    },

    show() {
      // this.handleDetail();
      this.showDialog = true
    }
  }
}
</script>
<style lang="sass">
.el-timeline
  margin: 0
  font-size: 14px
  list-style: none

.el-timeline .el-timeline-item:last-child .el-timeline-item__tail
  display: none
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
