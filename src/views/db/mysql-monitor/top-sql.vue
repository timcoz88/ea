<template>
  <div>
    <el-input
      v-model.trim="filter.searchVal"
      type="text"
      class="filter-input"
      placeholder="请输入搜索内容"
      style="width: 30%"
      @keyup.enter.native="handleSearch"
    >
      <el-select
        slot="prepend"
        v-model="filter.searchType"
        style="width: 160px;"
        placeholder="请选择查询类型">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
    </el-input>
    <el-select name="grouping" v-model="order">
      <el-option v-for="(item,key) in sortOrder" :key="key" :label="item.label" :value="item.value"></el-option>
    </el-select>
    <el-radio v-model="radio" label="desc" style="margin-left:20px;">顺序</el-radio>
    <el-radio v-model="radio" label="asc">倒序</el-radio>
    <el-button @click="handleSearch">搜索</el-button>
    <el-button @click="reset">重置</el-button>
    <div style="margin-top:20px;">
      <el-table
        v-loading="loading"
        ref="remoteData"
        :data="tableData"
        border
        @row-dblclick="getDetail"
        style="width: 100%"
      >
        <el-table-column prop="sql_id" label="SQL ID"/>
        <el-table-column prop="query" label="SQL文本" />
        <el-table-column prop="schema_name" label="数据库" />
        <el-table-column prop="time_per" label="耗时比例" />
        <el-table-column prop="avg_latency(ms)" label="平均耗时(ms)" />
        <el-table-column prop="avg_row_sent" label="平均返回行数"/>
        <el-table-column prop="count" label="执行次数"/>
      </el-table>
    </div>
    <div class="page-box">
      <Pagination v-if="total > 0" :current-page="page" :total="total" @pagination="handlePage" />
    </div>
  </div>
</template>
<script>
import {mysqlTopSqlList} from '@/api/management'
import Pagination from '@/components/Pagination'
export default {
  components: {
        Pagination
    },
  data() {
    return {
      loading:true,
      tableData:[],
      filter:{
        searchVal:'',
        searchType:''
      },
      options:[],
      radio: "desc",
      sortOrder: [
        {
          label:'全部',
          value:''
        },
        {
          label: "按执行次数",
          value: "count"
        },
        {
          label: "按平均响应时间",
          value: "avg_latency(s)"
        },
        {
          label: "按全表扫次数",
          value: "cnt_no_index"
        },
        {
          label: "按使用临时表次数",
          value: "cnt_tmp_table"
        }
      ],
      order:'count',
      options: [{
        value: '',
        label: '全部'
      },{
        value: 'SQL_TEXT',
        label: 'SQL文本'
      }],
      page:1,
      pageSize:10,
      total:0,
    };
  },
  created(){
    this.getList({})
  },
  methods: {
    handlePage(value){
      this.page = value.page
      this.pageSize = value.limit
      if(this.filter.searchType == 'SQL_TEXT'){
        this.getList({
          "SQL_TEXT":this.filter.searchVal
        })
      }else{
         this.getList({})
      }
    },
    getList(data){
      this.loading = true
      const { hostip, dsn } = this.$route.query
      mysqlTopSqlList(Object.assign({},{
        hostip,
        dsn,
        page:this.page,
        pageSize:this.pageSize,
        ORDER:this.radio,
        ORDER_TYPE:this.order
      },data)).then(({results:data}) => {
        this.tableData = data.results
        this.total = data.totalCount
      }).catch(err => {
         this.tableData = []
         this.total = 0
         this.page = 1
         this.pageSize = 10
        this.$message.error(err.message)
      })
      .then(() => this.loading = false)
    },
    handleSearch(){
      let param = {}
      this.page = 1
      this.pageSize = 10
      if(this.filter.searchType == 'NAME'){
        param = {
          "NAME":this.filter.searchVal
        }
      }else if(this.filter.searchType == 'SQL_TEXT'){
        param = {"SQL_TEXT":this.filter.searchVal}
      }

        this.getList(Object.assign({},param,{
          page:this.page,
          pageSize:this.pageSize,
          ORDER:this.radio,
          ORDER_TYPE:this.order,

        }))
    },
    reset(){
      this.filter.searchVal = ''
      this.filter.searchType = ''
      this.radio = 'desc'
      this.order = 'ELAPSED_TIME'
      this.handleSearch()
    },
    getDetail(row, column, event){
      const { hostip, dsn } = this.$route.query
      this.$router.push({name:'mysqlTopSql',query:{hostip, dsn,sql_id:row.sql_id}})
    }
  }
};
</script>