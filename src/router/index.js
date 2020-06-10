import Vue from 'vue'
import VueRouter from 'vue-router'

/** 导入element-UI信息提示组件 */
import { Message } from 'element-ui'

Vue.use(VueRouter)

/** 按需导入后台系统功能组件 */
const routes = [
  { path: '', redirect: '/login' },
  { path: '/init', component: () => import('../components/init') },
  { path: '/login', component: () => import('../components/login') },
  {
    path: '/admin',
    component: () => import('../components/admin'),
    children: [
      { path: '/admin', component: () => import('../components/admin/index') },
      { path: '/admin/modifyAccount', component: () => import('../components/admin/modifyAccount') },
      { path: '/admin/modifyPassWord', component: () => import('../components/admin/modifyPassWord') },
      { path: '/admin/modifyTeacher', component: () => import('../components/admin/modifyTeacher') },
      { path: '/admin/professionManage', component: () => import('../components/admin/professionManage') },
      { path: '/admin/classesManage', component: () => import('../components/admin/classesManage') },
      { path: '/admin/enterpriseManage', component: () => import('../components/admin/enterpriseManage') },
      { path: '/admin/postManage', component: () => import('../components/admin/postManage') },
      { path: '/admin/studentData', component: () => import('../components/admin/studentData') },
      { path: '/admin/postTrack', component: () => import('../components/admin/postTrack') },
      { path: '/admin/sexRatio', component: () => import('../components/admin/sexRatio') },
      { path: '/admin/unemployedRate', component: () => import('../components/admin/unemployedRate') },
      { path: '/admin/salaryList', component: () => import('../components/admin/salaryList') },
      { path: '/admin/workArea', component: () => import('../components/admin/workArea') },
      { path: '/admin/workDirection', component: () => import('../components/admin/workDirection') },
      { path: '/admin/updateLogs', component: () => import('../components/admin/updateLogs') },
      { path: '/admin/systemLogs', component: () => import('../components/admin/systemLogs') }
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
