<template>
    <el-card style="margin:20px;">
        <p>部署配置</p>
        <el-form :model="form" ref="form" label-position="left" inline="true">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="主库IP：" label-width="70px">
                        <span>{{form.primary_node.host}}</span>
                    </el-form-item>
                    <el-form-item label="data目录：" label-width="100px">
                        <span>{{form.primary_node.data_directory}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <div v-for="(item,key) in form.slave_nodes" :key="key">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="从库IP：" label-width="70px">
                            <span>{{item.host}}</span>
                        </el-form-item>
                        <el-form-item label="data目录：" label-width="100px">
                            <span>{{item.data_directory}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>
        </el-form>
        <p>部署日志</p>
    </el-card>
</template>
<script>
import {operationRunLog} from '@/api/operation'
export default {
    data(){
        return{
            form:{
                primary_node:{
                    host:'11.12.3.4',
                    data_directory:'/data/mysql'
                },
                slave_nodes:[{
                    host:'11.12.3.4',
                    data_directory:'/data/mysql'
                }]
            }
        }
    },
    created(){
        this.getLog()
    },
    methods:{
        getLog(){
            operationRunLog({
                taskid:this.$route.query.taskid
            }).then(({results: data}) => {

            }).catch(err => this.$message.error(err.message))
        }
    }
}
</script>
<style lang="sass" scoped>

</style>