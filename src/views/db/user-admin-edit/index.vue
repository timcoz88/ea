<template>
  <div class="user-admin-edit-page">
    <div class="user-admin-item-title">用户名： {{ $route.query.username }}</div>
    <div class="user-admin-item-title">用户角色：<el-button
      type="text"
      @click="$refs.UserRoleEdit.show()">编辑</el-button> </div>
    <el-table :data="userRoles" style="width: 452px" border>
      <el-table-column
        prop="username"
        label="用户名"
        width="150"/>
      <el-table-column label="用户授予角色" prop="role"/>
    </el-table>
    <div class="user-admin-item-title">系统权限</div>
    <el-table :data="systemAdmin" style="width: 452px" border>
      <el-table-column label="用户名" width="150" prop="username"/>
      <el-table-column label="系统权限" prop="system_role"/>
    </el-table>
    <div class="user-admin-item-title">
      对象权限：<el-button
        type="text"
        @click="$refs.ObAdmin.show()">编辑</el-button></div>
    <el-table :data="objectList" border >
      <el-table-column label="用户名" prop="grantee"/>
      <el-table-column label="执行权限" prop="privilege"/>
      <el-table-column label="对象属主" prop="owner"/>
      <el-table-column label="对象名" prop="table_name"/>
    </el-table>

    <user-role-edit ref="UserRoleEdit" @reload="init"/>

    <ob-admin ref="ObAdmin" @reload="init"/>
  </div>
</template>
<script>
import ManagementService from '@/services/modules/management'
import UserRoleEdit from './user-role-edit.vue'
import ObAdmin from './OB-admin.vue'

export default {
  components: {
    UserRoleEdit,
    ObAdmin
  },
  data: () => ({
    isShowUserRole: false,
    userRoles: [],
    systemAdmin: [],
    objectList: []
  }),
  created() {
    this.init()
  },
  methods: {
    getUserAdminDetail() {
      ManagementService.getUserAdminDetail(this.$route.query)
        .then(({ results: data }) => {
          this.userRoles = data
        })
    },
    getSystemAdmin() {
      ManagementService.getSystemAdmin(this.$route.query)
        .then(({ results: data }) => {
          this.systemAdmin = data
        })
    },
    getObject() {
      ManagementService.getObject(this.$route.query)
        .then(({ results: data }) => {
          this.objectList = data
        })
    },
    init() {
      this.getUserAdminDetail()
      this.getSystemAdmin()
      this.getObject()
    }
  }
}
</script>
<style lang="sass">
  .user-admin-edit-page
    padding: 20px
    .user-admin-item-title
      padding: 10px 0
</style>
