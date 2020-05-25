import Vue from 'vue'
// 按需导入相关组件
import {
  Button, Container, Main, Header, Aside,
  Form, FormItem, Input, Alert, Message, Menu,
  Submenu, MenuItem, Tabs, TabPane, Card, Timeline,
  TimelineItem, Row, Col, Progress, Select, Option,
  Tooltip, Table, TableColumn, Pagination, Dialog,
  DatePicker, Cascader, Radio, RadioGroup
} from 'element-ui'
// 导入完成必须使用
Vue.use(Button)
Vue.use(Container)
Vue.use(Main)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Alert)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Card)
Vue.use(Timeline)
Vue.use(TimelineItem)
Vue.use(Row)
Vue.use(Col)
Vue.use(Progress)
Vue.use(Select)
Vue.use(Option)
Vue.use(Tooltip)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(DatePicker)
Vue.use(Cascader)
Vue.use(Radio)
Vue.use(RadioGroup)

// 挂载Message到Vue原形原型
Vue.prototype.$message = Message
