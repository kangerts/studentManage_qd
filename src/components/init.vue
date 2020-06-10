<template>
  <el-container id="init">
    <el-header>学生就业管理系统</el-header>
    <el-form
      ref="initForm"
      :model="initForm"
      :rules="rulesInitForm"
      label-width="80px"
    >
      <el-form-item
        label="用户名称"
        prop="username"
      >
        <el-input
          prefix-icon="el-icon-user-solid"
          v-model="initForm.username"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="教师名称"
        prop="teachername"
      >
        <el-input
          prefix-icon="el-icon-user-solid"
          v-model="initForm.teachername"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="用户密码"
        prop="password"
      >
        <el-input
          prefix-icon="el-icon-c-scale-to-original"
          v-model="initForm.password"
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
          v-model="initForm.enterpassword"
          show-password
          clearable
        />
      </el-form-item>
      <el-button
        ref="initButton"
        type="primary"
        @click="submitForm"
      >
        初始化
      </el-button>
    </el-form>
  </el-container>
</template>

<script>
export default {
  name: 'Init',
  data () {
    // 校验密码是否一致
    var enterpassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.initForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      initForm: {
        username: '',
        teachername: '',
        password: '',
        enterpassword: ''
      },
      // 长度校验
      rulesInitForm: {
        username: [
          { required: true, message: '请输入账户名称', trigger: 'blur' },
          { min: 6, max: 21, message: '长度在 6 到 21 个字符', trigger: 'blur' }
        ],
        teachername: [
          { required: true, message: '请输入教师名称', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入账户密码', trigger: 'blur' },
          { min: 6, max: 21, message: '长度在 6 到 21 个字符', trigger: 'blur' }
        ],
        enterpassword: [
          { validator: enterpassword, trigger: 'blur' },
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
      // 提交表单
      const result = await this.$http.post('/user/', formData)
      // 判断业务逻辑
      if (result.data.ret === 0) {
        this.$message({ message: result.data.data, type: 'success', showClose: true, center: true })
        this.$router.push('login')
      }
      if (result.data.ret === 1) {
        this.$message({ message: result.data.data, type: 'warning', showClose: true, center: true })
      }
    },
    // 表单提交方法
    submitForm () {
      // 设置按钮状态
      var initButton = this.$refs.initButton
      this.$refs.initForm.validate(async valid => {
        // 判断是否合法
        if (valid) {
          initButton.loading = true

          // 获取表单数据
          const formData = JSON.stringify({
            useraction: 'systemInit',
            ...this.initForm
          })
          // 提交表单
          const result = await this.$http.post('/user/', formData)
          // 判断业务逻辑
          if (result.data.ret === 0) {
            this.$message({ message: result.data.data, type: 'success', showClose: true, center: true })
            await this.$router.push('login')
          } else if (result.data.ret === 1) {
            this.$message({ message: result.data.data, type: 'warning', showClose: true, center: true })
            await this.$router.push('login')
          } else if (result.data.ret === 2) {
            this.$message({ message: result.data.data, type: 'error', showClose: true, center: true })
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
    height: 420px;
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

  #init {
    height: 100%;
    background: url('../assets/img/bg.jpg') no-repeat;
    background-size: 100%;
  }

</style>
