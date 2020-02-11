<template>
    <el-card style="margin:20px;" v-loading="loading">
        <el-row>
            <el-col>
                <label for="grouping">分组</label>
                <el-select name="grouping" v-model="group" @change="groupChange">
                    <el-option
                        v-for="(item,key) in groupList" 
                        :key="key"
                        :label="item"
                        :value="item"
                    ></el-option>
                </el-select>
                <label for="grouping">排序方式</label>
                <el-select name="grouping" v-model="order" @change="orderChange">
                    <el-option
                        v-for="(item,key) in sortOrder" 
                        :key="key"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
                <el-input placeholder="请输入内容" v-model="content" style="width:20%;margin-left:10px;"> <el-button slot="append" icon="el-icon-search" @click="selectID"></el-button></el-input>
            </el-col>
        </el-row>
        <div style="margin-top:20px;">
            <el-row>
                <div v-for="(item,key) in databaseList" :key="key">
                    <el-col :span="6">
                        <div class="box" :class="item.error_num>0?'lineR':'lineB'" @click="dataBase(item.hostip,item.dsn)">
                            <div class="df" style="line-height:20px;height:20px;">
                                <span>{{item.mysql_type}}</span>
                                <div>
                                    <img src="@/assets/notice.png" class="notice-img">
                                    <span style="vertical-align: middle;">{{item.error_num}}</span>
                                </div>
                            </div>
                            <div class="df2 icol">
                                <div>
                                    <span>数据库状态：</span>
                                    <span>{{item.sql_status?'连接正常':'连接异常'}}</span>
                                </div>
                                <div>
                                    <span>阻塞会话数：</span>
                                    <span>{{item.block_num}}</span>
                                </div>
                            </div>
                            <div class="df2 icol">
                                <div>
                                    <span>活跃会话数：</span>
                                    <span>{{item.active_num}}</span>
                                </div>
                                <div>
                                    <span>总QPS：</span>
                                    <span>{{item.qps_num}}</span>
                                </div>
                            </div>
                            <div class="df2 icol">
                                <div>
                                    <span>实时QPS：</span>
                                    <span>{{item.qps_time_num}}</span>
                                </div>
                            </div>
                            <div style="border-top: 1px solid;padding:10px 0;">
                                <p>{{item.error_msg}}</p>
                            </div>
                        </div>
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
import { databaseOverview,groupList } from '@/api/overview'
import Pagination from '@/components/Pagination'
export default {
    components: {
        Pagination
    },
    data(){
        return{
            loading:true,
            group:'',
            groupList:[],
            order:'',
            sortOrder:[{
                label:'按警示级别',
                value:'error'
            }],
            content:'',
            databaseList:[],
            page:1,
            pageSize:10,
            total:0
        }
    },
    created(){
        this.getGroup()
        this.getList()
    },
    methods:{
        dataBase(hostip,dsn){
            this.$router.push({name:'databaseMonitor',query:{hostip:hostip,dsn:dsn}})
        },
        getGroup(){
            groupList().then(({results:data}) => {
                this.groupList = data
            }).catch(err => this.$message.error(err.message))
        },
        selectID(){
            this.loading = true
            this.order = ''
            this.group = ''
            this.pageSize = 10
            this.page = 1
            this.getData({
                page:this.page,
                pageSize:this.pageSize,
                mysql_type:this.content
            })
        },
        groupChange(val){
            this.loading = true
            this.order = ''
            this.content = ''
            this.pageSize = 10
            this.page = 1
            if(val != ''){
                this.getData({
                    page:this.page,
                    pageSize:this.pageSize,
                    groupid:val
                })
            } else{
                this.getData({
                    page:this.page,
                    pageSize:this.pageSize
                })
            }
        },
        orderChange(val){
            this.content = ''
            this.group = ''
            this.loading = true
            this.pageSize = 10
            this.page = 1
            this.getData({
                page:this.page,
                pageSize:this.pageSize,
                order:val
            })
        },
        getList(){
            this.getData({
                page:this.page,
                pageSize:this.pageSize
            })
        },
        handlePage(val){
            this.loading = true
            this.page = val.page
            this.pageSize = val.limit
            this.getList()
        },
        getData(param){
            databaseOverview(param).then(({results: data}) => {
                this.databaseList = data.results
                this.total = data.totalCount
            }).catch(err => {
                this.databaseList = []
                this.total = 0
                this.page = 1
                this.pageSize = 10
                this.$message.error(err.message)
            }).then(_ => this.loading =  false)
        }
    }
}
</script>
<style  scoped>
.df2{
    display:flex;
    flex-direction:row;
}
    
.df{
    display: flex;
    justify-content: space-between;
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
.icol>div{
    height: 40px;
    line-height:40px;
    width: 50%;
}
</style>