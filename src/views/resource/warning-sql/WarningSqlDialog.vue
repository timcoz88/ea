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
      <el-form-item label="监控名称" prop="monnm">
        <el-input v-model="componentForm.monnm" placeholder="请输入监控名称"></el-input>
      </el-form-item>
      <el-form-item label="问题级别" prop="msglvl">
        <el-input v-model="componentForm.msglvl" placeholder="请输入问题级别"></el-input>
      </el-form-item>
      <el-form-item label="采样频率" prop="freq">
        <el-input v-model="componentForm.freq" placeholder="请输入采样频率"></el-input>
      </el-form-item>
      <el-form-item label="解决建议" prop="cron_type">
        <el-input v-model="componentForm.recommand"
                  :rows="8"
                  type="textarea" placeholder="请输入解决建议"></el-input>
      </el-form-item>
      <el-form-item label="监控SQL" prop="cron_type">
        <el-input v-model="componentForm.monsql" :rows="8" type="textarea" placeholder="请输入监控SQL"></el-input>
      </el-form-item>
      <el-form-item label="详细SQL" prop="cron_type">
        <el-input v-model="componentForm.detailsql" :rows="8" type="textarea" placeholder="请输入详细SQL"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="cron_type">
        <el-select v-model="componentForm.status" style="width: 60%" placeholder="请选择状态">
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
      <el-button type="primary" @click="confirm" :loading="confirmLoading">确 定</el-button>
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
        cron_type: '',
        cron_value: ''
      },
      componentFormRules: {
        monnm: [{ required: true, message: '请选择任务类型', trigger: 'blur' }],
        msglvl: [{ required: true, message: '请输入问题级别', trigger: 'blur' }],
        freq: [{ required: true, message: '请输入采样频率', trigger: 'blur' }],
        recommand: [{ required: true, message: '请输入解决建议', trigger: 'blur' }],
        monsql: [{ required: true, message: '请输入监控SQL', trigger: 'blur' }],
        detailsql: [{ required: true, message: '请输入详细SQL', trigger: 'blur' }],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }]
      },
      options: [{
        value: 0,
        label: '待审核'
      }, {
        value: 1,
        label: '审核通过'
      }, {
        value: 2,
        label: '禁用'
      }],
      index: 0,
      type: 0,
      confirmLoading: false
    }
  },
  methods: {
    /**
     *
     * @param type 1新增 2 编辑
     */
    show(type, row, index) {
      this.isShowDialog = true

      this.title = type === 1 ? '新增预警SQL' : '编辑预警SQL'
      this.type = type

      if (type === 1) {
        this.$nextTick(() => {
          this.$refs.componentForm.resetFields()
        })
      } else {
        this.index = index
        this.componentForm = row
      }
    },
    hide() {
      this.isShowDialog = false
    },
    confirm() {
      this.$refs.componentForm.validate(valid => {
        if (valid) {
          this.confirmLoading = true
          const { id, monnm, msglvl, freq, recommand, monsql, detailsql, status } = this.componentForm
          this.$emit('confirm', { id, monnm, msglvl, freq, recommand, monsql, detailsql, status }, this.index, this.loading)
        }
      })
    },
    changeCron(val) {
      this.componentForm.cron_value = val
    },
    loading() {
      this.confirmLoading = false
    }
  }
}
</script>
