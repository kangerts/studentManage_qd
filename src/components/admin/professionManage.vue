<template>
  <div style="width: 100%">
    <!--  头部搜索和创建按钮区域-->
    <el-row :gutter="50">
      <!--    搜索区域列-->
      <el-col :span="7">
        <el-input
          clearable
          @clear="getProfessionData"
          @input="getProfessionData"
          placeholder="请输入专业名称"
          v-model="queryInfo.keyWord"
          prefix-icon="el-icon-search"
        />
      </el-col>
      <!--    按钮区域列-->
      <el-col :span="4">
        <el-row>
          <el-tooltip
            effect="dark"
            content="创建专业(作为班级的容器)"
            placement="top"
          >
            <el-button
              type="primary"
              icon="el-icon-plus"
              circle
              @click="addDialogVisible = true"
            />
          </el-tooltip>
        </el-row>
      </el-col>
    </el-row>
    <!--  表格数据区域-->
    <el-table
      :data="tableData"
      border
      highlight-current-row
      stripe
      style="width: 100%"
      row-style="height:35px"
      cell-style="padding:2px"
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
        label="操作"
        align="center"
      >
        <!--        操作按钮区域的作用域插槽-->
        <template slot-scope="scope">
          <el-tooltip
            effect="dark"
            content="编辑专业(可编辑专业名称)"
            placement="top"
          >
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              @click="editDialogVisible1(scope.row.professionCode, scope.row.professionName)"
            />
          </el-tooltip>
          <el-tooltip
            effect="dark"
            content="删除专业(只会删除绑定的班级)"
            placement="top"
          >
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              @click="deleteDialogVisible1(scope.row.professionCode)"
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
    <!--    添加专业对话框区域-->
    <el-dialog
      title="添加专业"
      :visible.sync="addDialogVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <!--      对话框主体区域-->
      <el-form
        v-if="addDialogVisible"
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item
          label="专业名称"
          prop="professionName"
        >
          <el-input v-model="addForm.professionName" />
        </el-form-item>
      </el-form>
      <!--      对话框底部区域-->
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addProfession"
        >添加专业</el-button>
      </span>
    </el-dialog>
    <!--    修改专业名称对话框-->
    <el-dialog
      title="修改名称"
      :visible.sync="editDialogVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <!--      对话框主体区域-->
      <el-form
        v-if="editDialogVisible"
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item
          label="新专业名称"
          prop="professionName"
        >
          <el-input v-model="editForm.professionName" />
        </el-form-item>
      </el-form>
      <!--      对话框底部区域-->
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="editProfession"
        >修改名称</el-button>
      </span>
    </el-dialog>
    <!--    删除专业对话框-->
    <el-dialog
      title="删除专业"
      :visible.sync="deleteDialogVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <!--      对话框主体区域-->
      <span>确认删除吗?</span>
      <!--      对话框底部区域-->
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="deleteDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="deleteProfession"
        >删除专业</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ProfessionManage',
  data () {
    return {
      /** 数据表格 */
      // 数据表格数据绑定
      queryInfo: {
        // 当前搜索关键字
        keyWord: '',
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
        { label: '专业编号', prop: 'professionCode', width: 100 },
        { label: '专业名称', prop: 'professionName' },
        { label: '专业人数', prop: 'professionHumanNum' },
        { label: '班级个数', prop: 'professionClassesNum' },
        { label: '创建时间', prop: 'addTime' }
      ],
      /** 控制添加专业对话框的显示与隐藏 */
      addDialogVisible: false,
      /** 新增专业表单数据 */
      addForm: {
        professionName: ''
      },
      /** 表单验证相关配置 */
      addFormRules: {
        professionName: [
          { required: true, message: '请输入专业名称', trigger: 'blur' },
          { min: 4, max: 21, message: '长度在 4 到 21 个字符', trigger: 'blur' }
        ]
      },
      /** 控制修改专业对话框的显示与隐藏 */
      editDialogVisible: false,
      /** 控制删除专业对话框的显示与隐藏 */
      deleteDialogVisible: false,
      // 用户当前操作的专业编号
      professionCode: '',
      /** 修改专业表单数据 */
      editForm: {
        professionName: ''
      },
      /** 表单验证相关配置 */
      editFormRules: {
        professionName: [
          { required: true, message: '请输入专业名称', trigger: 'blur' },
          { min: 4, max: 21, message: '长度在 4 到 21 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  /** 生命周期函数 */
  created () {
    // 这里是发起表格数据请求的位置
    this.getProfessionData()
  },
  /** 事件处理函数 */
  methods: {
    /** 添加专业操作 */
    addProfession () {
      this.$refs.addFormRef.validate(async valid => {
        if (valid) {
          const formData = JSON.stringify({
            useraction: 'addProfession',
            username: window.sessionStorage.getItem('username'),
            professionName: this.addForm.professionName
          })
          // 提交登出请求
          const result = await this.$http.post('/data/', formData)
          if (result.data.ret === 0) {
            this.$message({ message: result.data.data, type: 'success', showClose: true, center: true })
            this.addDialogVisible = false
            this.getProfessionData()
          }
          if (result.data.ret === 1) {
            this.$message({ message: result.data.data, type: 'error', showClose: true, center: true })
          }
        }
      })
    },
    /** 修改专业操作 */
    editDialogVisible1 (professionCode, professionName) {
      this.professionCode = professionCode
      this.editDialogVisible = true
      this.editForm.professionName = professionName
    },
    editProfession () {
      var editProfessionCode = this.professionCode
      this.$refs.editFormRef.validate(async valid => {
        if (valid) {
          const formData = JSON.stringify({
            useraction: 'editProfession',
            username: window.sessionStorage.getItem('username'),
            professionCode: editProfessionCode,
            professionName: this.editForm.professionName
          })
          const result = await this.$http.post('/data/', formData)
          if (result.data.ret === 0) {
            this.$message({ message: result.data.data, type: 'success', showClose: true, center: true })
            this.editDialogVisible = false
            this.getProfessionData()
          }
          if (result.data.ret === 1) {
            this.$message({ message: result.data.data, type: 'error', showClose: true, center: true })
          }
        }
      })
    },
    /** 删除专业操作 */
    deleteDialogVisible1 (professionCode) {
      this.professionCode = professionCode
      this.deleteDialogVisible = true
    },
    async deleteProfession () {
      var deleteProfessionCode = this.professionCode
      const formData = JSON.stringify({
        useraction: 'deleteProfession',
        username: window.sessionStorage.getItem('username'),
        professionCode: deleteProfessionCode
      })
      const result = await this.$http.post('/data/', formData)
      if (result.data.ret === 0) {
        this.$message({ message: result.data.data, type: 'success', showClose: true, center: true })
        this.deleteDialogVisible = false
        this.getProfessionData()
      }
      if (result.data.ret === 1) {
        this.$message({ message: result.data.data, type: 'error', showClose: true, center: true })
      }
    },
    /** 获取专业管理页面的专业列表数据 */
    async getProfessionData () {
      // this.queryInfo.pageNum = 1
      const formData = JSON.stringify({
        useraction: 'getProfessionData',
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
    /** 监听每页显示多少数据的改变 */
    handleSizeChange (newSize) {
      this.queryInfo.pageSize = newSize
      this.getProfessionData()
    },
    /** 监听页码的改变 */
    handleCurrentChange (newPage) {
      this.queryInfo.pageNum = newPage
      this.getProfessionData()
    }
  }
}
</script>

<style lang="less" scoped>
  .input-select {
    width: 130px;
  }

  .el-table {
    align-items: center;
    margin-top: 25px;
  }

  .el-pagination {
    margin-top: 25px;
  }
</style>
