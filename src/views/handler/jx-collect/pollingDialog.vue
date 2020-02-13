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
      <el-form-item label="接口名称" prop="shell_id">
        <el-select
          v-model="componentForm.shell_id"
          style="width: 60%"
        >
          <el-option
            v-for="item in shellOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <!--<el-form-item label="调度详情">
        <div v-loading="isLoading" />
      </el-form-item>-->

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="isShowDialog = false">取 消</el-button>
      <el-button type="primary" @click="confirm" :loading="isLoading">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { fetchDetail } from '@/api/handler.js'
import { getShellList } from '@/api/resource'

export default {
  data() {
    return {
      title: '',
      isShowDialog: false,
      cronPopover: false,
      componentForm: {},
      componentFormRules: {
        status: [{ required: true, message: '请选择任务类型', trigger: 'change' }]
      },
      options: [{
        value: 0,
        label: '在用'
      }, {
        value: 1,
        label: '失效'
      }],
      shellOptions: [],
      index: 0,
      type: 0,
      isLoading: false
    }
  },
  methods: {
    change(val) {
      if (val) {
        this.isLoading = true
        fetchDetail(this.componentForm)
          .then(res => {

          })
          .finally(() => {
            this.isLoading = false
          })
      }
    },
    show({ hostip }, index) {
      this.isShowDialog = true
      this.componentForm.hostip = hostip
      this.title = '调度详情'

      getShellList()
        .then(({ results }) => {
          this.shellOptions = results.results.map(v => {
            console.log(v)
            return {
              value: v.id,
              label: v.name
            }
          })
        })
    },
    hide() {
      this.isShowDialog = false
    },
    confirm() {
      this.$refs.componentForm.validate(valid => {
        if (valid) {
          this.isLoading = true
          fetchDetail(this.componentForm)
            .then(res => {
              this.$emit('confirm', this.type, this.componentForm, this.index)
            })
            .finally(() => {
              this.isLoading = false
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
