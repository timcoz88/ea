<template>
  <div v-loading.fullscreen.lock="fullscreenLoading" class="sql-plan-detail">
    <div class="sql-plan-title">
      SQL_ID：{{ $route.query.sql_id }}
    </div>
    <div class="sql-plan-detail-module">
      <div class="sql-plan-title">
        SQL_TEXT
      </div>
      <div class="content">
        <div v-for="item in detail.sqlText" :key="item" class="pre">
          {{ item }}
        </div>
      </div>
    </div>
    <div class="sql-plan-detail-module">
      <div class="sql-plan-title">
        Current Execution Plans (last execution）
      </div>
      <div class="content">
        <div
          v-for="(plan, i) in plan_1"
          :key="i"
          class="pre"
        >
          <div v-for="(v, vi) in plan" :key="vi">{{ v }}</div>
        </div>
      </div>
    </div>
    <div class="sql-plan-detail-module">
      <div class="sql-plan-title">
        Current Execution Plans (all executions)
      </div>
      <div class="content">
        <div
          v-for="(plan, i) in plan_2"
          :key="i"
          class="pre"
        >
          <div v-for="(v, vi) in plan" :key="vi">{{ v }}</div>
        </div>
      </div>
    </div>
    <div class="sql-plan-detail-module">
      <div class="sql-plan-title">
        Historical Execution Plans
      </div>
      <div class="content">
        <div
          v-for="(plan, i) in plan_3"
          :key="i"
          class="pre"
        >
          <div v-for="(v, vi) in plan" :key="vi">{{ v }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ManagementService from '@/services/modules/management'
export default {
  data: () => ({
    detail: {},
    plan_1: [],
    plan_2: [],
    plan_3: [],
    fullscreenLoading: false
  }),
  created() {
    this.getSqlPlanDetail()
  },
  methods: {
    getSqlPlanDetail() {
      this.fullscreenLoading = true
      ManagementService.getSqlPlanDetail(this.$route.query)
        .then(({ results = {}}) => {
          this.detail = results
          const { plan_1 = [], plan_2 = [], plan_3 = [] } = results.sqlPlan
          this.plan_1 = plan_1
          this.plan_2 = plan_2
          this.plan_3 = plan_3
        })
        .finally(() => {
          this.fullscreenLoading = false
        })
    }
  }
}
</script>
<style lang="sass">
  .sql-plan-detail
    padding: 20px
    /* for code */
    .pre
      font: 12px Monaco,"Courier New",Courier,monospace
      line-height: 28px
      white-space: pre-wrap!important
      word-wrap: break-word!important
      *white-space: normal!important
    .content
      border: 1px solid #f0dacf
      padding: 5px 10px
    .sql-plan-title
      padding: 10px 0
      color: #EB4339
      font-size: 18px
</style>
