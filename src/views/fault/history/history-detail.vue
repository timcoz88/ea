<template>
  <div class="history-detail">
    <div class="detail-header">
      <el-button
        type="default"
        size="small"
        class="btn"
        @click="goback()"
      >
        返回上一级
      </el-button>
    </div>
    <div class="table-content">
      <div class="table-box">
        <el-table
          :data="tableData"
          border
          style="width: 100%"
        >
          <el-table-column
            prop="id"
            label="序号"
          />
          <el-table-column
            prop="target"
            label="级别"
          />
          <el-table-column
            prop="target"
            label="目标"
          />
          <el-table-column
            prop="event"
            label="事件"
          />
          <el-table-column
            prop="time"
            label="预警时间"
          >
            <template slot-scope="{row}">
              <span>{{ row.time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="time"
            label="状态"
          />
          <el-table-column
            prop="time"
            label="操作人"
          />
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    goback() {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="sass" scoped>

</style>
