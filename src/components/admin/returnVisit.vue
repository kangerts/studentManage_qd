<template>
  <div style="width: 100%">
    <!--  头部搜索和创建按钮区域-->
    <el-row :gutter="50">
      <!--    搜索区域列-->
      <el-col :span="8">
        <el-input
          placeholder="请输入关键字"
          v-model="queryInfo.keyWord"
          suffix-icon="el-icon-search"
          class="input-with-select"
          @focus="setPageNum"
          @input="getEmploymentStatusData"
          clearable
        >
          <el-select
            v-model="queryInfo.queryType"
            slot="prepend"
            placeholder="搜索类型"
          >
            <el-option
              label="学生学号"
              value="studentCode"
            />
            <el-option
              label="学生姓名"
              value="studentName"
            />
            <el-option
              label="班级名称"
              value="classesName"
            />
            <el-option
              label="专业名称"
              value="professionName"
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
        :width="table.width"
        :label="table.label"
        :prop="table.prop"
        align="center"
      />
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
  </div>
</template>

<script>
export default {
  name: 'ReturnVisit',
  data () {
    return {
      /** 数据表格 */
      // 数据表格数据绑定
      queryInfo: {
        // 当前搜索关键字
        keyWord: '',
        // 当前搜索类型(例如学号或者名称)
        queryType: '',
        // 当前页数
        pageNum: 1,
        // 当前每页显示多少条数据
        pageSize: 5
      },
      // 数据表格数据
      tableData: [],
      // 总共多少条数据
      total: 0,
      tableHeader: [
        { 'label': '数据标识', 'prop': 'statusID', 'width': '80px' },
        { 'label': '学生学号', 'prop': 'studentCode', 'width': '100px' },
        { 'label': '学生名称', 'prop': 'studentName', 'width': '100px' },
        { 'label': '所属专业', 'prop': 'toProfession', 'width': '180px' },
        { 'label': '所属班级', 'prop': 'toClasses', 'width': '100px' },
        { 'label': '1月回访情况', 'prop': 'data1', 'width': '200px' },
        { 'label': '2月回访情况', 'prop': 'data2', 'width': '200px' },
        { 'label': '3月回访情况', 'prop': 'data3', 'width': '200px' },
        { 'label': '4月回访情况', 'prop': 'data4', 'width': '200px' },
        { 'label': '5月回访情况', 'prop': 'data5', 'width': '200px' },
        { 'label': '6月回访情况', 'prop': 'data6', 'width': '200px' },
        { 'label': '7月回访情况', 'prop': 'data7', 'width': '200px' },
        { 'label': '8月回访情况', 'prop': 'data8', 'width': '200px' },
        { 'label': '9月回访情况', 'prop': 'data9', 'width': '200px' },
        { 'label': '10月回访情况', 'prop': 'data10', 'width': '200px' },
        { 'label': '11月回访情况', 'prop': 'data11', 'width': '200px' },
        { 'label': '12月回访情况', 'prop': 'data12', 'width': '200px' },
        { 'label': '创建时间', 'prop': 'addTime', 'width': '100px' }
      ]
    }
  },
  /** 生命周期函数 */
  created () {
    // 这里是发起表格数据请求的位置
    this.getEmploymentStatusData()
  },
  /** 事件处理函数 */
  methods: {
    /** 修复当用户在大于1的分页进行数据搜索没有返回值的问题 */
    setPageNum () {
      this.queryInfo.pageNum = 1
      this.getEmploymentStatusData()
    },

    /** 获取就业状态页面的专业列表数据 */
    async getEmploymentStatusData () {
      let formData = JSON.stringify({
        'useraction': 'getEmploymentStatusData',
        'username': window.sessionStorage.getItem('username'),
        'query': this.queryInfo
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
      this.$message({ message: '读取数据失败！', type: 'error', showClose: true, center: true })
    },
    /** 监听每页显示多少数据的改变 */
    handleSizeChange (newSize) {
      this.queryInfo.pageSize = newSize
      this.getEmploymentStatusData()
    },
    /** 监听页码的改变 */
    handleCurrentChange (newPage) {
      this.queryInfo.pageNum = newPage
      this.getEmploymentStatusData()
    }
  }
}
</script>

<style lang="less" scoped>
  .input-select {
    width: 130px;
  }

  .el-select {
    width: 120px;
  }

  .el-table {
    align-items: center;
    margin-top: 25px;
  }

  .el-pagination {
    margin-top: 25px;
  }
</style>
