<template>
  <div style="width: 100%">
    <!--  头部搜索和创建按钮区域-->
    <el-row :gutter="50">
      <!--    搜索区域列-->
      <el-col :span="8">
        <el-input
          :disabled="!isSearchType"
          v-model="queryInfo.keyWord"
          suffix-icon="el-icon-search"
          class="input-with-select"
          clearable
          @clear="getPostTrackData"
          @focus="setPageNum"
          @input="getPostTrackData"
          placeholder="请输入搜索内容"
        >
          <el-select
            v-model="queryInfo.queryType"
            slot="prepend"
            placeholder="搜索类型"
            id="post-query"
          >
            <el-option
              label="暂无搜索"
              value="noSearch"
            />
            <el-option
              label="学生学号"
              value="studentCode"
            />
            <el-option
              label="学生名称"
              value="studentName"
            />
            <el-option
              label="记录教师"
              value="recordTeacher"
            />
          </el-select>
        </el-input>
      </el-col>
    </el-row>
    <!--  表格数据区域-->
    <el-table
      :data="tableData"
      border
      stripe
      style="width: 100%"
    >
      <el-table-column
        :key="table.prop"
        v-for="table in tableHeader"
        :label="table.label"
        :prop="table.prop"
        align="center"
        :width="table.width"
      />
      <el-table-column
        :formatter="dateFormatter"
        align="center"
        prop="addTime"
        width="180"
        label="记录时间"
      />
      <el-table-column
        label="操作"
        align="center"
        width="200px"
        fixed="right"
      >
        <!--        操作按钮区域的作用域插槽-->
        <template slot-scope="scope">
          <el-tooltip
            effect="dark"
            content="查看数据(可查看本学生所对应的完整数据)"
            placement="top"
          >
            <el-button
              type="info"
              icon="el-icon-view"
              circle
              @click="toStudentDataShow(scope.row.studentCode)"
            />
          </el-tooltip>
          <el-tooltip
            effect="dark"
            content="删除记录(删除本条信息)"
            placement="top"
          >
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              @click="deletePostTrackDialog(scope.row.trackCode)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!--    分页器区域-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pageNum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="queryInfo.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      background
    />
    <!--    删除学生对话框-->
    <el-dialog
      title="删除学生"
      :visible.sync="deletePostTrackDialogVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <span>确认删除吗?</span>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="deletePostTrackDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="deletePostTrack"
        >删除记录</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'PostTrack',
  data () {
    return {
      // 显示学生数据是否附带显示类型
      isSearchType: false,
      // 数据表格数据绑定
      queryInfo: {
        // 当前搜索关键字
        keyWord: '',
        // 当前页数
        pageNum: 1,
        // 当前每页显示多少条数据
        pageSize: 5,
        // 当前搜索类型
        queryType: 'noSearch'
      },
      // 数据表格数据
      tableData: [],
      // 总共多少条数据
      total: 0,
      tableHeader: [
        { 'label': '数据编号', 'prop': 'trackCode' },
        { 'label': '学生学号', 'prop': 'studentCode', 'width': 200 },
        { 'label': '学生名称', 'prop': 'studentName', 'width': 200 },
        { 'label': '记录教师', 'prop': 'recordTeacher', 'width': 250 },
        { 'label': '所在企业', 'prop': 'enterpriseName', 'width': 250 },
        { 'label': '最新岗位', 'prop': 'postName', 'width': 200 },
        { 'label': '岗位职责', 'prop': 'postDuty', 'width': 400 },
        { 'label': '最新薪资', 'prop': 'studentSalary' },
        { 'label': '备注', 'prop': 'remarks', 'width': 200 }
      ],
      // 删除岗位跟踪记录
      deletePostTrackDialogVisible: false
    }
  },
  watch: {
    // 当用户选择搜索学生的前置条件则锁定筛选数据类型为全部数据并禁用单选框否则应该清空输入框数据
    'queryInfo.queryType': function (val) {
      if (val !== 'noSearch') {
        this.isSearchType = true
      } else {
        this.isSearchType = false
        this.queryInfo.keyWord = ''
        this.getPostData()
      }
    }
  },
  /** 生命周期函数 */
  created () {
    this.getPostTrackData()
  },
  /** 事件处理函数 */
  methods: {
    /** 获取岗位跟踪数据 */
    async getPostTrackData () {
      let formData = JSON.stringify({
        useraction: 'getPostTrackData',
        username: window.sessionStorage.getItem('username'),
        query: this.queryInfo
      })
      // 提交表单
      const result = await this.$http.post('/data/', formData)
      // 判断业务逻辑
      if (result.data.ret === 0) {
        this.queryInfo.pageNum = result.data.pageNum
        this.total = result.data.total
        this.tableData = result.data.data
        return
      }
      this.$message({
        message: '读取数据失败！',
        type: 'error',
        showClose: true,
        center: true
      })
    },

    /** 删除岗位跟踪数据 */
    deletePostTrackDialog (trackCode) {
      this.deletePostTrackDialogVisible = true
      this.trackCode = trackCode
    },
    async deletePostTrack () {
      let formData = JSON.stringify({
        useraction: 'deletePostTrack',
        username: window.sessionStorage.getItem('username'),
        trackCode: this.trackCode
      })
      // 提交表单
      const result = await this.$http.post('/data/', formData)
      // 判断业务逻辑
      if (result.data.ret === 0) {
        this.$message({
          message: result.data.data,
          type: 'success',
          showClose: true,
          center: true
        })
        this.deletePostTrackDialogVisible = false
        this.getPostTrackData()
      }
      if (result.data.ret === 1) {
        this.$message({
          message: result.data.data,
          type: 'error',
          showClose: true,
          center: true
        })
      }
    },

    /** 跳转到学生数据页面并显示本学生对应的数据 */
    toStudentDataShow (studentCode) {
      this.$router.push({
        path: '/admin/studentData',
        query: {
          studentCode: studentCode
        }
      })
    },

    /** 时间格式化 */
    dateFormatter: function (row, column) {
      var date = row[column.property]
      if (date === undefined) return ''
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    },
    /** 修复当用户在大于1的分页进行数据搜索没有返回值的问题 */
    setPageNum () {
      this.queryInfo.pageNum = 1
      this.getPostTrackData()
    },
    /** 监听每页显示多少数据的改变 */
    handleSizeChange (newSize) {
      this.queryInfo.pageSize = newSize
      this.getPostTrackData()
    },
    /** 监听页码的改变 */
    handleCurrentChange (newPage) {
      this.queryInfo.pageNum = newPage
      this.getPostTrackData()
    }
  }
}
</script>

<style lang="less" scoped>
  .el-table {
    align-items: center;
    margin-top: 25px;
  }

  .el-pagination{
    margin-top: 25px;
  }

  /deep/#post-query {
    width: 120px !important;
  }
</style>
