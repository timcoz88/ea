<template>
  <el-card style="margin: 20px">
    <el-form ref="form" :model="form">
      <el-row>
        <el-col :span="6">
          <el-form-item label="任务ID" label-width="100px" label-position="left">
            <el-input v-model="form.taskid" placeholder="请输入任务ID" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="节点数" style="margin-left:10px;" label-width="80px" label-position="center">
            <el-select v-model="form.node_count" style="width:80%;" @change="numChange">
              <el-option
                v-for="item in numList"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <div class="df2">
            <el-form-item label="主库" label-width="100px" label-position="left" />
            <div class="df2" style="width:100%;border:1px solid #DCDFE6;height: 50px;padding: 5px;">
              <el-form-item label="host" label-position="center" label-width="50px" style="width:45%;">
                <el-input v-model="form.primary_node.host" placeholder="请输入host" style="width:100%;" />
              </el-form-item>
              <el-form-item label="data目录" style="width:50%;" label-width="100px">
                <el-input v-model="form.primary_node.data_directory" placeholder="请输入data目录" style="width:100%;" />
              </el-form-item>
            </div>
          </div>
        </el-col>
      </el-row>
      <div v-for="(item,key) in form.slave_nodes" :key="key">
        <el-row>
          <el-col :span="11">
            <div class="df2">
              <el-form-item label="从库" label-width="100px" label-position="left" />
              <div class="df2" style="width:100%;border:1px solid #DCDFE6;height: 50px;padding: 5px;">
                <el-form-item label="host" label-position="center" label-width="50px" style="width:45%;">
                  <el-input v-model="item.host" placeholder="请输入host" style="width:100%;" />
                </el-form-item>
                <el-form-item label="data目录" style="width:50%;" label-width="100px">
                  <el-input v-model="item.data_directory" placeholder="请输入data目录" style="width:100%;" />
                </el-form-item>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <el-row>
        <el-col :span="6">
          <el-form-item label="用户名" label-width="100px" label-position="left">
            <el-input v-model="form.username" placeholder="请输入用户名" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="密码" style="margin-left:10px;" label-width="80px" label-position="center">
            <el-input v-model="form.password" placeholder="请输入密码" style="width:80%;" show-password />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="数据库root用户密码" label-width="180px" label-position="left">
        <el-input v-model="form.dbrootpwd" placeholder="请输入root密码" style="width:40%;" show-password />
      </el-form-item>
      <el-form-item label="my.cnf文件上传" label-width="140px" label-position="left">
        <el-upload
          class="upload-demo"
          :limit="1"
          action
          :http-request="uploadform"
          :on-remove="uploadMove"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button @click="callbackBtn">返回</el-button>
        <el-button @click="save">保存任务</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
import { operationSave, operationDetail, upLoad } from '@/api/operation'
export default {
  name: 'AutoOper',
  data() {
    return {
      numList: [2, 3, 4, 5, 6, 7, 8, 9],
      form: {
        taskid: localStorage.getItem('username') + '_' + new Date().getTime(),
        node_count: 2,
        primary_node: {
          host: '',
          data_directory: '/data/mysql'
        },
        slave_nodes: [{
          host: '',
          data_directory: '/data/mysql'
        }, {
          host: '',
          data_directory: '/data/mysql'
        }],
        username: '',
        password: '',
        dbrootpwd: ''
      },
    }
  },
  created() {
    if (this.$route.query.taskid) {
      this.getDetail()
    }
  },
  methods: {
    uploadMove(){
      this.form.dbconfigfile = ''
    },
    uploadform(file) {
      const formData = new FormData()
      formData.append('file', file.file),
      upLoad(formData).then(({results:data}) => {
        this.form.dbconfigfile = data.url
      })
    },
    getDetail() {
      operationDetail({
        taskid: this.$route.query.taskid
      }).then(({ results: data }) => {
        this.form = { ...data }
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },
    numChange(value) {
      this.form.slaveNodes = []
      for (let i = 1; i <= value; i++) {
        this.form.slaveNodes.push({
          host: '',
          data_directory: '/data/mysql'
        })
      }
    },
    callbackBtn() {
      this.$router.push({ name: 'autoOperation' })
    },
    save() {
      let isnew = null
      if (this.$route.query.taskid) {
        isnew = false
      } else {
        isnew = true
      }
      operationSave({
        isnew,
        ...this.form
      }).then((data) => {
        this.$message.success(data.message)
        this.$router.push({ name: 'autoOperation' })
      }).catch((err) => {
        this.$message.error(err.message.join())
      })
    }
  }
}
</script>
<style lang="sass" scoped>
.df2
    display: flex
    flex-direction:row
</style>
