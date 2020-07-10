<template>
  <div style="width: 100%">
    <!--  头部搜索和创建按钮区域-->
    <el-row :gutter="50">
      <!--    搜索区域列-->
      <el-col :span="7">
        <el-input
          v-model="queryInfo.keyWord"
          suffix-icon="el-icon-search"
          class="input-with-select"
          clearable
          @clear="getTeacherData"
          @focus="setPageNum"
          @input="getTeacherData"
          placeholder="请输入教师名称"
        />
      </el-col>
      <!--    按钮区域列-->
      <el-col :span="4">
        <el-row>
          <el-tooltip
            effect="dark"
            content="创建教师(作为本系统的使用者)"
            placement="top"
          >
            <el-button
              type="primary"
              icon="el-icon-plus"
              circle
              @click="addDialogVisible = true"
              :disabled="!isSuper"
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
        width="200px"
      >
        <!--        操作按钮区域的作用域插槽-->
        <template slot-scope="scope">
          <el-tooltip
            effect="dark"
            content="编辑教师(可编辑教师信息)"
            placement="top"
          >
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              @click="editDialogVisible1(scope.row)"
              :disabled="scope.row.is_super"
            />
          </el-tooltip>
          <el-tooltip
            effect="dark"
            content="删除教师(只会删除教师账户)"
            placement="top"
          >
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              @click="deleteDialogVisible1(scope.row)"
              :disabled="scope.row.is_super"
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

    <!--    添加教师对话框区域-->
    <el-dialog
      title="添加教师"
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
          label="账户名称"
          prop="user_name"
        >
          <el-input v-model="addForm.user_name" />
        </el-form-item>
        <el-form-item
          label="账户密码"
          prop="user_pass"
        >
          <el-input
            type="password"
            v-model="addForm.user_pass"
          />
        </el-form-item>
        <el-form-item
          label="教师名称"
          prop="teacher_name"
        >
          <el-input v-model="addForm.teacher_name" />
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
          @click="addTeacher"
        >新增教师</el-button>
      </span>
    </el-dialog>

    <!--    修改教师对话框-->
    <el-dialog
      title="修改教师"
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
          label="账户名称"
          prop="user_name"
        >
          <el-input v-model="editForm.user_name" />
        </el-form-item>
        <el-form-item
          label="账户密码"
          prop="user_pass"
        >
          <el-input
            type="password"
            v-model="editForm.user_pass"
          />
        </el-form-item>
        <el-form-item
          label="教师名称"
          prop="teacher_name"
        >
          <el-input v-model="editForm.teacher_name" />
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
          @click="editTeacher"
        >修改名称</el-button>
      </span>
    </el-dialog>

    <!--    删除教师对话框-->
    <el-dialog
      title="删除教师"
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
          @click="deleteTeacher"
        >删除教师</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ClassesManage',
  data () {
    return {
      isSuper: Boolean(window.sessionStorage.getItem('is_super')),
      // 联动菜单数据
      cascaderOptions: [],
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
        { label: '教师名称', prop: 'teacher_name' },
        { label: '账户名称', prop: 'user_name' },
        { label: '创建时间', prop: 'add_time' }
      ],
      /** 控制添加教师对话框的显示与隐藏 */
      addDialogVisible: false,
      /** 新增教师表单数据 */
      addForm: {
        user_name: '',
        user_pass: '',
        teacher_name: ''
      },
      /** 表单验证相关配置 */
      addFormRules: {
        user_name: [
          { required: true, message: '请输入账户名称', trigger: 'blur' },
          { min: 6, max: 21, message: '长度在 6 到 21 个字符', trigger: 'blur' }
        ],
        teacher_name: [
          { required: true, message: '请输入教师名称', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ],
        user_pass: [
          { required: true, message: '请输入账户密码', trigger: 'blur' },
          { min: 6, max: 21, message: '长度在 6 到 21 个字符', trigger: 'blur' }
        ]
      },
      /** 控制修改教师对话框的显示与隐藏 */
      editDialogVisible: false,
      /** 控制删除教师对话框的显示与隐藏 */
      deleteDialogVisible: false,
      /** 修改教师表单数据 */
      editForm: {
        user_name: '',
        user_pass: '',
        teacher_name: ''
      },
      /** 表单验证相关配置 */
      editFormRules: {
        user_name: [
          { required: true, message: '请输入账户名称', trigger: 'blur' },
          { min: 6, max: 21, message: '长度在 6 到 21 个字符', trigger: 'blur' }
        ],
        teacher_name: [
          { required: true, message: '请输入教师名称', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ],
        user_pass: [
          { required: true, message: '请输入账户密码', trigger: 'blur' },
          { min: 6, max: 21, message: '长度在 6 到 21 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  /** 生命周期函数 */
  created () {
    this.getTeacherData()
  },
  /** 事件处理函数 */
  methods: {
    /** 获取教师数据 */
    async getTeacherData () {
      const formData = JSON.stringify({
        useraction: 'getTeacherData',
        username: window.sessionStorage.getItem('username'),
        ...this.queryInfo
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

    /** 添加教师信息 */
    async addTeacher () {
      this.$refs.addFormRef.validate(async valid => {
        if (valid) {
          const formData = JSON.stringify({
            useraction: 'addTeacher',
            username: window.sessionStorage.getItem('username'),
            addForm: this.addForm
          })
          const result = await this.$http.post('/data/', formData)
          if (result.data.ret === 0) {
            this.$message({ message: result.data.data, type: 'success', showClose: true, center: true })
            this.addDialogVisible = false
            this.getTeacherData()
          }
          if (result.data.ret === 1) {
            this.$message({ message: result.data.data, type: 'error', showClose: true, center: true })
          }
        }
      })
    },

    /** 编辑教师信息 */
    editDialogVisible1 (teacherData) {
      this.editDialogVisible = true
      this.editForm.user_name = teacherData.user_name
      this.editForm.user_pass = teacherData.user_pass
      this.editForm.teacher_name = teacherData.teacher_name
    },
    editTeacher () {
      this.$refs.editFormRef.validate(async valid => {
        if (valid) {
          const formData = JSON.stringify({
            useraction: 'editTeacher',
            username: window.sessionStorage.getItem('username'),
            editForm: this.editForm
          })
          const result = await this.$http.post('/data/', formData)
          if (result.data.ret === 0) {
            this.$message({ message: result.data.data, type: 'success', showClose: true, center: true })
            this.editDialogVisible = false
            this.getTeacherData()
          }
          if (result.data.ret === 1) {
            this.$message({ message: result.data.data, type: 'error', showClose: true, center: true })
          }
        }
      })
    },

    /** 删除教师信息 */
    deleteDialogVisible1 (teacherData) {
      this.deleteDialogVisible = true
      this.user_name = teacherData.user_name
    },
    async deleteTeacher () {
      const formData = JSON.stringify({
        useraction: 'deleteTeacher',
        username: window.sessionStorage.getItem('username'),
        teacher: this.user_name
      })
      const result = await this.$http.post('/data/', formData)
      if (result.data.ret === 0) {
        this.$message({ message: result.data.data, type: 'success', showClose: true, center: true })
        this.deleteDialogVisible = false
        this.getTeacherData()
      }
      if (result.data.ret === 1) {
        this.$message({ message: result.data.data, type: 'error', showClose: true, center: true })
      }
    },

    /** 修复当用户在大于1的分页进行数据搜索没有返回值的问题 */
    setPageNum () {
      this.queryInfo.pageNum = 1
      this.getclassesData()
    },
    /** 监听每页显示多少数据的改变 */
    handleSizeChange (newSize) {
      this.queryInfo.pageSize = newSize
      this.getclassesData()
    },
    /** 监听页码的改变 */
    handleCurrentChange (newPage) {
      this.queryInfo.pageNum = newPage
      this.getclassesData()
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

  .el-pagination{
    margin-top: 25px;
  }
</style>
