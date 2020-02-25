<template>
  <el-card v-loading="loading" style="margin:20px;font-size:14px;">
    <el-row>
      <el-col>
        <label for="grouping">分组</label>
        <el-select v-model="group" name="grouping" @change="groupChange">
          <el-option
            v-for="(item,key) in groupList"
            :key="key"
            :label="item"
            :value="item"
          />
        </el-select>
        <label for="grouping">排序方式</label>
        <el-select v-model="order" name="grouping" @change="orderChange">
          <el-option
            v-for="(item,key) in sortOrder"
            :key="key"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-input v-model="content" placeholder="请输入内容" style="width:20%;margin-left:10px;"> <el-button slot="append" icon="el-icon-search" @click="selectID" /></el-input>
      </el-col>
    </el-row>
    <div style="margin-top:20px;">
      <el-row>
        <div v-for="(item,key) in databaseList" :key="key">
          <el-col :span="8" style="padding: 10px;">
            <el-card class="box-card" :class="{isErrorActive:!item.sql_status}">
              <div @click="dataBase(item.hostip,item.dsn,item.sql_status,item.mysql_type,item.dbid)" :class="{cp:item.sql_status}">
                <div class="df">
                  <span class="vn">
                    <img v-if="item.mysql_type == 'ORACLE'" src="@/assets/oracle.png" style="width: 42px;height: 42px;" class="vn">
                    <img v-else src="@/assets/mysql.png" style="width: 42px;height: 42px;" class="vn">
                    {{ item.dbnm }}</span>
                  <div>
                    <img v-if="item.sql_status" src="@/assets/notice.png" class="notice-img">
                    <img v-else src="@/assets/warnRed.png" class="notice-img">
                    <!-- <span style="vertical-align: middle;">{{item.error_num}}</span> -->
                  </div>
                </div>
                <div class="df2 icol">
                  <div class="one">
                    <img src="@/assets/dataBaseStatus.png" class="notice-img vn">
                    <span class="vn">数据库状态：</span>
                    <span v-if="item.sql_status" class="vn">连接正常</span>
                    <span v-else class="vn" style="color:red;">连接异常</span>
                  </div>
                  <div class="two">
                    <img src="@/assets/sessionNum.png" class="notice-img vn">
                    <span class="vn">阻塞会话数：</span>
                    <span class="vn">{{ item.block_num }}</span>
                  </div>
                </div>
                <div class="df2 icol">
                  <div class="one">
                    <img src="@/assets/TPS.png" class="notice-img vn">
                    <span class="vn">{{item.mysql_type == 'ORACLE'?'TPS：':'QPS：'}}</span>
                    <span class="vn">{{ item.qps_num }}</span>
                  </div>
                  <div class="two">
                    <img src="@/assets/sessionNum.png" class="notice-img vn">
                    <span class="vn">活跃会话数：</span>
                    <span class="vn">{{ item.active_num }}</span>
                  </div>
                </div>
                <div style="border-top: 1px solid #e6ebf5;padding:10px 0;height: 37px;">
                   <el-tooltip class="item" effect="dark" placement="bottom">
                     <div slot="content"> <p>{{ item.error_msg }}</p></div>
                        <p style="display: inline-block;
          white-space: nowrap;
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;">{{ item.error_msg }}</p>
                </el-tooltip>
                  
                </div>
              </div>
            </el-card>
          </el-col>
        </div>
      </el-row>
      <div class="page-box">
        <Pagination
          v-if="total > 0"
          :current-page="page"
          :total="total"
          @pagination="handlePage"
        />
      </div>
    </div>
  </el-card>
</template>
<script>
import { databaseOverview, groupList } from '@/api/overview'
import Pagination from '@/components/Pagination'
let timer = null
export default {
  components: {
    Pagination
  },
  data() {
    return {
      loading: true,
      group: '全部',
      groupList: [],
      order: 'error',
      sortOrder: [{
        label: '按警示级别',
        value: 'error'
      }],
      content: '',
      databaseList: [],
      page: 1,
      pageSize: 10,
      total: 0
    }
  },
  created() {
    this.getGroup()
    this.getList()
  },
  methods: {
    dataBase(hostip, dsn,status,type,dbid) {
      if(!status){
        return false
      }
      if(type == 'MYSQL'){
        this.$router.push({ name: 'mysqlMonitor', query: { hostip, dsn,dbid }})
      }else if(type == 'ORACLE'){
        this.$router.push({ name: 'databaseMonitor', query: { hostip, dsn,dbid }})
      }
    },
    getGroup() {
      groupList().then(({ results: data }) => {
        this.groupList = data
        this.groupList.unshift('全部')
      }).catch(err => this.$message.error(err.message))
    },
    selectID() {
      this.loading = true
      this.order = 'error'
      this.group = '全部'
      this.pageSize = 10
      this.page = 1
      this.getData()
    },
    groupChange(val) {
      this.loading = true
      this.order = 'error'
      this.content = ''
      this.pageSize = 10
      this.page = 1
      this.getData()
    },
    orderChange() {
      this.content = ''
      this.group = '全部'
      this.loading = true
      this.pageSize = 10
      this.page = 1
      this.getData()
    },
    getList() {
      this.getData()
    },
    handlePage(val) {
      this.loading = true
      this.page = val.page
      this.pageSize = val.limit
      this.getList()
    },
    getData() {
      databaseOverview(
      { page: this.page,
        pageSize: this.pageSize,
        order:this.order,
        groupid:this.group == '全部'?"":this.group,
        dbname:this.content
      }).then(({ results: data }) => {
        this.databaseList = data.results
        this.total = data.totalCount
        clearInterval(timer)
        timer = setInterval(() => {
          this.getList()
        },10000)
      }).catch(err => {
        this.databaseList = []
        this.total = 0
        this.page = 1
        this.pageSize = 10
        this.$message.error(err.message)
      }).then(_ => this.loading = false)
    }
  },
  destroyed(){
    clearInterval(timer)
  }
}
</script>
<style  scoped>

.isErrorActive{
    border: 1px solid red;
}
.vn{
    vertical-align: middle;
}
.df2{
    display:flex;
    flex-direction:row;
}

.df{
    display: flex;
    justify-content: space-between;
}
.cp{
  cursor: pointer;
}

.notice-img{
    width: 18px;
    object-fit: cover;
    vertical-align: middle;
}
.box{
    margin-right: 20px;

    padding: 10px;
}
.box.lineB{
    border:1px solid #000000;
}
.box.lineR{
    border:1px solid red;
}
p{
    margin: 0;
    padding: 0;
}
.icol .one{
    height: 40px;
    line-height:40px;
    width: 58%;
}
.icol .two{
    height: 40px;
    line-height:40px;
    width: 42%;
}
</style>
<style>
.el-tooltip__popper{font-size: 14px; width:24%; } 
</style>