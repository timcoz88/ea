<template>
  <el-card style="margin: 20px">
    <h4>新增部署任务</h4>
    <el-form ref="form" :model="form" label-position="left">
      <el-row>
        <el-col :span="6">
          <el-form-item label="任务ID" label-width="70px">
            <el-input v-model.trim="form.taskid" style="width:100%;" placeholder="请输入任务ID" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="节点数" style="margin-left:10px;" label-width="80px" label-position="center">
            <el-select v-model="form.node_count" style="width:100%;" @change="numChange">
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
        <el-col :span="12">
          <div class="df2">
            <el-form-item label="主库" label-width="70px" label-position="left" />
            <div class="df2" style="width:100%;border:1px solid #DCDFE6;height: 50px;padding: 5px;">
              <el-form-item label="host" label-position="center" label-width="50px" style="width:50%;">
                <el-input v-model.trim="form.primary_node.host" placeholder="请输入host" style="width:90%;" />
              </el-form-item>
              <el-form-item label="data目录" style="width:50%;" label-width="80px">
                <el-input v-model.trim="form.primary_node.data_directory" placeholder="请输入data目录" style="width:100%;" />
              </el-form-item>
            </div>
          </div>
        </el-col>
      </el-row>
      <div v-for="(item,key) in form.slave_nodes" :key="key">
        <el-row>
          <el-col :span="12">
            <div class="df2">
              <el-form-item label="从库" label-width="70px" label-position="left" />
              <div class="df2" style="width:100%;border:1px solid #DCDFE6;height: 50px;padding: 5px;">
                <el-form-item label="host" label-position="center" label-width="50px" style="width:50%;">
                  <el-input v-model.trim="item.host" placeholder="请输入host" style="width:90%;" />
                </el-form-item>
                <el-form-item label="data目录" style="width:50%;" label-width="80px">
                  <el-input v-model.trim="item.data_directory" placeholder="请输入data目录" style="width:100%;" />
                </el-form-item>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <el-row>
        <el-col :span="6">
          <el-form-item label="用户名" label-width="70px" label-position="left">
            <el-input v-model.trim="form.username" placeholder="请输入用户名" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="密码" style="margin-left:10px;" label-width="80px" label-position="center">
            <el-input v-model.trim="form.password" placeholder="请输入密码" style="width:100%;" show-password />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="数据库root用户密码" label-width="160px" label-position="left">
            <el-input v-model.trim="form.dbrootpwd" placeholder="请输入root密码" style="width:100%;" show-password />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="my.cnf文件上传" label-width="140px" label-position="left">
        <el-upload
          class="upload-demo"
          :limit="1"
          action
          :http-request="uploadform"
          :on-remove="uploadMove"
          :on-change="imgSaveToUrl"
          style="width:150px;"
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
      numList: [3, 4, 5, 6, 7, 8, 9],
      form: {
        taskid: localStorage.getItem('username') + '_' + new Date().getTime(),
        node_count: 3,
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
        dbrootpwd: '',
        localFile:{}
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
    imgSaveToUrl(event){
      this.localFile=event.raw;
      let reader = new FileReader()
      reader.readAsDataURL(this.localFile);
    },
    uploadform(file) {
      const formData = new FormData()
      formData.append('file', file.file),
      upLoad(formData).then(({results:data}) => {
        this.form.dbconfigfile = data.path
        // document.querySelector('.el-upload-list__item-name').href = data.url
      })
    },
    getDetail() {
      operationDetail({
        taskid: this.$route.query.taskid
      }).then(({ results: data }) => {
        this.form = { ...data }
        this.form.node_count += 1
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },
    numChange(value) {
      // this.form.slave_nodes = []
      let nodeLen = this.form.slave_nodes.length
      if(nodeLen > (value-1)){
        console.log(nodeLen - value)
        for (let i = 0; i < ( nodeLen - value + 1); i++) {
          this.form.slave_nodes.splice(this.form.slave_nodes-1,1)
        }
      }else if(nodeLen < (value-1)){
        for (let i = 0; i < (value - nodeLen - 1); i++) {
          this.form.slave_nodes.push({
            host: '',
            data_directory: '/data/mysql'
          })
        }
      }
    },
    callbackBtn() {
      this.$router.push({ name: 'autoOperation' })
    },
    save() {
      if(this.form.taskid == '' ){
        this.$message.error('任务ID不能为空')
        return false
      }
      if(this.form.primary_node == '' ){
        this.$message.error('主库host不能为空')
        return false
      }
      if(this.form.data_directory == '' ){
        this.$message.error('主库data目录不能为空')
        return false
      }
      let num = 0
      list:{
        for(let i=0;i<this.form.slave_nodes.length;i++){
          if(this.form.slave_nodes[i].host == '' || this.form.slave_nodes[i].data_directory==''){
            num ++
            break list
          }
        }
      }
      if(num > 0){
        this.$message.error('从库host或者data目录不能为空')
        return false
      }
      if(this.form.username == ''){ 
        this.$message.error('用户名不能为空')
        return false
      }
      if(this.form.password == ''){ 
        this.$message.error('密码不能为空')
        return false
      }
      if(this.form.dbrootpwd == ''){ 
        this.$message.error('root用户密码不能为空')
        return false
      }
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
