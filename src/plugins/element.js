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

let plugins = [Button, Container, Main, Header, Aside,
  Form, FormItem, Input, Alert, Menu,
  Submenu, MenuItem, Tabs, TabPane, Card, Timeline,
  TimelineItem, Row, Col, Progress, Select, Option,
  Tooltip, Table, TableColumn, Pagination, Dialog,
  DatePicker, Cascader, Radio, RadioGroup]

// 导入完成必须使用
plugins.forEach((item, index) => {
  Vue.use(item)
})

// 挂载Message到Vue原形原型
Vue.prototype.$message = Message
