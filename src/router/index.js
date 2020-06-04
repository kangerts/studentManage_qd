import Vue from 'vue'
import VueRouter from 'vue-router'

/** 导入element-UI信息提示组件 */
import { Message } from 'element-ui'

/** 按需导入后台系统功能组件 */
const init = () => import('../components/init')
const login = () => import('../components/login')
const admin = () => import('../components/admin')
const index = () => import('../components/admin/index')
const modifyAccount = () => import('../components/admin/modifyAccount')
const modifyPassWord = () => import('../components/admin/modifyPassWord')
const professionManage = () => import('../components/admin/professionManage')
const classesManage = () => import('../components/admin/classesManage')
const enterpriseManage = () => import('../components/admin/enterpriseManage')
const postManage = () => import('../components/admin/postManage')
const studentData = () => import('../components/admin/studentData')
const postTrack = () => import('../components/admin/postTrack')
const sexRatio = () => import('../components/admin/sexRatio')
const unemployedRate = () => import('../components/admin/unemployedRate')
const salaryList = () => import('../components/admin/salaryList')
const workArea = () => import('../components/admin/workArea')
const workDirection = () => import('../components/admin/workDirection')
const updateLogs = () => import('../components/admin/updateLogs')
const systemLogs = () => import('../components/admin/systemLogs')

Vue.use(VueRouter)

const routes = [
  {
    // 系统根路径
    path: '',
    redirect: '/login'
  },
  {
    // 系统初始化组件
    path: '/init',
    component: init
  },
  {
    // 系统用户登录组件
    path: '/login',
    component: login
  },
  {
    // 系统后台登录组件
    path: '/admin',
    component: admin,
    // 添加子路由
    children: [
      { path: '/admin', component: index },
      { path: '/admin/modifyAccount', component: modifyAccount },
      { path: '/admin/modifyPassWord', component: modifyPassWord },
      { path: '/admin/professionManage', component: professionManage },
      { path: '/admin/classesManage', component: classesManage },
      { path: '/admin/enterpriseManage', component: enterpriseManage },
      { path: '/admin/postManage', component: postManage },
      { path: '/admin/studentData', component: studentData },
      { path: '/admin/postTrack', component: postTrack },
      { path: '/admin/sexRatio', component: sexRatio },
      { path: '/admin/unemployedRate', component: unemployedRate },
      { path: '/admin/salaryList', component: salaryList },
      { path: '/admin/workArea', component: workArea },
      { path: '/admin/workDirection', component: workDirection },
      { path: '/admin/updateLogs', component: updateLogs },
      { path: '/admin/systemLogs', component: systemLogs }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to:将要访问的路径  from:从哪里过来的   next:放行函数-> next()   next('跳转路径')
  /** 登录,初始化页面不需要拒绝 */
  if (to.path === '/login' || to.path === '/init') {
    return next()
  }

  /** 其他页面需要登录 */
  const session = window.sessionStorage.getItem('username')
  if (session === undefined || session === '' || !session) {
    Message({ message: '用户未登录，请重新登录', type: 'warning', showClose: true, center: true })
    return next('/login')
  }
  next()
})

export default router
