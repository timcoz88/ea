<template>
  <div v-loading="loading" class="page page-session-manage">
    <div class="common-page-title mt-10 mb-20">
      <div class="detail">
        <div class="detail-top">

          <div class="detail-title" style="padding-top: 30px">问题列表
            <el-button
              type="text"
              style="margin-left: 20px"
              @click="download">导出
            </el-button>
          </div>
          <el-table
            :data="tableData"
            border
            style="width: 100%"
          >
            <el-table-column
              v-for="(item, index) in tableHeaderData"
              :label="tableHeaderData[index]"
              :key="index"
              :prop="index+ ''"
            >
              <template slot-scope="{row}">
                {{ row[index] }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
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
  data() {
    return {
      detail: [],
      sql: {},
      statusMap,
      loading: false
    }
  },
  computed: {
    tableHeaderData() {
      return this.detail[0] || []
    },
    tableData() {
      const len = this.detail.length
      const detail = [...this.detail]
      if (len) {
        return detail.splice(1, len)
      }
      return []
    }
  },
  created() {
    this.getQueryDetail(this.$route.query)
  },
  methods: {
    getQueryDetail({id, hostip, dsn}) {
      this.loading = true
      repo.getQueryDetail(id, { hostip, dsn }).then(({ results: data }) => {
        this.detail = data.deatil
        this.sql = data.sql
      }, Function.prototype).then(() => {
        this.loading = false
      })
    },
    download() {
      import('@/vendor/Export2Excel').then(excel => {
        excel.export_json_to_excel({
          header: this.tableHeaderData, // 表头 必填
          data: this.tableData, // 具体数据 必填
          filename: '详情信息', // 非必填
          autoWidth: true, // 非必填
          bookType: 'xlsx' // 非必填
        })
      })
    }
  }
}
</script>

<style lang="sass" scoped>
  .detail
    padding: 0
    font-size: 14px
    line-height: 24px
    .card-content
      font-size: 14px
      height: 220px
      overflow-y: auto
      .card-content-item
        padding: 3px 0
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
