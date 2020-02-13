<template>
  <el-dialog
    :visible.sync="dialogVisible"
    class="dark-small"
  >

    <div class="detail">
      <div class="detail-top">
        <div class="detail-title">事件详细信息</div>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-card :body-style="{padding:'10px'}">
              <div class="card-content">
                <div class="card-content-item">系统级别：{{ data.db && data.db.dblvl }}</div>
                <div class="card-content-item">数据库名：{{ data.db && data.db.dbnm }}</div>
                <div class="card-content-item">数据库说明：{{ data.db && data.db.dbinfo }}</div>
                <div class="card-content-item">主机地址：{{ data.db && data.db.hostip }}</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="16">
            <el-card :body-style="{padding:'10px'}">
              <div class="card-content">
                <div class="card-content-item">预警级别：{{ data.msglvl }}</div>
                <div class="card-content-item">预警时间：{{ data.msgtm }}</div>
                <div class="card-content-item">预警事件：{{ data.monnm }}</div>
                <div class="card-content-item">事件状态：{{ statusMap[data.msgstat] }}</div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <div class="detail-title" style="padding-top: 30px">问题列表</div>
        <el-table
          :data="data.msgdata"
          border
          style="width: 100%"
        >
          <el-table-column
            label="用户名"
          >
            <template slot-scope="scope">
              {{ scope.row[0] }}
            </template>
          </el-table-column>
          <el-table-column
            label="对象名"
          >
            <template slot-scope="scope">
              {{ scope.row[1] }}
            </template>
          </el-table-column>
          <el-table-column
            label="检查结果"
          >
            <template slot-scope="scope">

              <div v-for="(item, index) in scope.row" :key="index">
                <template v-if="index > 1">
                  {{ item }}
                </template>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="detail-title" style="padding-top: 30px">分析及建议</div>
        <div class="detail-recommand">
          <el-input
            v-model="data.recommand "
            autosize
            disabled
            readonly
            type="textarea"
            placeholder="分析建议"
          />
        </div>

        <div class="detail-title" style="padding-top: 30px">处理结果</div>
        <div class="textarea">
          <el-input
            v-model="data.opresult"
            autosize
            type="textarea"
            placeholder="请填写处理结果"
          />
        </div>

        <!--<div class="detail-cell">
          <span class="detail-cell-title">预警时间:</span>
          <span class="detail-cell-value">{{ data.msgtm }}</span>
        </div>
        <div class="detail-cell">
          <span class="detail-cell-title">数据库名:</span>
          <span class="detail-cell-value">{{ data.dsn }}</span>
        </div>
        <div class="detail-cell">
          <span class="detail-cell-title">事件级别:</span>
          <span class="detail-cell-value">{{ data.msglvl }}</span>
        </div>
        <div class="detail-cell">
          <span class="detail-cell-title">主机地址:</span>
          <span class="detail-cell-value">{{ data.hostip }}</span>
        </div>
        <div class="detail-cell">
          <span class="detail-cell-title">事件内容:</span>
          <span class="detail-cell-value">{{ data.msgdata }}</span>
        </div>-->
      </div>
      <!-- <div class="detail-cell textarea">
        <span class="detail-cell-title">解决建议:</span>
        <span class="detail-cell-value"></span>
      </div>
      <div class="detail-cell textarea">
        <span class="detail-cell-title">处理结果:</span>
        <span class="detail-cell-value">

        </span>
      </div>-->
      <div class="mt-10 mb-10 text-right">
        <el-button
          size="mini"
          type="primary"
          @click="analysisWarning(1)"
        >待处理</el-button>
        <el-button
          size="mini"
          type="success"
          @click="analysisWarning(2)"
        >已处理</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="overlook"
        >忽略</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import repo from '@/services/modules/fault'

const statusMap = {
  0: 'NEW',
  1: '待处理',
  2: '已处理',
  3: '忽略'
}
export default {
  props: {
    data: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      dialogVisible: false,
      statusMap
    }
  },

  methods: {
    show() {
      this.dialogVisible = true
    },
    overlook() {
      this.$confirm('您确认要忽略吗').then(() => {
        this.analysisWarning(3)
      })
    },
    analysisWarning(msgstat) {
      const { id, opresult } = this.data
      repo.analysisWarning({
        id,
        opresult,
        msgstat
      }).then(() => {
        this.$emit('refresh')
        this.$message.success('成功')
        this.dialogVisible = false
      }, Function.prototype).then(() => {
      })
    }
  }
}
</script>

<style lang="sass">
.dark-small
  .el-dialog
    width: 750px
    background: #282A2B
    border-radius: 2px
  .el-card
    background: #414143
    min-height: 125px
    color: #fff
  .el-dialog__title
    color: #fff

  .detail-recommand
    textarea
      background-color: #414143!important
      color: #fff
  .textarea
    textarea
      height: 120px
      background-color: #414143
      color: #fff

  .card-content
    font-size: 14px
    .card-content-item
      padding: 3px 0
</style>

<style lang="sass" scoped>
.detail
  padding: 0
  color: #fff
  font-size: 14px

  &-title
    margin-bottom: 20px
    font-size: 18px

  &-cell
    padding: 10px 0

    &-title
      display: inline-block
      margin-right: 44px
      text-align: right
      vertical-align: middle

    &-value
      display: inline-block
      max-width: 262px
      vertical-align: middle
</style>
