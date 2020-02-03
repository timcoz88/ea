<template>
  <el-dialog
    :visible.sync="dialogFormVisible"
    :title="title"
    width="600px"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      style="width: 500px"
    >
      <el-form-item
        :label-width="formLabelWidth"
        label="用户名"
        prop="username"
      >
        <el-input
          v-model="form.username"
          :disabled="type === 'editor'"
          auto-complete="off"
        />
      </el-form-item>
      <el-form-item
        :label-width="formLabelWidth"
        label="输入口令"
        prop="password"
      >
        <el-input
          v-model="form.password"
          type="password"
          auto-complete="off"
        />
      </el-form-item>
      <el-form-item
        :label-width="formLabelWidth"
        label="确认口令"
        prop="checkPass"
      >
        <el-input
          v-model="form.checkPass"
          type="password"
          auto-complete="off"
        />
      </el-form-item>
      <el-form-item
        :label-width="formLabelWidth"
        label="概要文件"
        prop="profile"
      >
        <el-select
          v-model="form.profile"
          placeholder="概要文件"
        >
          <el-option
            v-for="(item, index) in profileList"
            :key="index"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        :label-width="formLabelWidth"
        label="默认表空间"
        prop="tablespace"
      >
        <el-select
          v-model="form.tablespace"
          placeholder="默认表空间"
        >
          <el-option
            v-for="(item, index) in tablespaceList"
            :key="index"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        :label-width="formLabelWidth"
        label="临时表空间"
        prop="tablespace_once"
      >
        <el-select
          v-model="form.tablespace_once"
          placeholder="临时表空间"
        >
          <el-option
            v-for="(item, index) in tablespace_onceList"
            :key="index"
            :value="item"
          />
        </el-select>
      </el-form-item>
    </el-form>

    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="cancel">取消</el-button>
      <el-button
        :loading="loading"
        type="primary"
        @click="submit"
      >确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import ManagementService from '@/services/modules/management'

export default {
  name: 'UserManage',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    userInfo: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入口令'))
      } else {
        if (this.form.checkPass !== '') {
          this.$refs.form.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入口令'))
      } else if (value !== this.form.password) {
        callback(new Error('两次输入口令不一致!'))
      } else {
        callback()
      }
    }
    return {
      dialogFormVisible: false,
      form: {},
      formLabelWidth: '120px',
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ],
        profile: [
          { required: true, message: '请选择概要文件', trigger: 'change' }
        ],
        tablespace: [
          { required: true, message: '请选择默认表空间', trigger: 'change' }
        ],
        tablespace_once: [
          { required: true, message: '请选择临时表空间', trigger: 'change' }
        ]
      },
      profileList: [],
      tablespaceList: [],
      tablespace_onceList: [],
      loading: false,
      title: '新增用户',
      type: 'new'
    }
  },

  computed: {
    isChange() {
      return Object.keys(this.userInfo).length > 0
    }
  },

  created() {
  },
  methods: {
    getProfile() {
      ManagementService.getProfile({ 'hostip': this.$route.query.hostip, dsn: this.$route.query.dsn })
        .then(({ results: data }) => {
          this.profileList = data || []
        })
    },
    getTablespace() {
      ManagementService.getTablespace({ 'hostip': this.$route.query.hostip, dsn: this.$route.query.dsn  })
        .then(({ results: data }) => {
          this.tablespaceList = data || []
        })
    },
    getOnece() {
      ManagementService.getOnece({ 'hostip': this.$route.query.hostip, dsn: this.$route.query.dsn  })
        .then(({ results: data }) => {
          this.tablespace_onceList = data || []
        })
    },
    cancel() {
      this.dialogFormVisible = false
      this.resetForm()
    },
    addUser() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const params = Object.assign({ 'hostip': this.$route.query.hostip, dsn: this.$route.query.dsn  }, this.form)
          ManagementService.addUser(params)
            .then(({ results: data }) => {
              this.$message.success('添加成功')
              this.dialogFormVisible = false
              this.$emit('success')
              this.resetForm()
            })
        }
      })
    },
    editorUser() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const params = Object.assign({ 'hostip': this.$route.query.hostip,  dsn: this.$route.query.dsn  }, this.form)
          ManagementService.editorUser(params)
            .then(({ results: data }) => {
              this.$message.success('修改成功')
              this.dialogFormVisible = false
              this.$emit('success')
            })
        }
      })
    },
    submit() {
      if (this.type === 'new') {
        this.addUser()
      } else if (this.type === 'editor') {
        this.editorUser()
      }
    },
    show(item, type = 'new') {
      this.getProfile()
      this.getTablespace()
      this.getOnece()
      this.type = type
      if (type === 'editor') {
        this.title = '用户修改'
      } else {
        this.title = '新增用户'
      }

      this.dialogFormVisible = true

      if (type === 'editor') {
        this.form = {
          username: item.USERNAME,
          profile: item.PROFILE,
          tablespace: item.DEFAULT_TABLESPACE,
          tablespace_once: item.TEMPORARY_TABLESPACE
        }
      }
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
