<template>
  <el-dialog
    :visible.sync="dialogFormVisible"
    :title="title"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
    >
      <el-form-item
        :label-width="formLabelWidth"
        label=""
      >
        <el-radio v-model="type" label="1">授予GRANT</el-radio>
        <el-radio v-model="type" label="2">回收REVOKE</el-radio>
      </el-form-item>

      <el-form-item
        :label-width="formLabelWidth"
        label="输入对象权限"
        prop="role"
      >
        <el-input
          v-model="form.sql "
          placeholder="请输入对象权限"
        />
      </el-form-item>
    </el-form>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="dialogFormVisible = false">取消</el-button>
      <el-button
        :loading="loading"
        type="primary"
        @click="handleSubmitClick"
      >确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import ManagementService from '@/services/modules/management'

export default {
  name: 'ObAdmin',
  data() {
    return {
      dialogFormVisible: false,
      form: {},
      formLabelWidth: '120px',
      rules: {},
      roles: [],
      loading: false,
      title: '对象权限',
      type: '1'
    }
  },

  created() {
    // this.getRoles()
  },
  methods: {
    getRoles() {
      ManagementService.getRolesList(this.$route.query).then(({ results: data }) => {
        console.log(data)
        this.roles = data.map(v => {
          return {
            value: v,
            label: v
          }
        })
      })
    },
    show() {
      this.dialogFormVisible = true
    },
    resetForm() {
      this.$refs.form.resetFields()
    },
    validateForm() {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate((valid) => {
          if (!valid) {
            return reject()
          }
          resolve(this.form)
        })
      })
    },
    userGrant() {
      ManagementService.objectGrant({ ...this.$route.query, ...this.form })
        .then(() => {
          this.$message.success('操作成功')
          this.dialogFormVisible = false
          this.$emit('reload')
        })
    },
    userRevoke() {
      ManagementService.objectRevoke({ ...this.$route.query, ...this.form })
        .then(() => {
          this.$message.success('操作成功')
          this.dialogFormVisible = false
          this.$emit('reload')
        })
    },
    handleSubmitClick() {
      if (this.type === '1') {
        this.userGrant()
      } else {
        this.userRevoke()
      }
    }
  }
}
</script>

<style lang="sass" scoped>
  /deep/
  .el-form-item__label
    font-size: 16px

    .el-dialog__body
      padding-left: 60px
      padding-right: 60px

    .el-dialog__header
      padding-top: 40px
      padding-left: 60px
      padding-right: 60px

    .el-form-item__label
      font-weight: normal
      text-align: left
</style>
