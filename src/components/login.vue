<template>
  <el-container id="login">
    <el-header>学生就业管理系统</el-header>
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="rulesLoginForm"
      label-width="80px"
    >
      <el-form-item
        label="用户名称"
        prop="username"
      >
        <el-input
          prefix-icon="el-icon-user-solid"
          v-model="loginForm.username"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="用户密码"
        prop="password"
      >
        <el-input
          prefix-icon="el-icon-c-scale-to-original"
          v-model="loginForm.password"
          show-password
          clearable
        />
      </el-form-item>
      <el-button
        ref="loginButton"
        type="primary"
        @click="submitForm"
      >
        教师登录
      </el-button>
    </el-form>
  </el-container>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      loginForm: {
        username: '',
        password: '',
        enterpassword: ''
      },
      // 长度校验
      rulesLoginForm: {
        username: [
          { required: true, message: '请输入账户名称', trigger: 'blur' },
          { min: 6, max: 21, message: '长度在 6 到 21 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入账户密码', trigger: 'blur' },
          { min: 6, max: 21, message: '长度在 6 到 21 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  // 方法绑定
  methods: {
    // 检测是否初始化系统
    async isSysteInit () {
      const formData = JSON.stringify({ useraction: 'isSystemInit' })
      const result = await this.$http.post('/user/', formData)
      // 判断业务逻辑
      if (result.data.ret === 1) {
        this.$router.push('init')
      }
    },
    // 表单提交方法
    submitForm () {
      // 设置按钮状态
      const message = this.$message
      const route = this.$router
      this.$refs.loginForm.validate(async valid => {
        var loginButton = this.$refs.loginButton
        // 判断是否合法
        if (valid) {
          loginButton.loading = true
          const formData = JSON.stringify({
            useraction: 'userLogin',
            ...this.loginForm
          })
          // 提交表单
          const result = await this.$http.post('/user/', formData)
          if (result.data.ret === 0) {
            loginButton.loading = false
            // 登录成功保存用户账号
            window.sessionStorage.setItem('username', this.loginForm.username)
            message({ message: result.data.data, type: 'success', showClose: true, center: true })
            route.push('/admin')
          } else if (result.data.ret === 1) {
            loginButton.loading = false
            message({ message: result.data.data, type: 'error', showClose: true, center: true })
          }
        }
      })
    }
  },
  created () {
    // 自动加载isSysteInit方法
    this.isSysteInit()
  }
}
</script>

<style lang="less" scoped>
  .el-header {
    color: white;
    font-size: 25px;
    text-align: center;
    line-height: 60px;
  }

  .el-form {
    padding: 20px;
    background-color: white;
    margin: 0 auto;
    width: 300px;
    height: 280px;
    margin-top: 50px;
    color: #333;
    text-align: center;
    line-height: 180px;
    border-radius: 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    > div {
      margin: 28px 0;
    }
  }

  #login {
    height: 100%;
    background: url('../assets/img/bg.jpg') no-repeat;
    background-size: 100%;
  }
</style>
