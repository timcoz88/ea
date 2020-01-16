<template>
  <div class="analyze-setting">
    <el-form
      ref="componentForm"
      :model="componentForm"
      label-width="100px"
      class="demo-ruleForm">
      <el-form-item label="采样率">
        <el-input v-model="componentForm.estimate_percent" style="width: 100px"/>
        <el-checkbox v-model="defaultPercent" @change="defaultPercentMethod">系统默认采样</el-checkbox>
      </el-form-item>
      <p style="margin-left: 100px"> 取值范围[0.001,100]</p>
      <p style="margin-left: 100px;color: #999999;font-size: 14px">建议表小于1G时使用系统默认或不低于30，表大于10G时采样不超过20(维护窗口可适度增加采样)</p>
      <el-form-item label="并行度">
        <el-input v-model="componentForm.degree" style="width: 100px"/>
      </el-form-item>
      <p style="margin-left: 100px">建议CPU使用率小于60时适度使用并行</p>
      <el-form-item label="">
        <el-radio-group v-model="componentForm.no_invalidate">
          <el-radio :label="false">刷新游标,立即生效</el-radio>
          <el-radio :label="true">5小时逐渐生效</el-radio>
        </el-radio-group>

      </el-form-item>
      <el-form-item label="">
        <el-radio-group v-model="is_all">
          <el-radio :label="false">全表分析</el-radio>
          <el-radio :label="true">分区分析</el-radio>
        </el-radio-group>
        <el-input v-model="partname" style="width: 100px"/>
      </el-form-item>
      <el-form-item label="">
        <el-radio-group v-model="componentForm.is_lock">
          <el-radio :label="true">分析后锁定</el-radio>
          <el-radio :label="false">分析后不锁定</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" type="primary" @click="submitForm('ruleForm')">执行分析</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    componentForm: {
      estimate_percent: 0,
      degree: 10,
      no_invalidate: false,
      is_lock: false
    },
    defaultPercent: true,
    is_all: false,
    partname: ''
  }),
  methods: {
    submitForm() {
      const componentForm = {
        ...this.componentForm
      }
      if (this.is_all) {
        componentForm.partname = this.partname
      } else {
        componentForm.is_all = false
      }
      this.$emit('confirm', componentForm)
    },
    defaultPercentMethod(val) {
      if (val) {
        this.componentForm.estimate_percent = 0
      }
    },
    init() {
      this.$refs.componentForm.reset()
    }
  }
}
</script>
