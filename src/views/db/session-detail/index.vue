<template>
    <el-card style="margin:20px;">
        <div class="df">
            <div>
                <el-button>立即终止会话</el-button>
                <el-button>事务处理后会话</el-button>
            </div>
            <div>
                <el-button @click="callback">返回</el-button>
            </div>
        </div>
        <el-row :gutter="20" type="flex" style="margin-top:20px;">
            <el-col :span="8">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                    <span class="common-page-title">服务器</span>
                    </div>
                    <el-row class="card-content">
                    <el-col :sm="24" :lg="12" class="card-content-item">当前状态：{{ dbInfo.db_res && dbInfo.db_res.hostnm }}
                    </el-col>
                    <el-col :sm="24" :lg="12" class="card-content-item">ID：{{ dbInfo.hostip }}</el-col>
                    <el-col :sm="24" :lg="12" class="card-content-item">序列号：{{ dbInfo.dbnm }}</el-col>
                    <el-col :sm="24" :lg="12" class="card-content-item">登录时间：{{ dbInfo.db_res && dbInfo.db_res.status }}</el-col>
                    <el-col :sm="24" :lg="12" class="card-content-item">数据库用户名：{{ dbInfo.db_res && dbInfo.db_res.archiver }}</el-col>
                    <el-col :sm="24" :lg="12" class="card-content-item">类型：{{ dbInfo.db_res && dbInfo.db_res.instance_nm
                    }}</el-col>
                    <el-col :sm="24" :lg="12" class="card-content-item">操作系统进程：{{ dbInfo.db_res && dbInfo.db_res.inst_id }}</el-col>
                    <el-col :sm="24" :lg="12" class="card-content-item">当前会话ID：{{ dbInfo.dbtype }}</el-col>
                    </el-row>
                </el-card>
            </el-col>
            <el-col :span="8" class="module-container">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                    <span class="common-page-title">服务器</span>
                    </div>
                    <div class="card-content">
                    <el-col :sm="24" :lg="12" class="card-content-item">操作系统用户名：{{ dbInfo.db_res && dbInfo.db_res.hostnm }}
                    </el-col>
                    <el-col :sm="24" :lg="12" class="card-content-item">客户系统进程：{{ dbInfo.hostip }}</el-col>
                    <el-col :sm="24" :lg="12" class="card-content-item">主机：{{ dbInfo.dbnm }}</el-col>
                    <el-col :sm="24" :lg="12" class="card-content-item">终端：{{ dbInfo.db_res && dbInfo.db_res.status }}</el-col>
                    <el-col :sm="24" :lg="12" class="card-content-item">应用程序：{{ dbInfo.db_res && dbInfo.db_res.archiver }}</el-col>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="20" type="flex" style="margin-top:20px;">
            <el-col :span="8">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                    <span class="common-page-title">应用程序</span>
                    </div>
                    <el-row class="card-content">
                    <el-col :sm="24" :lg="12" class="card-content-item">当前SQL：{{ dbInfo.db_res && dbInfo.db_res.hostnm }}
                    </el-col>
                    <el-col :sm="24" :lg="12" class="card-content-item">当前SQL开始执行：{{ dbInfo.hostip }}</el-col>
                    <el-col :sm="24" :lg="12" class="card-content-item">上一条SQL ID：{{ dbInfo.dbnm }}</el-col>
                    <el-col :sm="24" :lg="12" class="card-content-item">上一条SQL开始执行时间：{{ dbInfo.db_res && dbInfo.db_res.status }}</el-col>
                    <el-col :sm="24" :lg="12" class="card-content-item">当前模块：{{ dbInfo.db_res && dbInfo.db_res.archiver }}</el-col>
                    </el-row>
                </el-card>
            </el-col>
            <el-col :span="8" class="module-container">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                    <span class="common-page-title">服务器</span>
                    </div>
                    <div class="card-content">
                    <el-col :sm="24" :lg="12" class="card-content-item">当前等待事件：{{ dbInfo.db_res && dbInfo.db_res.hostnm }}
                    </el-col>
                    <el-col :sm="24" :lg="12" class="card-content-item">当前等待类：{{ dbInfo.hostip }}</el-col>
                    <el-col :sm="24" :lg="12" class="card-content-item">等待持续时间：{{ dbInfo.dbnm }}</el-col>
                    <el-col :sm="24" :lg="12" class="card-content-item">P1：{{ dbInfo.db_res && dbInfo.db_res.status }}</el-col>
                    <el-col :sm="24" :lg="12" class="card-content-item">P1TEXT：{{ dbInfo.db_res && dbInfo.db_res.archiver }}</el-col>
                    <el-col :sm="24" :lg="12" class="card-content-item">P2：{{ dbInfo.db_res && dbInfo.db_res.hostnm }}
                    </el-col>
                    <el-col :sm="24" :lg="12" class="card-content-item">P2TEXT：{{ dbInfo.hostip }}</el-col>
                    <el-col :sm="24" :lg="12" class="card-content-item">失败堵塞会话：{{ dbInfo.dbnm }}</el-col>
                    <el-col :sm="24" :lg="12" class="card-content-item">失败堵塞状态：{{ dbInfo.db_res && dbInfo.db_res.status }}</el-col>
                    <el-col :sm="24" :lg="12" class="card-content-item">失败堵塞实例：{{ dbInfo.db_res && dbInfo.db_res.archiver }}</el-col>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </el-card>
</template>
<script>
export default {
    data(){
        return{
            dbInfo:{}
        }
    },
    methods:{
        callback(){}
    }
}
</script>
<style lang="sass" scoped>
.box-card
      .el-card__header
       padding: 10px
      .card-content
       font-size: 14px
       height: 160px
       overflow-y: auto
       .card-content-item
         line-height: 30px
         height: 30px
.df
    display: flex;
    justify-content: space-between;
</style>