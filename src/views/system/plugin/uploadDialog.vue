<template>
  <el-dialog :visible="uploadShow" title="上传插件" class="dialog" :before-close="cancelAddForm">
    <el-form
      ref="addForm"
      class="add-form"
      :model="addForm"
      label-position="left"
      label-width="80px"
      size="small"
    >
      <el-form-item prop="file">
        <el-upload
          ref="fileUpload"
          class="upload-demo"
          drag
          action
          :http-request="uploadFile"
          :before-upload="beforeUpload"
          :on-remove="handleRemove"
          :limit="1"
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击上传</em>
          </div>
        </el-upload>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="cancelAddForm('addForm')">取 消</el-button>
      <el-button type="primary" size="small" @click="submitAddForm('addForm')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { uploadPlugin } from '@/api/plugin'
export default {
  data() {
    return {
      uploadShow: false,
      addForm: { file: '' }
    }
  },
  methods: {
    show() {
      this.uploadShow = true
    },
    uploadFile(params) {
      this.addForm.file = params.file
    },
    handleRemove(file, fileList) {
      this.addForm.file = ''
    },
    cancelAddForm() {
      this.$refs.fileUpload.clearFiles()
      this.uploadShow = false
    },
    submitAddForm() {
      if (this.addForm.file === '') {
        this.$message.warning('请上传资源')
      } else {
        const formData = new FormData()
        formData.append('files', this.addForm.file)
        uploadPlugin(formData).then(res => {
          this.$message.success('新增成功！')
          this.uploadShow = false
          this.$refs.fileUpload.clearFiles()
        })
      }
    },
    beforeUpload(file) {
      console.log(file.type)
      if (file.type !== 'application/x-zip-compressed') {
        this.$message.error('只能上传zip格式文件')
        return false
      }
    }
  }
}
</script>

<style scoped>
.upload-demo {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
