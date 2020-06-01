<template>
  <el-form
    :model="modifyAccount"
    :rules="rulesForm"
    label-width="80px"
    ref="modifyAccountForm"
  >
    <el-form-item
      label="原始账户"
      prop="oldUsername"
    >
      <el-input
        clearable
        prefix-icon="el-icon-c-scale-to-original"
        v-model="modifyAccount.oldUsername"
      />
    </el-form-item>
    <el-form-item
      label="新账户"
      prop="newusername"
    >
      <el-input
        clearable
        prefix-icon="el-icon-c-scale-to-original"
        v-model="modifyAccount.newusername"
      />
    </el-form-item>
    <el-form-item
      label="确认账户"
      prop="enterUsername"
    >
      <el-input
        clearable
        prefix-icon="el-icon-c-scale-to-original"
        v-model="modifyAccount.enterUsername"
      />
    </el-form-item>
    <el-form-item>
      <el-button
        :loading="isLoading"
        @click="submitForm"
        type="primary"
      >
        修改账户
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'ModifyAccount',
  data () {
    // 校验密码是否一致
    var enterUsername = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入新账户'))
      } else if (value !== this.modifyAccount.newusername) {
        callback(new Error('两次输入的账户不一致!'))
      } else {
        callback()
      }
    }
    return {
      // 是否设置加载状态
      isLoading: false,
      modifyAccount: {
        oldUsername: '',
        newusername: '',
        enterUsername: ''
      },
      // 长度校验
      rulesForm: {
        oldUsername: [
          { required: true, message: '请输入原始账户', trigger: 'blur' },
          { min: 6, max: 21, message: '长度在 6 到 21 个字符', trigger: 'blur' }
        ],
        newusername: [
          { required: true, message: '请输入新账户', trigger: 'blur' },
          { min: 6, max: 21, message: '长度在 6 到 21 个字符', trigger: 'blur' }
        ],
        enterUsername: [
          { validator: enterUsername, trigger: 'blur' },
          { required: true, message: '请确认新账户', trigger: 'blur' },
          { min: 6, max: 21, message: '长度在 6 到 21 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  // 方法绑定
  methods: {
    // 表单提交方法
    async submitForm () {
      const message = this.$message
      this.$refs.modifyAccountForm.validate(async valid => {
        // 判断是否合法
        if (valid) {
          // 设置按钮状态
          this.isLoading = true
          // 获取表单数据
          let data = this.modifyAccount
          let formData = JSON.stringify({
            'useraction': 'userModifyAccount',
            'username': data.oldUsername,
            'newusername': data.enterUsername
          })
          // 提交表单
          const result = await this.$http.post('/user/', formData)
          // 判断业务逻辑
          if (result.data.ret === 0) {
            message({ message: result.data.data, type: 'success', showClose: true, center: true })
            this.isLoading = false
            // 清除seesion信息
            window.sessionStorage.removeItem('username')
            this.$router.push('/login')
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
