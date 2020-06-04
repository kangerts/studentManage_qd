<template>
  <el-form
    :model="modifyTeacher"
    :rules="rulesForm"
    label-width="100px"
    ref="modifyTeacherForm"
  >
    <el-form-item
      label="原教师名"
      prop="oldUsername"
    >
      <el-input
        clearable
        prefix-icon="el-icon-c-scale-to-original"
        v-model="modifyTeacher.oldUsername"
      />
    </el-form-item>
    <el-form-item
      label="新教师名"
      prop="newusername"
    >
      <el-input
        clearable
        prefix-icon="el-icon-c-scale-to-original"
        v-model="modifyTeacher.newusername"
      />
    </el-form-item>
    <el-form-item
      label="确认教师名"
      prop="enterUsername"
    >
      <el-input
        clearable
        prefix-icon="el-icon-c-scale-to-original"
        v-model="modifyTeacher.enterUsername"
      />
    </el-form-item>
    <el-form-item>
      <el-button
        :loading="isLoading"
        @click="submitForm"
        type="primary"
      >
        修改教师名称
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'ModifyTeacher',
  data () {
    // 校验密码是否一致
    var enterUsername = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入教师名称'))
      } else if (value !== this.modifyTeacher.newusername) {
        callback(new Error('两次输入的教师名称不一致!'))
      } else {
        callback()
      }
    }
    return {
      // 是否设置加载状态
      isLoading: false,
      modifyTeacher: {
        oldUsername: '',
        newusername: '',
        enterUsername: ''
      },
      // 长度校验
      rulesForm: {
        oldUsername: [
          { required: true, message: '请输入原始教师名称', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ],
        newusername: [
          { required: true, message: '请输入新教师名称', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ],
        enterUsername: [
          { validator: enterUsername, trigger: 'blur' },
          { required: true, message: '请确认新教师名称', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  // 方法绑定
  methods: {
    // 表单提交方法
    async submitForm () {
      const message = this.$message
      this.$refs.modifyTeacherForm.validate(async valid => {
        // 判断是否合法
        if (valid) {
          // 设置按钮状态
          this.isLoading = true
          // 获取表单数据
          let data = this.modifyTeacher
          let formData = JSON.stringify({
            'useraction': 'userModifyTeacher',
            'username': window.sessionStorage.getItem('username'),
            'teachername': data.oldUsername,
            'newusername': data.enterUsername
          })
          // 提交表单
          const result = await this.$http.post('/user/', formData)
          // 判断业务逻辑
          if (result.data.ret === 0) {
            message({ message: result.data.data, type: 'success', showClose: true, center: true })
            this.isLoading = false
          }
          if (result.data.ret === 1) {
            message({ message: result.data.data, type: 'error', showClose: true, center: true })
            this.isLoading = false
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .el-header {
    background-color: #409EFF;
    color: white;
    font-size: 25px;
    text-align: center;
    line-height: 60px;
  }

  .el-main {
    margin-top: 50px;
    align-self: center;
    background-color: white;
    color: #333;
    text-align: center;
    line-height: 160px;
    width: 350px;
    border-radius: 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
  }

  .el-form {
    width: 300px;
    height: 230px;
    margin: 0 auto;
  }
</style>
