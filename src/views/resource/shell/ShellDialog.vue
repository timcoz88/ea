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
      <el-form-item label="状态" prop="status">
        <el-select v-model="componentForm.status" style="width: 60%">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
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
export default {
  data() {
    return {
      title: '',
      isShowDialog: false,
      cronPopover: false,
      componentForm: {
        status: 0
      },
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
      index: 0,
      type: 0
    }
  },
  methods: {
    /**
     *
     * @param type 1新增 2 编辑
     */
    show(type, { id, status }, index) {
      this.isShowDialog = true

      this.title = type === 1 ? '新增脚本资源' : '编辑脚本资源'
      this.type = type

      if (type === 1) {
        this.$nextTick(() => {
          this.$refs.componentForm.resetFields()
        })
      } else {
        this.index = index
        this.componentForm = {
          status,
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
