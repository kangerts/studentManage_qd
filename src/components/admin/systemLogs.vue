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
          @input="getSystemLogsData"
          clearable
        >
          <el-select
            v-model="queryInfo.queryType"
            slot="prepend"
            placeholder="搜索类型"
          >
            <el-option
              label="暂无搜索"
              value="noSearch"
            />
            <el-option
              label="操作账户"
              value="operationUser"
            />
            <el-option
              label="操作类型"
              value="operationType"
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
      row-style="height:35px"
    >
      <el-table-column
        :key="table.prop"
        v-for="table in tableHeader"
        :width="table.width"
        :label="table.label"
        :prop="table.prop"
        align="center"
      />
      <el-table-column
        width="160"
        :formatter="dateFormatter"
        label="创建时间"
        prop="addTime"
        align="center"
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
            content="恢复数据(可恢复此条数据)"
            placement="top"
          >
            <el-button
              type="primary"
              icon="el-icon-refresh"
              circle
              :disabled="scope.row.operationType.indexOf('删除') !== -1 ? false: true"
              @click="dataRecoveryDialog(scope.row)"
            />
          </el-tooltip>
          <el-tooltip
            effect="dark"
            content="删除数据(彻底删除本条数据)"
            placement="top"
          >
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              @click="deleteSystemLogsDialog(scope.row.logCode)"
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
    <!--    恢复数据对话框-->
    <el-dialog
      title="恢复数据"
      :visible.sync="dataRecoveryDialogVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <span>确认恢复此条数据吗?</span>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dataRecoveryDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="dataRecovery"
        >恢复数据</el-button>
      </span>
    </el-dialog>
    <!--    删除操作日志对话框-->
    <el-dialog
      title="清空日志"
      :visible.sync="deleteSystemLogsDialogVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <span>确认删除吗?</span>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="deleteSystemLogsDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="deleteSystemLogs"
        >删除日志</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'SystemLogs',
  data () {
    return {
      /** 数据表格 */
      // 数据表格数据绑定
      queryInfo: {
        // 当前搜索关键字
        keyWord: '',
        // 当前搜索类型
        queryType: 'noSearch',
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
        { label: '日志编号', prop: 'logCode', width: 80 },
        { label: '操作账户', prop: 'operationUser', width: 120 },
        { label: '操作类型', prop: 'operationType', width: 120 },
        { label: '数据记录', prop: 'dataRecord' }
      ],
      /** 恢复数据对话框是否显示 */
      dataRecoveryDialogVisible: false,
      /** 删除操作日志对话框是否显示 */
      deleteSystemLogsDialogVisible: false
    }
  },
  /** 生命周期函数 */
  created () {
    // 这里是发起表格数据请求的位置
    this.getSystemLogsData()
  },
  watch: {
    'queryInfo.queryType': function (val) {
      if (val === 'noSearch') {
        this.getSystemLogsData()
      }
    }
  },
  /** 事件处理函数 */
  methods: {
    /** 修复当用户在大于1的分页进行数据搜索没有返回值的问题 */
    setPageNum () {
      this.queryInfo.pageNum = 1
      this.getSystemLogsData()
    },
    /** 删除系统操作日志 */
    deleteSystemLogsDialog (logCode) {
      this.deleteSystemLogsDialogVisible = true
      this.logCode = logCode
    },
    async deleteSystemLogs () {
      const formData = JSON.stringify({
        useraction: 'deleteSystemLogsData',
        username: window.sessionStorage.getItem('username'),
        logCode: this.logCode
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
        this.deleteSystemLogsDialogVisible = false
        this.getSystemLogsData()
      } else {
        this.$message({ message: result.data.data, type: 'error', showClose: true, center: true })
      }
    },

    /** 数据恢复操作 */
    dataRecoveryDialog (data) {
      this.dataRecoveryDialogVisible = true
      this.rowDataRecovery = data
    },
    async dataRecovery () {
      const formData = JSON.stringify({
        useraction: 'systemDataRecovery',
        username: window.sessionStorage.getItem('username'),
        data: this.rowDataRecovery
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
        this.dataRecoveryDialogVisible = false
        this.getSystemLogsData()
      } else {
        this.$message({ message: result.data.data, type: 'error', showClose: true, center: true })
      }
    },

    /** 获取系统操作日志列表数据 */
    async getSystemLogsData () {
      const formData = JSON.stringify({
        useraction: 'getSystemLogsData',
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
      this.$message({ message: '读取数据失败！', type: 'error', showClose: true, center: true })
    },

    /** 时间格式化 */
    dateFormatter: function (row, column) {
      var date = row[column.property]
      if (date === undefined) return ''
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    },

    /** 监听每页显示多少数据的改变 */
    handleSizeChange (newSize) {
      this.queryInfo.pageSize = newSize
      this.getSystemLogsData()
    },
    /** 监听页码的改变 */
    handleCurrentChange (newPage) {
      this.queryInfo.pageNum = newPage
      this.getSystemLogsData()
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
