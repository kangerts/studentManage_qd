<template>
  <div style="width: 100%">
    <!--  头部搜索和创建按钮区域-->
    <el-row :gutter="50">
      <!--    搜索区域列-->
      <el-col :span="7">
        <el-input
          clearable
          @clear="getclassesData"
          @focus="setPageNum"
          @input="getclassesData"
          placeholder="请输入班级名称"
          v-model="queryInfo.keyWord"
          prefix-icon="el-icon-search"
        />
      </el-col>
      <!--    按钮区域列-->
      <el-col :span="4">
        <el-row>
          <el-tooltip
            effect="dark"
            content="创建班级(作为学生的容器)"
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
        width="200px"
      >
        <!--        操作按钮区域的作用域插槽-->
        <template slot-scope="scope">
          <el-tooltip
            effect="dark"
            content="班级学生(可查看本班级所有学生)"
            placement="top"
          >
            <el-button
              type="info"
              icon="el-icon-view"
              circle
              @click="toStudentDataShowClasses(scope.row.classesName)"
            />
          </el-tooltip>
          <el-tooltip
            effect="dark"
            content="编辑班级(可编辑班级名称)"
            placement="top"
          >
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              @click="editDialogVisible1(scope.row.classesCode, scope.row.classesName)"
            />
          </el-tooltip>
          <el-tooltip
            effect="dark"
            content="删除班级(不会删除学生及专业)"
            placement="top"
          >
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              @click="deleteDialogVisible1(scope.row.classesCode)"
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
    <!--    添加班级对话框区域-->
    <el-dialog
      title="添加班级"
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
          label="班级名称"
          prop="classesName"
        >
          <el-input v-model="addForm.classesName" />
        </el-form-item>
        <el-form-item
          label="班级届数"
          prop="classesLevel"
        >
          <el-date-picker
            v-model="addForm.classesLevel"
            type="year"
            placeholder="选择年"
            value-format="yyyy"
          />
        </el-form-item>
        <el-form-item
          label="绑定专业"
          prop="bindProfession"
        >
          <!--        联动菜单-->
          <el-cascader
            placeholder="试试搜索专业名吧~"
            v-model="addForm.bindProfession"
            :options="cascaderOptions"
            :props="{ expandTrigger: 'hover' }"
            filterable
            clearable
          />
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
          @click="addclasses"
        >添加班级</el-button>
      </span>
    </el-dialog>
    <!--    修改班级名称对话框-->
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
          label="新班级名称"
          prop="classesName"
        >
          <el-input v-model="editForm.classesName" />
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
          @click="editclasses"
        >修改名称</el-button>
      </span>
    </el-dialog>
    <!--    删除班级对话框-->
    <el-dialog
      title="删除班级"
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
          @click="deleteclasses"
        >删除班级</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ClassesManage',
  data () {
    return {
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
        { label: '班级编号', prop: 'classesCode', width: 100 },
        { label: '班级届数', prop: 'classesLevel' },
        { label: '班级名称', prop: 'classesName' },
        { label: '所属专业', prop: 'toProfession' },
        { label: '班级人数', prop: 'classesHumanNum' },
        { label: '创建时间', prop: 'addTime' }
      ],
      /** 控制添加班级对话框的显示与隐藏 */
      addDialogVisible: false,
      /** 新增班级表单数据 */
      addForm: {
        classesName: '',
        classesLevel: '',
        bindProfession: ''
      },
      /** 表单验证相关配置 */
      addFormRules: {
        classesName: [
          { required: true, message: '请输入班级名称', trigger: 'blur' },
          { min: 4, max: 21, message: '长度在 4 到 21 个字符', trigger: 'blur' }
        ],
        classesLevel: [
          { required: true, message: '请输入班级届数', trigger: 'blur' }],
        bindProfession: [
          { required: true, message: '请选择绑定专业', trigger: 'blur' }
        ]
      },
      /** 控制修改班级对话框的显示与隐藏 */
      editDialogVisible: false,
      /** 控制删除班级对话框的显示与隐藏 */
      deleteDialogVisible: false,
      /** 修改班级表单数据 */
      editForm: {
        classesName: ''
      },
      /** 表单验证相关配置 */
      editFormRules: {
        classesName: [
          { required: true, message: '请输入班级名称', trigger: 'blur' },
          { min: 4, max: 21, message: '长度在 4 到 21 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  /** 生命周期函数 */
  created () {
    // 这里是发起表格数据请求的位置
    this.getclassesData()
    this.getProfessionDataCascaderOptions()
  },
  /** 事件处理函数 */
  methods: {
    /** 修复当用户在大于1的分页进行数据搜索没有返回值的问题 */
    setPageNum () {
      this.queryInfo.pageNum = 1
      this.getclassesData()
    },
    /** 获取专业数据 */
    async getProfessionDataCascaderOptions () {
      const formData = JSON.stringify({
        useraction: 'getProfessionDataCascaderOptions',
        username: window.sessionStorage.getItem('username')
      })
      // 提交表单
      const result = await this.$http.post('/data/', formData)
      // 判断业务逻辑
      if (result.data.ret === 0) {
        this.cascaderOptions = result.data.data
        return
      }
      this.$message({ message: '读取数据失败！', type: 'error', showClose: true, center: true })
    },
    /** 添加班级操作 */
    addclasses () {
      this.$refs.addFormRef.validate(async valid => {
        if (valid) {
          const formData = JSON.stringify({
            useraction: 'addClasses',
            username: window.sessionStorage.getItem('username'),
            ...this.addForm
          })
          // 提交登出请求
          const result = await this.$http.post('/data/', formData)
          if (result.data.ret === 0) {
            this.$message({ message: result.data.data, type: 'success', showClose: true, center: true })
            this.addDialogVisible = false
            this.getclassesData()
          }
          if (result.data.ret === 1) {
            this.$message({ message: result.data.data, type: 'error', showClose: true, center: true })
          }
        }
      })
    },
    /** 修改班级操作 */
    editDialogVisible1 (classesCode, classesName) {
      this.classesCode = classesCode
      this.editForm.classesName = classesName
      this.editDialogVisible = true
    },
    editclasses () {
      var editclassesCode = this.classesCode
      this.$refs.editFormRef.validate(async valid => {
        if (valid) {
          const formData = JSON.stringify({
            useraction: 'editClasses',
            username: window.sessionStorage.getItem('username'),
            classesCode: editclassesCode,
            classesName: this.editForm.classesName
          })
          const result = await this.$http.post('/data/', formData)
          if (result.data.ret === 0) {
            this.$message({ message: result.data.data, type: 'success', showClose: true, center: true })
            this.editDialogVisible = false
            this.getclassesData()
          }
          if (result.data.ret === 1) {
            this.$message({ message: result.data.data, type: 'error', showClose: true, center: true })
          }
        }
      })
    },
    /** 删除班级操作 */
    deleteDialogVisible1 (classesCode) {
      this.classesCode = classesCode
      this.deleteDialogVisible = true
    },
    async deleteclasses () {
      var deleteclassesCode = this.classesCode
      const formData = JSON.stringify({
        useraction: 'deleteClasses',
        username: window.sessionStorage.getItem('username'),
        classesCode: deleteclassesCode
      })
      const result = await this.$http.post('/data/', formData)
      if (result.data.ret === 0) {
        this.$message({ message: result.data.data, type: 'success', showClose: true, center: true })
        this.deleteDialogVisible = false
        this.getclassesData()
      }
      if (result.data.ret === 1) {
        this.$message({ message: result.data.data, type: 'error', showClose: true, center: true })
      }
    },
    /** 获取班级管理页面的班级列表数据 */
    async getclassesData () {
      const formData = JSON.stringify({
        useraction: 'getclassesData',
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
      this.getclassesData()
    },
    /** 监听页码的改变 */
    handleCurrentChange (newPage) {
      this.queryInfo.pageNum = newPage
      this.getclassesData()
    },

    /** 跳转到学生数据页面并显示本班级的学生 */
    toStudentDataShowClasses (classesName) {
      this.$router.push({
        path: '/admin/studentData',
        query: {
          classesName: classesName
        }
      })
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
