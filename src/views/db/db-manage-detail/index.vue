<template>
  <div class="db-manage-detail-page">
    <el-tabs v-model="componentName" type="card" @tab-click="handleClick">
      <el-tab-pane label="会话管理" name="sessionManage"/>
      <el-tab-pane label="SQL分析" name="sqlAnalyze"/>
      <el-tab-pane label="表对象管理" name="TableObjManage"/>
      <el-tab-pane label="用户管理" name="userManage"/>
      <el-tab-pane label="锁等待" name="lockWait"/>
      <el-tab-pane label="阻塞树分析" name="treeAnalyze"/>
    </el-tabs>

    <component :is="componentName"/>
  </div>

</template>
<script>
import sessionManage from './session-manage.vue'
import lockWait from './lock-wait.vue'
import TableObjManage from './table-obj-manage.vue'
import treeAnalyze from './tree-analyze.vue'
import sqlAnalyze from './sql-analyze.vue'
import UserManage from './user-manage.vue'
export default {
  components: {
    sessionManage,
    lockWait,
    treeAnalyze,
    TableObjManage,
    UserManage,
    sqlAnalyze
  },
  data() {
    return {
      componentName: 'sessionManage'
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>
<style lang="sass">
  .db-manage-detail-page
    padding: 20px
</style>
