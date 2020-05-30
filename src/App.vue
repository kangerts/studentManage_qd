<template>
  <div
    id="app"
    @click="checkTimeOut()"
    @mouseenter="checkTimeOut()"
    @mousemove="checkTimeOut"
  >
    <!--路由占位符-->
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      lastTime: null, // 最后一次点击的时间
      currentTime: null, // 当前点击的时间
      timeOut: 30 * 60 * 1000 // 设置超时时间： 30分钟
    }
  },
  methods: {
    async checkTimeOut () {
      this.currentTime = new Date().getTime() // 记录这次点击的时间
      // 如果当前页面不是登录，初始化界面就可以执行是否退出
      if (!(this.$route.path === '/login' || this.$route.path === '/init')) {
        /** 判断是否因为超时可以退出 */
        // 判断时间是否过期（判断上次最后一次点击的时间和这次点击的时间间隔是否大于10分钟）
        var isExit = this.currentTime - this.lastTime > this.timeOut
        if (isExit) {
          isExit = false
          // 这里写状态已过期后执行的操作
          this.lastTime = new Date().getTime() // 如果在10分钟内点击，则把这次点击的时间记录覆盖掉之前存的最后一次点击的时间
          this.$router.push('/login')
          // 设置用户为登出状态
          let formData = JSON.stringify({
            'useraction': 'userLogout',
            'username': window.sessionStorage.getItem('username')
          })
          // 提交登出请求
          const result = await this.$http.post('/user/', formData)
          if (result.data.ret === 0) {
            // 清除seesion信息
            window.sessionStorage.removeItem('username')
            this.$message({ message: '长时间未操作，请重新登录', type: 'warning', showClose: true, center: true })
          }
        } else {
          /** 判断是否因为用户未登录可以退出 */
          let username = window.sessionStorage.getItem('username')
          if (username === null || username === undefined || username === '') {
            this.$router.push('/login')
            this.$message({ message: '用户未登录，请重新登录', type: 'warning', showClose: true, center: true })
          }
          this.lastTime = new Date().getTime() // 如果在10分钟内点击，则把这次点击的时间记录覆盖掉之前存的最后一次点击的时间
        }
      } else {
        this.lastTime = new Date().getTime() // 如果在10分钟内点击，则把这次点击的时间记录覆盖掉之前存的最后一次点击的时间
      }
    }
  },
  created () {
    this.lastTime = new Date().getTime() // 网页第一次打开时，记录当前时间
  }
}
</script>

<style lang="less" scoped>

</style>
