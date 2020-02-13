<!-- 阻塞树分析 -->
<template>
  <div class="page page-session-manage">
    <div class="filter-container">
      <div class="common-page-title mt-10 mb-20">
        选择需要固定的执行计划
      </div>
      <div class="filter-box">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-button-group>
              <el-button :disabled="radio === ''" type="primary" @click="immediateStop('confirm')">提交执行固话</el-button>
            </el-button-group>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="table-content">

      <div class="table-box">
        <el-table
          v-loading="loading"
          ref="remoteData"
          :data="tableData"
          border
          highlight-current-row
          @row-click = "showRow"
          @selection-change="handleSelectionChange"
        >
          <el-table-column label="选择" width="70" header-align="center" align="center">
            <template slot-scope="scope">
              <el-radio v-model="radio" :label="scope.$index" class="radio">&nbsp;</el-radio>
            </template>
          </el-table-column>
          <el-table-column
            width="180"
            prop="PLAN_HASH_VALUE"
            label="PLAN_HASH"
          />
          <el-table-column
            prop="AVG_ET_SECS"
            width="180"
            label="平均单次执行时间（秒）"
          />
        </el-table>
      </div>
    </div>
    <!--  -->
    <div class="filter-container">
      <div class="common-page-title mt-10 mb-20" style="margin-top: 20px">
        已固定的执行计划
      </div>
      <div class="filter-box">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-button-group>
              <el-button :disabled="radioSec === ''" type="primary" @click="immediateStop('cancel')">取消固化执行</el-button>
            </el-button-group>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="table-content">

      <div class="table-box">
        <el-table
          v-loading="loading"
          ref="remoteData"
          :data="tableDataSec"
          border
          highlight-current-row
          @row-click = "showRowSec"
          @selection-change="handleSelectionChange"
        >
          <el-table-column label="选择" width="70" header-align="center" align="center">
            <template slot-scope="scope">
              <el-radio v-model="radioSec" :label="scope.$index" class="radio">&nbsp;</el-radio>
            </template>
          </el-table-column>
          <el-table-column
            prop="NAME"
            label="NAME"
          />
          <el-table-column
            prop="CREATED"
            label="CREATED"
          />
          <el-table-column
            prop="LAST_MODIFIED"
            width="180"
            label="last_modified"
          />
          <el-table-column
            prop="TYPE"
            width="180"
            label="TYPE"
          />
          <el-table-column
            prop="STATUS"
            width="180"
            label="STATUS"
          />
          <el-table-column
            prop="FORCE_MATCHING"
            label="FORCE_MATCHING"
          />
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import ManagementService from '@/services/modules/management'

export default {
  data() {
    return {
      filter: {},
      tableData: [],
      multipleSelection: [],
      loading: false,
      currentData: {},
      currentRow: {},
      radio: '',
      // 2
      tableDataSec: [],
      currentRowSec: {},
      radioSec: ''
    }
  },

  created() {
    this.getFixPlanDetail()
    this.getFixCuringPlanDetail()
  },
  methods: {
    getFixPlanDetail() {
      ManagementService.getFixPlanDetail(this.$route.query)
        .then(({ results = [] }) => {
          this.tableData = results
        })
    },
    getFixCuringPlanDetail() {
      ManagementService.getFixCuringPlanDetail(this.$route.query)
        .then(({ results = [] }) => {
          this.tableDataSec = results
        })
    },
    showRow(row) {
      this.radio = this.tableData.indexOf(row)
      this.currentRow = row
    },
    showRowSec(row) {
      this.radioSec = this.tableDataSec.indexOf(row)
      this.currentRowSec = row
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    immediateStop(type) {
      const text = type === 'confirm' ? '是否确认执行固定操作' : '是否确认取消固定计划'
      this.$confirm(text, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (type === 'confirm') {
          // 执行
          this.confirm()
        } else {
          // 取消
          this.cancel()
        }
      }).catch(() => {

      })
    },
    cancel() {
      ManagementService.cancelSqlPlan({
        hostip: this.$route.query.hostip,
        name: this.currentRowSec.NAME
      })
        .then(() => {
          this.$message.success('操作成功')
          this.getFixPlanDetail()
          this.getFixCuringPlanDetail()
        })
    },
    confirm() {
      console.log(this.currentRow)
      ManagementService.confirmSqlPlan({
        hostip: this.$route.query.hostip,
        SQL_ID: this.$route.query.sql_id,
        PLAN_HASH: this.currentRow.PLAN_HASH_VALUE
      })
        .then(() => {
          this.$message.success('操作成功')
          this.getFixPlanDetail()
          this.getFixCuringPlanDetail()
        })
    }
  }
}
</script>
<style lang="sass">
  .page-session-manage
    .box-card
      .el-card__header
        padding: 10px
      .card-content
        font-size: 14px
        .card-content-item
          padding: 3px 0
</style>
<style lang="sass" scoped>
  .page
    padding: 20px
    .filter-header
      margin: 20px 0
      line-heght: 24px

    .filter-box
      display: flex
      align-items: center

    .table-content

      .table-header

        .title
          margin: 38px 0 20px 0
          line-heght: 24px

        .header-box
          display: flex
          justify-content: space-between

          .choice-btn
            border: 1px solid #DCDFE6
            width: 136px
            height: 36px
            line-heght: 36px
            margin-bottom: 11.5px
            display: flex
            align-items: center
            border-radius: 5px

            .btn
              padding: 0 15px
              font-size: 14px
              color: #C0C4CC

            .active
              color: #5E6166

            .btn-all
              border-right: 1px solid #DCDFE6

          .search-box
            flex: 1
            text-align: right

            .search-btn
              margin-right: 10px
              margin-left: 0
              padding: 10px 19px

      .table-box

        .operate
          display: flex
          align-items: center

          .btn
            margin-left: 6px
            padding: 7px 12px

    .default-label
      border-radius: 4px
      font-size: 14px
      letter-spacing: 0
      text-align: center
      line-height: 28px
      width: 82px
      height: 28px

      .success
        background: #EFF9EB
        border: 1px solid #D3EEC7
        color: #4CBB4F

      .fail
        background: #FEF0F0
        border: 1px solid #FCD5D5
        color: #F66C80

      .pending
        background: #F0F9FE
        border: 1px solid #D5E7FC
        color: #409EFF

</style>
