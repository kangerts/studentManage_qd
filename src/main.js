import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'

// 导入axios数据交互请求
import axios from 'axios'

// 引入vue-echarts
import ECharts from 'vue-echarts'
import 'echarts/map/js/china'

// 使用axios
// axios.defaults.baseURL = 'http://student.free.idcfengye.com/system/'
axios.defaults.baseURL = 'http://127.0.0.1:8000/system/'
Vue.prototype.$http = axios
Vue.config.productionTip = false

// 使用vue-echarts
Vue.component('v-chart', ECharts)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
