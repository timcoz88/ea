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
      <el-form-item label="时间类型" prop="cron_type">
        <el-select v-model="componentForm.cron_type" style="width: 60%">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="运行时间" prop="cron_value">
        <el-popover v-model="cronPopover" v-if="componentForm.cron_type === 'cron'">
          <cron i18n="cn" @change="changeCron" @close="cronPopover = false" />
          <el-input
            slot="reference"
            v-model="componentForm.cron_value"
            style="width: 60%"
            placeholder="请输入定时策略"
            @click="cronPopover = true"
          />
        </el-popover>
        <el-input
          v-else
          v-model="componentForm.cron_value"
          style="width: 60%"
          placeholder="请输入定时策略"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="isShowDialog = false">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
// 局部引入
import { cron } from 'vue-cron'

export default {
  components: { cron },
  data() {
    return {
      title: '',
      isShowDialog: false,
      cronPopover: false,
      componentForm: {
        cron_type: '',
        cron_value: ''
      },
      componentFormRules: {
        cron_type: [{ required: true, message: '请选择任务类型', trigger: 'change' }],
        cron_value: [{ required: true, message: '请输入任务值', trigger: 'change' }]
      },
      options: [{
        value: 'interval',
        label: 'interval'
      }, {
        value: 'cron',
        label: 'cron'
      }],
      index: 0,
      type: 0
    }
  },
  methods: {
    /**
     *
     * @param type 1新增 2 编辑
     */
    show(type, { id, cron_value = '', trigger }, index) {
      this.isShowDialog = true

      this.title = type === 1 ? '新增任务' : '编辑任务'
      this.type = type

      if (type === 1) {
        this.$nextTick(() => {
          this.$refs.componentForm.resetFields()
        })
      } else {
        this.index = index
        this.componentForm = {
          cron_value,
          cron_type: trigger,
          id
        }
      }
    },
    confirm() {
      this.$refs.componentForm.validate(valid => {
        if (valid) {
          console.log(this.componentForm)
          this.$emit('confirm', this.type, this.componentForm, this.index)
        }
      })
    },
    changeCron(val) {
      this.componentForm.cron_value = val
    }
  }
}
</script>
