<template>
  <el-dialog
    :title="title"
    :visible.sync="isShowDialog"
  >
    <el-form
      ref="componentForm"
      :model="componentForm"
      :rules="componentFormRules"
      label-position="left"
      label-width="120px"
    >
      <el-form-item label="数据库名" prop="dbnm">
        <el-input v-model="componentForm.dbnm" style="width: 60%" placeholder="请输入数据库名" />
      </el-form-item>
      <el-form-item label="数据库ip" prop="hostip">
        <el-input v-model="componentForm.hostip" style="width: 60%" placeholder="请输入数据库ip" />
      </el-form-item>
      <el-form-item label="端口" prop="dbport">
        <el-input v-model="componentForm.dbport" style="width: 60%" placeholder="请输入端口" />
      </el-form-item>
      <el-form-item label="数据库服务名" prop="dsn">
        <el-input v-model="componentForm.dsn" style="width: 60%" placeholder="请输入数据库服务名" />
      </el-form-item>
      <el-form-item label="类型" prop="dbtype">
        <el-input v-model="componentForm.dbtype" style="width: 60%" placeholder="请输入类型" />
      </el-form-item>
      <el-form-item label="登录名" prop="dbuser">
        <el-input v-model="componentForm.dbuser" style="width: 60%" placeholder="请输入登录名" />
      </el-form-item>
      <el-form-item label="数据库架构" prop="clflag">
        <el-input v-model="componentForm.clflag" style="width: 60%" placeholder="请输入数据库架构" />
      </el-form-item>
      <el-form-item label="数据库版本" prop="dbver">
        <el-input v-model="componentForm.dbver" style="width: 60%" placeholder="请输入数据库版本" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="componentForm.status" style="width: 60%">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="isShowDialog = false">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
// 局部引入
export default {
  data() {
    return {
      title: '',
      isShowDialog: false,
      cronPopover: false,
      componentForm: {
        status: 0,
        dbnm: '',
        hostip: '',
        dbport: '',
        dsn: '',
        dbtypeL: '',
        dbuser: '',
        clflag: '',
        dbver: ''
      },
      componentFormRules: {
        dbnm: [{ required: true, message: '请输入数据库名', trigger: 'blur' }],
        hostip: [{ required: true, message: '请输入数据库ip', trigger: 'blur' }],
        dbport: [{ required: true, message: '请输入端口', trigger: 'blur' }],
        dsn: [{ required: true, message: '请输入数据库服务名', trigger: 'blur' }],
        dbtype: [{ required: true, message: '请输入类型', trigger: 'blur' }],
        dbuser: [{ required: true, message: '请输入登录名', trigger: 'blur' }],
        clflag: [{ required: true, message: '请输入数据库架构', trigger: 'blur' }],
        dbver: [{ required: true, message: '请输入数据库版本', trigger: 'blur' }],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }]
      },
      options: [{
        value: 0,
        label: '在用'
      }, {
        value: 1,
        label: '失效'
      }],
      index: 0,
      type: 0
    }
  },
  methods: {
    /**
     *
     * @param type 1新增 2 编辑
     */
    show(type, { id, status, dbnm, hostip, dbport, dsn, dbtype, dbuser, clflag, dbver }, index) {
      this.isShowDialog = true

      this.title = type === 1 ? '新增数据库资源' : '编辑数据库资源'
      this.type = type

      if (type === 1) {
        this.$nextTick(() => {
          this.$refs.componentForm.resetFields()
        })
      } else {
        this.index = index
        this.componentForm = {
          status,
          id,
          dbnm,
          hostip,
          dbport,
          dsn,
          dbtype,
          dbuser,
          clflag,
          dbver
        }
      }
    },
    confirm() {
      this.$refs.componentForm.validate(valid => {
        if (valid) {
          console.log(this.componentForm)
          this.$emit('confirm', this.type, this.componentForm, this.index)
        }
      })
    },
    changeCron(val) {
      this.componentForm.cron_value = val
    }
  }
}
</script>
