<template>
  <div v-loading="loading" class="page sql-manage-detail">
    <div class="common-page-title mt-10 mb-20">
      <el-row :gutter="20" type="flex">
        <el-col>
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span class="common-page-title">基本信息</span>
            </div>
            <el-row class="card-content">
              <el-col :sm="24" :lg="12" class="card-content-item">用户名：{{ base_msg.OWNER }}</el-col>
              <el-col :sm="24" :lg="12" class="card-content-item">表名：{{ base_msg.TABLE_NAME }}</el-col>
              <el-col :sm="24" :lg="12" class="card-content-item">表状态：{{ base_msg.status }}</el-col>
              <el-col :sm="24" :lg="12" class="card-content-item">表空间：{{ base_msg.tablespace_name }}</el-col>
              <el-col :sm="24" :lg="12" class="card-content-item">行数（采样）：{{ base_msg.num_rows }}</el-col>
              <el-col :sm="24" :lg="12" class="card-content-item">表压缩：{{ base_msg.compression }}</el-col>
              <el-col :sm="24" :lg="12" class="card-content-item">是否CACHE：{{ base_msg.cache }}</el-col>
              <el-col :sm="24" :lg="12" class="card-content-item">是否分区表：{{ base_msg.PARTITIONED }}</el-col>
              <el-col :sm="24" :lg="12" class="card-content-item">并行度：{{ base_msg.DEGREE }}</el-col>
              <el-col :sm="24" :lg="12" class="card-content-item">BLOCKS（采样）：{{ base_msg.blocks_block1 }}</el-col>
              <el-col :sm="24" :lg="12" class="card-content-item">BLOCKS（物理）：{{ base_msg.BKS_block2 }}</el-col>
              <el-col :sm="24" :lg="12" class="card-content-item">SIZE_MB：{{ base_msg.SIZE_MB }}</el-col>
              <el-col :sm="24" :lg="12" class="card-content-item">创建时间：{{ base_msg.CREATED }}</el-col>
              <el-col :sm="24" :lg="12" class="card-content-item">上一次DDL时间：{{ base_msg.LAST_DDL_TIME }}</el-col>
              <el-col :sm="24" :lg="12" class="card-content-item">上一次分析时间：{{ base_msg.LAST_ANALYZED }}</el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="filter-container">
      <div class="common-page-title mt-10 mb-20">
        字段信息
      </div>
    </div>
    <div class="table-content">

      <div class="table-box">
        <el-table
          v-loading="loading"
          ref="remoteData"
          :data="column_mgs"
          border
          style="width: 100%"
        >
          <el-table-column
            label="序号"
            width="60px"
            prop="COLUMN_ID"
          />
          <el-table-column
            prop="COLUMN_NAME"
            label="字段名"
          />
          <el-table-column
            prop="DATA_TYPE"
            label="字段类型"
          />
          <el-table-column
            prop="DATA_LENGTH"
            label="字段长度"
          />
          <el-table-column
            prop="NULLABLE"
            label="是否可为空"
          />
          <el-table-column
            prop="NUM_NULLS"
            label="空值数目"
          />
          <el-table-column
            prop="NUM_DISTINCT"
            label="唯一值数目"
          />
          <el-table-column
            prop="DENSITY"
            label="密度Density"
          />
        </el-table>
      </div>
    </div>

    <div class="filter-container">
      <div class="common-page-title mt-10 mb-20">
        索引信息
      </div>
    </div>
    <div class="table-content">

      <div class="table-box">
        <el-table
          v-loading="loading"
          ref="remoteData"
          :data="index_msg"
          border
          style="width: 100%"
        >
          <el-table-column
            prop="index_name"
            label="索引名"
          />
          <el-table-column
            prop="index_type"
            label="索引类型"
          />
          <el-table-column
            prop="uniqueness"
            label="是否唯一约束"
          />
          <el-table-column
            prop="COLUMN_NAME"
            label="索引字段"
          />
          <el-table-column
            prop="COLUMN_POSITION"
            label="字段位置（组合索引）"
          />
          <el-table-column
            prop="tablespace_name"
            label="表空间"
          />
          <el-table-column
            prop="status"
            label="索引状态"
          />
          <el-table-column
            prop="partitioned"
            label="是否分区索引"

          />
          <el-table-column
            prop="last_analyzed"
            label="上一次分析时间"

          />
          <el-table-column
            prop="blevel"
            label="BLEVEL"

          />
          <el-table-column
            prop="degree"
            label="并行度"
          />
        </el-table>
      </div>
    </div>
    <div class="fixed-right-container">
      <el-button
        type="primary"
        @click="$router.push({name: 'tableAnalyzeDetail',
                              query: $route.query
      })">表分析</el-button>
    </div>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import ManagementService from '@/services/modules/management'

export default {
  components: {
    Pagination
  },

  data() {
    return {
      index_msg: [],
      column_mgs: [],
      page: 1,
      total: 0,
      loading: false,
      base_msg: {}
    }
  },
  computed: {
    nowFormatDate() {
      const date = new Date()
      const seperator1 = '-'
      const seperator2 = ':'
      let month = date.getMonth() + 1
      let strDate = date.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      const currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
        ' ' + date.getHours() + seperator2 + date.getMinutes() +
        seperator2 + date.getSeconds()
      console.log(currentdate)
      return currentdate
    }
  },

  created() {
    this.getSqlManageDetail(this.$route.query)
  },
  methods: {
    getSqlManageDetail(...arg) {
      ManagementService.getSqlManageDetail(...arg)
        .then(({ results: data }) => {
          this.base_msg = data.base_msg
          this.index_msg = data.index_msg
          this.column_mgs = data.column_mgs
          console.log(data)
        })
        .catch(() => {})
        .then(() => {

        })
    },
    getNowFormatDate() {
      const date = new Date()
      const seperator1 = '-'
      const seperator2 = ':'
      let month = date.getMonth() + 1
      let strDate = date.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      const currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
        ' ' + date.getHours() + seperator2 + date.getMinutes() +
        seperator2 + date.getSeconds()
      console.log(currentdate)
      return currentdate
    }
  }
}
</script>
<style lang="sass">
  .sql-manage-detail
    .box-card
      .el-card__header
        padding: 10px
      .card-content
        font-size: 14px

        .card-content-item
          padding: 3px 0
    .fixed-right-container
      position: fixed
      right: 10px
      bottom: 400px
      z-index: 999
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

</style>
