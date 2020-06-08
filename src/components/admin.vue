<template>
  <el-container class="admin-container">
    <!--页面头部(上边)-->
    <el-header>
      <div
        class="admin-logo-container"
        :style="isCollapse ? 'width:65px' : 'width:230px'"
      >
        <img
          class="admin-logo"
          src="../assets/img/admin.png"
          alt=""
        >
        <span :style="isCollapse ? 'display: none' : 'display: block'">就业管理</span>
      </div>
      <div class="toggle-button-container">
        <!--折叠按钮-->
        <div
          class="toggle-button"
          @click="toggleCollapse"
        >
          <i
            :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"
          />
        </div>
      </div>
      <div class="right-function-container">
        <el-button @click="logout">
          退出
        </el-button>
      </div>
    </el-header>
    <!--页面主体部分-->
    <el-container>
      <!--页面侧边栏(左边)-->
      <el-aside :width="isCollapse ? '65px' : '230px'">
        <!--        页面左侧菜单区域-->
        <el-menu
          :collapse="isCollapse"
          :default-active="$route.path"
          background-color="#EEF1F6"
          text-color="#48576a"
          active-text-color="#409EFF"
          :unique-opened="true"
          :collapse-transition="false"
          :router="true"
        >
          <el-menu-item
            index="/admin"
            @click="addTab('系统首页', '/admin')"
          >
            <i class="el-icon-s-home" />
            <span slot="title">系统首页</span>
          </el-menu-item>
          <!--          一级菜单-->
          <el-submenu
            :index="item.id+''"
            v-for="(item, index) in menuList"
            :key="index"
          >
            <!--          一级菜单模板区-->
            <template slot="title">
              <!--              图标-->
              <i :class="item.icon" />
              <!--              文本-->
              <span>{{ item.subMenuName }}</span>
            </template>
            <!--            二级菜单-->
            <el-menu-item
              :index="subItem.path+''"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="addTab(subItem.subMenuName, subItem.path)"
            >
              <!--          二级菜单模板区-->
              <template slot="title">
                <!--              图标-->
                <i class="el-icon-bangzhu" />
                <!--              文本-->
                <span>{{ subItem.subMenuName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 页面主内容(右边)-->
      <el-main>
        <el-tabs
          v-model="activeTabas"
          type="card"
          @tab-remove="removeTab"
          @tab-click="tabClick"
        >
          <el-tab-pane
            v-for="item in Tabs"
            :key="item.name"
            :label="item.title"
            :name="item.name"
            :closable="item.isClose"
          >
            <el-container>
              <el-main>
                <el-card shadow="always">
                  <!--            内容显示-->
                  <router-view :key="item.name" />
                </el-card>
              </el-main>
            </el-container>
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Admin',
  data () {
    return {
      /** tabs标签相关属性 */
      // 当前打开的tabs名称
      activeTabas: '/admin',
      Tabs: [{
        title: '系统首页',
        name: '/admin'
      }],
      /** 左侧菜单属性 */
      isCollapse: false,
      // 左侧菜单数据
      menuList: [
        {
          'icon': 'el-icon-user-solid',
          'subMenuName': '教师账户',
          'children': [
            { 'id': '1-1', 'subMenuName': '账户修改', 'path': '/admin/modifyAccount' },
            { 'id': '1-2', 'subMenuName': '密码修改', 'path': '/admin/modifyPassWord' },
            { 'id': '1-3', 'subMenuName': '教师修改', 'path': '/admin/modifyTeacher' }
          ]
        },
        {
          'icon': 'el-icon-s-shop',
          'subMenuName': '基本信息',
          'children': [
            { 'id': '2-1', 'subMenuName': '专业管理', 'path': '/admin/professionManage' },
            { 'id': '2-2', 'subMenuName': '班级管理', 'path': '/admin/classesManage' },
            { 'id': '2-3', 'subMenuName': '企业管理', 'path': '/admin/enterpriseManage' },
            { 'id': '2-4', 'subMenuName': '岗位管理', 'path': '/admin/postManage' }

          ]
        },
        {
          'icon': 'el-icon-s-order',
          'subMenuName': '学生信息',
          'children': [
            { 'id': '3-1', 'subMenuName': '学生数据', 'path': '/admin/studentData' },
            { 'id': '3-2', 'subMenuName': '岗位追踪', 'path': '/admin/postTrack' }
          ]
        },
        {
          'icon': 'el-icon-s-data',
          'subMenuName': '数据统计',
          'children': [
            { 'id': '4-1', 'subMenuName': '男女比例', 'path': '/admin/sexRatio' },
            { 'id': '4-2', 'subMenuName': '就业情况', 'path': '/admin/unemployedRate' },
            { 'id': '4-3', 'subMenuName': '工资榜单', 'path': '/admin/salaryList' },
            { 'id': '4-4', 'subMenuName': '工作区域', 'path': '/admin/workArea' },
            { 'id': '4-5', 'subMenuName': '就业方向', 'path': '/admin/workDirection' }
          ]
        },
        {
          'icon': 'el-icon-s-tools',
          'subMenuName': '系统设置',
          'children': [
            { 'id': '5-1', 'subMenuName': '更新日志', 'path': '/admin/updateLogs' },
            { 'id': '5-2', 'subMenuName': '操作日志', 'path': '/admin/systemLogs' }
          ]
        }
      ]
    }
  },
  watch: {
    /** 监听,当路由发生变化的时候执行(防止用户手动更换地址导致tabs的面板变动却不切换相应的tabs) */
    '$route': function () {
      var iindex = -1
      var jindex = -1
      for (let i = 0; i < this.menuList.length; i++) {
        for (let j = 0; j < this.menuList[i].children.length; j++) {
          if (this.menuList[i].children[j].path === this.$route.path) {
            this.activeTabas = name
            iindex = i
            jindex = j
            break
          }
        }
      }
      if (this.$route.path === '/admin') {
        this.activeTabas = '/admin'
        return
      }
      this.addTab(this.menuList[iindex].children[jindex].subMenuName, this.$route.path)
    }
  },
  created () {
    // 保证admin中的页面刷新后重置到/admin路由下
    if (this.$route.path !== '/admin') this.$router.push('/admin')
  },
  methods: {
    /** tabs标签相关函数 */
    // tab切换时，动态的切换路由
    tabClick (tab) {
      if (this.$route.path === tab.name) return
      this.$router.push(tab.name)
    },
    addTab (title, name) {
      for (let i = 0; i < this.Tabs.length; i++) {
        if (this.Tabs[i].name === name) {
          this.activeTabas = name
          return
        }
      }
      this.Tabs.push({
        title: title,
        name: name,
        isClose: 'closable'
      })
      this.activeTabas = name
    },
    removeTab (targetName) {
      let tabs = this.Tabs
      let activeName = this.activeTabas
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeName = nextTab.name
            }
          }
        })
      }
      this.activeTabas = activeName
      this.$router.push(activeName)
      this.Tabs = tabs.filter(tab => tab.name !== targetName)
    },
    /** 设置用户为登出状态 */
    async logout () {
      let formData = JSON.stringify({
        'useraction': 'userLogout',
        'username': window.sessionStorage.getItem('username')
      })
      // 提交登出请求
      const result = await this.$http.post('/user/', formData)
      if (result.data.ret === 0) {
        this.$router.push('login')
        // 清除seesion信息
        window.sessionStorage.removeItem('username')
        this.$message({ message: result.data.data, type: 'warning', showClose: true, center: true })
      }
    },
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style lang="less" scoped>
  .admin-container {
    height: 100%;
  }

  .el-main{
    padding-top: 8px !important;
  }
  .admin-logo-container {
    border-color: #5EB9DE;
    border-right-width: 1px;
    border-right-style: solid;
  }

  .admin-logo {
    margin-left: 5px;
    height: 55px;
    width: 55px;
    /*自动等比缩放*/
    background-size: 100% 100%;
  }

  .el-header {
    background-color: #409eff;
    width: 100%;
    color: white;
    font-size: 25px;
    display: flex;
    padding-left: 0;
  }

  .admin-logo-container {
    display: flex;
    align-items: center;

    span {
      margin-left: 15px;
    }
  }

  .el-aside {
    background-color: #EEF1F6;
  }

  .toggle-button-container {
    width: 180px;
    display: flex;
    justify-content: left;
  }

  .toggle-button {
    width: 50px;
    line-height: 60px;
    color: #fff;
    text-align: center;
    cursor: pointer;
  }

  .right-function-container {
    width: 400px;
    line-height: 50px;
    text-align: right;
    position: absolute;
    right: 15px;
  }
</style>
