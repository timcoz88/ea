<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="事件详细信息"
  >
    <div class="detail">
      <table class="detail-table">
        <tr>
          <td>主机IP</td>
          <td>{{ reportDetail.hostip }}</td>
          <td>数据库名</td>
          <td>{{ reportDetail.dbnm }}</td>
        </tr>
        <tr>
          <td>实例名</td>
          <td>{{ reportDetail.hostnm }}</td>
          <td>巡检日期</td>
          <td>{{ reportDetail.rpt_tm | parseTime('{y}-{m}-{d} {h}:{i}')}}</td>
        </tr>
        <tr>
          <td>XML报告</td>
          <td colspan="3">
            <a
              v-if="reportDetail.xml_url"
              :href="`/v1/admin/download/${reportDetail.xml_url}?res=doc&&tm=${reportDetail.xml_url.split('.').find(v => Number.isInteger(+v))}`"
              target="_blank"
            >{{ reportDetail.xml_url }}</a>
          </td>
        </tr>
        <tr>
          <td>AWR报告</td>
          <td colspan="3">
            <a
              v-if="reportDetail.awr_url "
              :href="`/v1/admin/download/${reportDetail.awr_url}?res=doc&&tm=${reportDetail.awr_url.split('.').find(v => Number.isInteger(+v))}`"
              target="_blank"
            >{{ reportDetail.awr_url }}</a>
          </td>
        </tr>
        <tr>
          <td>TRC文件</td>
          <td colspan="3">
            <a
              v-if="reportDetail.trc_url"
              :href="`/v1/admin/download/${reportDetail.trc_url}?res=doc&&tm=${reportDetail.trc_url.split('.').find(v => Number.isInteger(+v))}`"
              target="_blank"
            >{{ reportDetail.trc_url }}</a>
          </td>
        </tr>
        <tr>
          <td>巡检报告</td>
          <td colspan="3">
            <a
              v-if="reportDetail.rpt_url"
              :href="`/v1/admin/download/${reportDetail.rpt_url}?res=doc&&tm=${reportDetail.rpt_url.split('.').find(v => Number.isInteger(+v))}`"
              target="_blank"
            >{{ reportDetail.rpt_url }}</a>
          </td>
        </tr>
      </table>
      <div class="score mt-10 mb-10">
        健康评分: <span>{{ reportDetail.score }}</span>
      </div>
      <div class="mb-10">问题小结:</div>
      <el-table
        :data="itemIssueList"
        border
        style="width: 100%"
      >
        <el-table-column
          prop="id"
          label="序号"
          width="50"
        />
        <el-table-column
          prop="lvl"
          label="问题级别"
          width="100"
        />
        <el-table-column
          prop="desc"
          label="问题描述及建议"
        />
      </el-table>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    reportDetail: {
      type: [Object],
      default: () => {},
      required: true
    }
  },

  data() {
    return {
      dialogVisible: false
    }
  },
  computed: {
    itemIssueList() {
      return Array.from(this.reportDetail.issue) || []
    }
  },
  methods: {
    show() {
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="sass" scoped>
.score span
  font-size: 18px
  font-weight: bold

.detail-table
  width: 100%
  border-collapse: collapse
  color: #606266

  td
    padding: 10px
    border: 1px solid #ccc

    &:nth-child(2n - 1)
      font-weight: bold

  a
    color: #6a6aee
</style>
