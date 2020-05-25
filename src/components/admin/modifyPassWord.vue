<template>
  <el-form
    ref="initForm"
    :model="modifyPassWord"
    :rules="rulesForm"
    label-width="80px"
  >
    <el-form-item
      label="原始密码"
      prop="oldPassword"
    >
      <el-input
        prefix-icon="el-icon-c-scale-to-original"
        v-model="modifyPassWord.oldPassword"
        show-password
        clearable
      />
    </el-form-item>
    <el-form-item
      label="新密码"
      prop="password"
    >
      <el-input
        prefix-icon="el-icon-c-scale-to-original"
        v-model="modifyPassWord.password"
        show-password
        clearable
      />
    </el-form-item>
    <el-form-item
      label="确认密码"
      prop="enterpassword"
    >
      <el-input
        prefix-icon="el-icon-c-scale-to-original"
        v-model="modifyPassWord.enterpassword"
        show-password
        clearable
      />
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        :loading="isLoading"
        @click="submitForm"
      >
        修改密码
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'ModifyPassWord',
  data () {
    // 校验密码是否一致
    var enterpassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.modifyPassWord.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      // 是否设置加载状态
      isLoading: false,
      modifyPassWord: {
        oldPassword: '',
        password: '',
        enterpassword: ''
      },
      // 长度校验
      rulesForm: {
        oldPassword: [
          // {validator: username, trigger: 'blur'},
          { required: true, message: '请输入原始密码', trigger: 'blur' },
          { min: 6, max: 21, message: '长度在 6 到 21 个字符', trigger: 'blur' }
          // {pattern: /^[A-Za-z]+[0-9]+[A-Za-z0-9]*|[0-9]+[A-Za-z]+[A-Za-z0-9]*$/, message: '密码必须由6-16个英文字母和数字的字符串组成！'}
        ],
        password: [
          // {validator: password, trigger: 'blur'},
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, max: 21, message: '长度在 6 到 21 个字符', trigger: 'blur' }
          // {pattern: /^[A-Za-z]+[0-9]+[A-Za-z0-9]*|[0-9]+[A-Za-z]+[A-Za-z0-9]*$/, message: '密码必须由6-16个英文字母和数字的字符串组成！'}
        ],
        enterpassword: [
          { validator: enterpassword, trigger: 'blur' },
          { required: true, message: '请确认新密码', trigger: 'blur' },
          { min: 6, max: 21, message: '长度在 6 到 21 个字符', trigger: 'blur' }
          // {pattern: /^[A-Za-z]+[0-9]+[A-Za-z0-9]*|[0-9]+[A-Za-z]+[A-Za-z0-9]*$/, message: '密码必须由6-16个英文字母和数字的字符串组成！'}
        ]
      }
    }
  },
  // 方法绑定
  methods: {
    // 表单提交方法
    async submitForm () {
      const message = this.$message
      this.$refs.initForm.validate(async valid => {
      // 判断是否合法
        if (valid) {
          // 设置按钮状态
          this.isLoading = true
          // 获取表单数据
          let data = this.modifyPassWord
          let formData = JSON.stringify({
            'useraction': 'userModifyPass',
            'username': window.sessionStorage.getItem('username'),
            'oldPassword': data.oldPassword,
            'password': data.password
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
