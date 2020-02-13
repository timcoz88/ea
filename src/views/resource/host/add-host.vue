<template>
  <el-dialog title="新增服务器资源" :visible.sync="isShowDialog">
    <el-form ref="componentForm" :model="componentForm" :rules="componentFormRules">
      <el-form-item label="服务器ip" :label-width="formLabelWidth" prop="hostip">
        <el-input v-model="componentForm.hostip" placeholder="请输入服务器ip" autocomplete="off" style="width: 60%" />
      </el-form-item>
      <el-form-item label="端口" :label-width="formLabelWidth" prop="port">
        <el-input v-model="componentForm.port" placeholder="请输入端口号" autocomplete="off" style="width: 60%"/>
      </el-form-item>
      <el-form-item label="服务器类型" :label-width="formLabelWidth" prop="ostype">
        <el-select
          v-model="componentForm.ostype"
          placeholder="请选择服务器类型"
          style="width: 60%"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <!-- 用户 -->
      <el-form-item label=" ">
        <el-button icon="el-icon-plus"
                   type="primary"
                   @click="showAddUser"
                   style="margin-left: 120px;margin-bottom: 10px">新增用户</el-button>
        <el-table size="mini" style="width: 80%;margin-left: 120px" border :data="userList">
          <el-table-column align="center" label="用户名" prop="user" />
          <el-table-column align="center" label="密码" prop="password">
            ******
          </el-table-column>
          <el-table-column align="center" label="操作" width="180px">
            <template slot-scope="{ row,$index }">
              <el-button type="text" @click="editUser(row, $index)" size="mini">编辑</el-button>
              <el-button type="text" @click="delUser(row, $index)" size="mini">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <!-- 指向 -->
      <el-form-item label=" ">
        <el-button icon="el-icon-plus"
                   type="primary"
                   @click="showAddSu"
                   style="margin-left: 120px;margin-bottom: 10px">新增su</el-button>
        <el-table size="mini" style="width: 80%;margin-left: 120px" border :data="suList">
          <el-table-column align="center" label="指向" prop="pointTo" />
          <el-table-column align="center" label="指向" prop="bePointTo" />
          <el-table-column align="center" label="操作" width="180px">
            <template slot-scope="{ row,$index }">
              <el-button type="text" @click="editSu(row, $index)" size="mini">编辑</el-button>
              <el-button type="text" @click="delSu(row, $index)" size="mini">删除</el-button>
              <el-button type="text" @click="chooseSu(row, $index)" size="mini">
                {{ row.default === 'default' ? '已勾选' : '未勾选'}}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="hide">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </div>

    <el-dialog
      width="30%"
      title="新增用户"
      :visible.sync="isAppendDialog"
      append-to-body>
      <el-form ref="userForm" :model="userForm" :rules="userFormRules">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="user" >
          <el-input v-model="userForm.user" autocomplete="off" style="width: 60%" />
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
          <el-input v-model="userForm.password" type="password" autocomplete="off" style="width: 60%" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="isAppendDialog = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      width="30%"
      title="新增su"
      :visible.sync="isSuDialog"
      append-to-body>
      <el-form ref="suForm" :model="suForm" :rules="suFormRules">
        <el-form-item label="指向" :label-width="formLabelWidth" prop="pointTo" >
          <el-input v-model="suForm.pointTo" autocomplete="off" style="width: 60%" />
        </el-form-item>
        <el-form-item label="被指向" :label-width="formLabelWidth" prop="bePointTo">
          <el-input v-model="suForm.bePointTo" autocomplete="off" style="width: 60%" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="isSuDialog = false">取 消</el-button>
        <el-button type="primary" @click="addSu">确 定</el-button>
      </div>
    </el-dialog>
  </el-dialog>
</template>
<script>
import { postServiceHost } from '@/api/resource'

export default {
  data() {
    return {
      title: '',
      formLabelWidth: '120px',
      isShowDialog: false,
      componentForm: {
        hostip: '',
        port: '',
        ostype: ''
      },
      componentFormRules: {
        hostip: [{ required: true, message: '请输入服务器ip', trigger: 'blur' }],
        port: [{ required: true, message: '请输入端口号', trigger: 'blur' }],
        ostype: [{ required: true, message: '请选择服务器类型', trigger: 'change' }]
      },
      options: [{
        value: 'MYSQL',
        label: 'MYSQL'
      }, {
        value: 'ORACLE',
        label: 'ORACLE'
      }],
      shellOptions: [],
      index: 0,
      type: 0,
      isLoading: false,
      isAppendDialog: false,
      userList: [], // 用户列表
      userForm: {
        user: '',
        password: ''
      },
      userFormRules: {
        user: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      isSuDialog: false,
      suList: [], // 用户列表
      suForm: {
        pointTo: '',
        bePointTo: ''
      },
      suFormRules: {
        pointTo: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        bePointTo: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    addUser() {
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          const userForm = { ...this.userForm }
          this.userList.push(userForm)
          console.log(this.userList)
          this.isAppendDialog = false
        }
      })
    },
    delUser(row, index) {
      this.userList.splice(index, 1)
    },
    editUser(row, index) {
      this.isAppendDialog = true
      this.userForm = row
    },
    showAddUser() {
      this.isAppendDialog = true
      this.$nextTick(() => {
        this.$refs.userForm.resetFields()
      })
    },
    addSu() {
      this.$refs.suForm.validate((valid) => {
        if (valid) {
          const suForm = { ...this.suForm }
          this.suList.push(Object.assign({}, suForm, { default: 'undefault' }))
          this.isSuDialog = false
        }
      })
    },
    delSu(row, index) {
      this.suList.splice(index, 1)
    },
    editSu(row, index) {
      this.isSuDialog = true
      this.suForm = row
    },
    showAddSu() {
      this.isSuDialog = true
      this.$nextTick(() => {
        this.$refs.suForm.resetFields()
      })
    },
    chooseSu(row, index) {
      this.suList = this.suList.map((v, i) => {
        v.default = 'undefault'
        return v
      })

      this.suList[index].default = 'default'
      this.suList.splice()
    },
    // 1新增2编辑
    show(type, row) {
      this.isShowDialog = true

      if (type === 1) {
        this.$nextTick(() => {
          this.$refs.componentForm.resetFields()
        })

        this.suList = []
        this.userList = []
      } else if (type === 2) {
        this.componentForm = {
          hostip: row.hostip,
          port: row.port,
          ostype: row.ostype
        }

        this.userList = []
        this.suList = []
        row.osusers.forEach(v => {
          this.userList.push({ user: Object.keys(v)[0], password: Object.values(v)[0] })
        })

        row.su.forEach(v => {
          this.suList.push({ pointTo: v[0], bePointTo: v[1], default: v[2] })
        })
      }
    },
    hide() {
      this.isShowDialog = false
    },
    confirm() {
      this.$refs.componentForm.validate(valid => {
        if (valid) {
          if (!this.userList.length) {
            this.$message.error('请添加用户')
            return
          }

          if (!this.suList.length) {
            this.$message.error('请添加su')
            return
          }

          const osusers = []
          this.userList.forEach(v => {
            osusers.push({ [v.user]: v.password })
          })

          const su = []
          this.suList.forEach(v => {
            su.push([v.pointTo, v.bePointTo, v.default ? v.default : 'undefault'])
          })
          const params = {
            su,
            osusers,
            ...this.componentForm
          }
          postServiceHost(params)
            .then(res => {
              this.$message.success('添加成功')
              this.hide()
              this.$emit('confirm')
            })
        }
      })
    },
    changeCron(val) {
      this.componentForm.cron_value = val
    }
  }
}
</script>
