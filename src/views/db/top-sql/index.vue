<template>
  <el-card style="margin: 20px">
    <div style="text-align: right;">
      <el-button @click="callback">返回</el-button>
    </div>
    <div class="page p20">
      <div class="page-title" v-if="dbtype == 'Oracle'">
        <p>SQL ID：{{apiResult.sqlid}}</p>
        <p v-if="apiResult.showelapsedtime">执行时长：{{ apiResult.elapsedtime }} s</p>
        <p>逻辑读：{{getLocalData.BUFFER_GETS}}</p>
        <p>磁盘读：{{getLocalData.DISK_CALLS}}</p>
      </div>
      <div class="SQLDiv">
        <div class="comment-wrap">
          <span class="text-title">说明</span>
          <div class="comment-content">
            <el-radio-group v-for="(item, index) in apiResult.comments" :key="item.comment" v-model="apiResult.commentIndex" @change="commentChange">
              <el-radio :label="index" :disabled="item.reg === null" style="margin-bottom: 8px">{{ item.comment }}</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div class="sqltext-wrap">
          <span class="text-title">SQL语句</span>
          <div ref="html-div" class="html-div" v-html="apiResult.sqltext" />
        </div>
        <div class="sqlexplain-wrap">
          <span class="text-title">执行计划</span>
          <ElTable
            ref="remoteData"
            v-loading="loading"
            :data="apiResult.sqlexplain"
            border
            style="width: 100%;"
          >
            <div v-if="dbtype==='Oracle'">
              <el-table-column
                prop="id"
                label="ID"
                width="50"
              />
              <el-table-column
                prop="operation"
                label="操作类型"
              >
                <template slot-scope="scope">
                  <!--保留数据缩进-->
                  <span>{{ scope.row.operation.split(' ').join('&nbsp;') }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="name"
                label="对象名"
              />
              <el-table-column
                prop="rows"
                label="行数"
                width="120"
              />
              <el-table-column
                prop="bytes"
                label="字节数"
                width="120"
              />
              <el-table-column
                prop="cost"
                label="成本"
                width="120"
              />
              <el-table-column
                prop="time"
                label="时间(秒)"
                width="120"
              />
            </div>
            <div v-else>
              <el-table-column
                prop="id"
                label="ID"
                width="50"
              />
              <el-table-column
                prop="select_type"
                label="select_type"
              />
              <el-table-column
                prop="table"
                label="table"
              />
              <el-table-column
                prop="partitions"
                label="partitions"
              />
              <el-table-column
                prop="type"
                label="type"
              />
              <el-table-column
                prop="key"
                label="key"
              />
              <el-table-column
                prop="ref"
                label="ref"
              />
              <el-table-column
                prop="rows"
                label="rows"
              />
              <el-table-column
                prop="filtered"
                label="filtered"
              />
              <el-table-column
                prop="Extra"
                label="Extra"
              />
            </div>
          </ElTable>
        </div>
      </div>
    </div>
  </el-card>
</template>
<script>
// import { topsqlDetail } from '@/api/management'
import request from '@/utils/request'
import { getOtherURL } from '@/api/home'
import data from '../../pdf/content'
export default {
  data() {
    return {
      loading: false,
      dbtype: '',
      getLocalData:{},
      apiResult: {
        sqlid: 'c2ayd0t8raf3b',
        showelapsedtime: true, // 是否显示执行时长
        elapsedtime: 1, // 执行时长
        commentIndex: 0,
        comments: [
          {
            reg: ['\\bfrom\\b[,\\s*[\\S*\\.]\\S*("|\\b)]*'],
            comment: '多表关联操作时，表与表之间并没有使用连接条件进行表数据匹配，会使Oracle产生笛卡尔积连接操作，严重影响数据库性能'
          },
          {
            reg: ['\\bselect\\b\\s*\\*\\s*\\bfrom\\b'],
            comment: '查询时没有指明目标字段，容易因版本变更等原因导致返回数据异常'
          }
        ],
        sqltext: '', // topsql标红处理后的语句
        sqlTextOrigin: '', // topsql原始语句
        sqlexplain: [], // 执行计划表格数据
        urlArr4:''
      }
    }
  },
  created() {
    this.dbtype = this.$route.query.dbtype
    this.getLocalData = JSON.parse(localStorage.getItem('selectTopSql'))
    this.getURL()
    // this.getDetail()
    // this.dbtype = 'Oracle' // 根据数据库类型显示不同的执行计划表头
  },
  mounted() {
    // 调用接口后的处理
    // this.apiResult.showelapsedtime = true
    // 'select * from exsql.t_normal1_1 t1,exsql1.t_normal2 t2 where t1.id != :"SYS_B_0"'
    
    // if (this.dbtype === 'Oracle') {
    //   this.apiResult.sqlexplain = [{
    //     cost: '     2   (0)',
    //     bytes: '   177 ',
    //     name: '      ',
    //     id: '   0 ',
    //     time: ' 00:00:01 ',
    //     rows: '     1 ',
    //     operation: ' SELECT STATEMENT  '
    //   }]
    // } else {
    //   this.apiResult.sqlexplain = [{
    //     partitions: null,
    //     ref: null,
    //     filtered: '100.00',
    //     'Extra': null,
    //     'select_type': 'DELETE',
    //     'id': '1',
    //     'type': 'ALL',
    //     'rows': '1',
    //     'possible_keys': null,
    //     'table': 'bsp',
    //     'key': null,
    //     'key_len': null
    //   }]
    // }
  },

  methods: {
    getURL(){
      getOtherURL().then(({results:data}) => {
          data.results.forEach(ele => {
            if(ele.url_type == 3){
              this.urlArr4 = ele.url
            }
          });
          if(this.urlArr4){
              this.getDetail()
          }
      })
      // .catch(err => this.$message.error(err.message))
    },
    getDetail(){
      let {dbid,hostip,dsn} = this.$route.query
      let { SQL_ID,SQL_TEXT} = JSON.parse(localStorage.getItem('selectTopSql'))
      request({
          url: this.urlArr4,
          method: 'post',
          data:{
            hostip,
            dsn,
            dbid,
            sqlid:SQL_ID,
            sqltext:SQL_TEXT
          }
        }).then(({data}) => {
          this.apiResult.sqlTextOrigin = SQL_TEXT
          this.apiResult =  {...data}
          this.commentChange(0)
        })
        // .catch(err => this.$message.error(err.message))
    },
    callback(){
      let {hostip,dsn} = this.$route.query
      if(this.dbtype == 'Oracle'){
        this.$router.push({name:'databaseMonitor',query:{hostip,dsn,componentName:"topSql"}})
      }else{
        this.$router.push({name:'mysqlMonitor',query:{hostip,dsn,componentName:"topSql"}})
      }
    },
    // 切换说明时标红对应的违规处
    commentChange(val) {
      const regExpArr = this.apiResult.comments[val].reg
      let strArr = [] // 匹配目标字符串数组
      if (regExpArr && regExpArr.length) {
        regExpArr.forEach(item => {
          const str = item.split('ATLAS_CASESENSITIVE')
          const type = str.length === 2 ? 'g' : 'gi' // 判断是否区分大小写
          const exp = `\(${str[0]}\)` // 加上括号，正则匹配分组
          const regExp = new RegExp(exp, type)
          const targetStrArr = this.apiResult.sqlTextOrigin.match(regExp)
          if (targetStrArr) {
            strArr = strArr.concat(targetStrArr)
          }
        })
      }
      strArr = Array.from(new Set(strArr)) // 去重

      const sqlTextTemp = this.apiResult.sqlTextOrigin ? this.apiResult.sqlTextOrigin.split('') : [] // 先分割成每个字符
      strArr.forEach(item => {
        const len = item.length
        let pos = this.apiResult.sqlTextOrigin.indexOf(item)
        // 不考虑span标签交叉的问题，被标签包裹部分标记起来即可
        while (pos > -1) { // 迭代匹配同样字符串
          sqlTextTemp[pos] = '<span class="text-marker">' + sqlTextTemp[pos]
          sqlTextTemp[pos + len - 1] = sqlTextTemp[pos + len - 1] + '</span>'
          pos = this.apiResult.sqlTextOrigin.indexOf(item, pos + 1)
        }
      })
      this.apiResult.sqlText = sqlTextTemp.join('')
    }
  }
}
</script>
<style lang="sass" scoped>
.page
  /deep/ .text-marker
    font-weight: bold
    color: red
  .page-title
    display: flex
    p
      margin-right: 4%
  .SQLDiv
    display: flex
    flex-flow: column wrap
    margin-top: 16px
    .text-title
      position: absolute
      left: 16px
      top: -6px
      background: #FFFFFF
      font-size: 12px
      padding: 0 6px
      font-weight: 700
      z-index: 1
    .comment-wrap
      position: relative
      width: 100%
      height: 150px
      border-radius: 4px
      border: 1px solid #dddee1
      margin-bottom: 2em
      .comment-content
        overflow-y: auto
        padding: 16px 7px 4px
        color: #495060
        font-size: 12px
    .sqltext-wrap
      position: relative
      width: 100%
      height: 200px
      margin-bottom: 2em
      .html-div
        padding: 16px 7px 7px
        border-radius: 4px
        border: 1px solid #dddee1
        color: #495060
        font-size: 12px
        word-break: break-all
        width: 100%
        height: 100%
        overflow-y: auto
        margin-bottom: 2em
    .sqlexplain-wrap
      position: relative
      width: 100%
      border-radius: 4px
      border: 1px solid #dddee1
      margin-bottom: 2em
      padding: 16px 7px 4px

.default-label
  border-radius: 4px
  font-size: 14px
  letter-spacing: 0
  text-align: center
  line-height: 28px
  width: 82px
  height: 28px

  .success
    background: #EFF9EB
    border: 1px solid #D3EEC7
    color: #4CBB4F

  .fail
    background: #FEF0F0
    border: 1px solid #FCD5D5
    color: #F66C80

  .pending
    background: #F0F9FE
    border: 1px solid #D5E7FC
    color: #409EFF

</style>
