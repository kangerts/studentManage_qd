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
          @clear="getPostData"
          @focus="setPageNum"
          @input="getPostData"
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
              label="岗位名称"
              value="postName"
            />
            <el-option
              label="企业名称"
              value="enterpriseName"
            />
          </el-select>
        </el-input>
      </el-col>
      <!--    按钮区域列-->
      <el-col :span="4">
        <el-row>
          <el-tooltip
            effect="dark"
            content="创建岗位(学生可以绑定)"
            placement="top"
          >
            <el-button
              type="primary"
              icon="el-icon-plus"
              circle
              @click="addPostDialogVisible = true"
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
        fixed="right"
      >
        <!--        操作按钮区域的作用域插槽-->
        <template slot-scope="scope">
          <el-tooltip
            effect="dark"
            content="查看企业(可查看本岗位所对应的企业)"
            placement="top"
          >
            <el-button
              type="info"
              icon="el-icon-view"
              circle
              @click="toEnterpriseDataShow(scope.row.toEnterprise)"
            />
          </el-tooltip>
          <el-tooltip
            effect="dark"
            content="编辑岗位(可编辑岗位信息)"
            placement="top"
          >
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              @click="editPostDialogVisible1(scope.row)"
            />
          </el-tooltip>
          <el-tooltip
            effect="dark"
            content="删除岗位(只会删除学生岗位绑定信息)"
            placement="top"
          >
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              @click="deletePostDialogVisible1(scope.row.postCode)"
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
    <!--    添加岗位对话框区域-->
    <el-dialog
      title="添加岗位"
      :visible.sync="addPostDialogVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <el-form
        :model="addPostForm"
        :rules="addPostFormRules"
        ref="addPostFormRef"
        label-width="100px"
      >
        <el-form-item
          label="岗位名称"
          prop="postName"
        >
          <el-input v-model="addPostForm.postName" />
        </el-form-item>
        <el-form-item
          label="招聘人数"
          prop="recruitCount"
        >
          <el-input
            v-model="addPostForm.recruitCount"
            onkeyup="value=value.replace(/[^\d]/g,'')"
          />
        </el-form-item>
        <el-form-item
          label="工作地点"
          prop="postAddress"
        >
          <el-cascader
            placeholder="试试搜索城市名称吧~"
            v-model="postAddressTemp"
            :options="postAddressCascaderOptions"
            :props="{ expandTrigger: 'hover' }"
            filterable
            clearable
            separator=" -> "
          />
        </el-form-item>
        <el-form-item
          label="工资待遇"
          prop="salaryTreatment"
        >
          <el-input v-model="addPostForm.salaryTreatment" />
        </el-form-item>
        <el-form-item
          label="绑定企业"
          prop="bindEnterprise"
        >
          <el-cascader
            placeholder="试试搜索企业名称吧~"
            v-model="addPostForm.bindEnterprise"
            :options="enterpriseCascaderOptions"
            :props="{ expandTrigger: 'hover' }"
            filterable
            clearable
            separator=" -> "
          />
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="addPostDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addPost"
        >添加岗位</el-button>
      </span>
    </el-dialog>

    <!--    编辑岗位对话框区域-->
    <el-dialog
      title="编辑岗位"
      :visible.sync="editPostDialogVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <el-form
        :model="editPostForm"
        :rules="editPostFormRules"
        ref="editPostFormRef"
        label-width="100px"
      >
        <el-form-item
          label="岗位名称"
          prop="postName"
        >
          <el-input v-model="editPostForm.postName" />
        </el-form-item>
        <el-form-item
          label="招聘人数"
          prop="recruitCount"
        >
          <el-input
            v-model="editPostForm.recruitCount"
            onkeyup="value=value.replace(/[^\d]/g,'')"
          />
        </el-form-item>
        <el-form-item
          label="工作地点"
          prop="postAddress"
        >
          <el-cascader
            placeholder="试试搜索城市名称吧~"
            v-model="postAddressTemp"
            :options="postAddressCascaderOptions"
            :props="{ expandTrigger: 'hover' }"
            filterable
            clearable
            separator=" -> "
          />
        </el-form-item>
        <el-form-item
          label="工资待遇"
          prop="salaryTreatment"
        >
          <el-input v-model="editPostForm.salaryTreatment" />
        </el-form-item>
        <el-form-item
          label="绑定企业"
          prop="bindEnterprise"
        >
          <el-cascader
            placeholder="试试搜索企业名称吧~"
            v-model="bindEnterpriseTemp"
            :options="enterpriseCascaderOptions"
            :props="{ expandTrigger: 'hover' }"
            filterable
            clearable
            separator=" -> "
          />
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="editPostDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="editPost"
        >编辑岗位</el-button>
      </span>
    </el-dialog>

    <!--    删除岗位对话框-->
    <el-dialog
      title="删除岗位"
      :visible.sync="deletePostDialogVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <span>确认删除吗?</span>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="deletePostDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="deletePost"
        >删除岗位</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 导入省市数据及解释器
import { provinceAndCityData, CodeToText } from 'element-china-area-data'

export default {
  name: 'PostManage',
  data () {
    return {
      // 显示学生数据是否附带显示类型
      isSearchType: false,
      // 工作地点联动菜单数据
      postAddressCascaderOptions: provinceAndCityData,
      enterpriseCascaderOptions: [],
      /** 公共的工作地址临时属性 */
      postAddressTemp: '',
      /** 公共的绑定企业临时属性 */
      bindEnterpriseTemp: '',
      /** 数据表格 */
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
        { label: '岗位编号', prop: 'postCode' },
        { label: '岗位名称', prop: 'postName', width: 200 },
        { label: '所属企业', prop: 'toEnterprise', width: 250 },
        { label: '招聘人数', prop: 'recruitCount' },
        { label: '工作地点', prop: 'postAddress', width: 200 },
        { label: '工资待遇', prop: 'salaryTreatment', width: 400 },
        { label: '创建时间', prop: 'addTime', width: 150 }
      ],
      /** 控制添加岗位对话框的显示与隐藏 */
      addPostDialogVisible: false,
      /** 新增班级表单数据 */
      addPostForm: {
        postName: '',
        recruitCount: '',
        postAddress: '',
        salaryTreatment: '',
        bindEnterprise: ''
      },
      /** 表单验证相关配置 */
      addPostFormRules: {
        postName: [
          { required: true, message: '请输入岗位名称', trigger: 'blur' },
          { min: 4, max: 21, message: '长度在 4 到 21 个字符', trigger: 'blur' }
        ],
        recruitCount: [
          { min: 1, message: '长度在至少 1 个字符', trigger: 'blur' },
          { required: true, message: '请输入招聘人数', trigger: 'blur' }],
        postAddress: [
          { required: true, message: '请选择工作地点', trigger: 'blur' }
        ],
        salaryTreatment: [
          { required: true, message: '请输入工资待遇', trigger: 'blur' }
        ],
        bindEnterprise: [
          { required: true, message: '请选择绑定企业', trigger: 'blur' }
        ]
      },
      /** 控制编辑岗位对话框的显示与隐藏 */
      editPostDialogVisible: false,
      /** 编辑班级表单数据 */
      editPostForm: {
        postName: '',
        recruitCount: '',
        postAddress: '',
        salaryTreatment: '',
        bindEnterprise: ''
      },
      /** 表单验证相关配置 */
      editPostFormRules: {
        postName: [
          { required: true, message: '请输入岗位名称', trigger: 'blur' },
          { min: 4, max: 21, message: '长度在 4 到 21 个字符', trigger: 'blur' }
        ],
        recruitCount: [
          { min: 1, message: '长度在至少 1 个字符', trigger: 'blur' },
          { required: true, message: '请输入招聘人数', trigger: 'blur' }],
        postAddress: [
          { required: true, message: '请选择工作地点', trigger: 'blur' }
        ],
        salaryTreatment: [
          { required: true, message: '请输入工资待遇', trigger: 'blur' }
        ],
        bindEnterprise: [
          { required: true, message: '请选择绑定企业', trigger: 'blur' }
        ]
      },
      /** 控制删除岗位对话框的显示与隐藏 */
      deletePostDialogVisible: false
    }
  },
  watch: {
    // 城市代码数组转换为字符串
    postAddressTemp: function (val) {
      this.addPostForm.postAddress = CodeToText[val[0]] + '-' + CodeToText[val[1]]
    },
    // 当用户选择搜索学生的前置条件则锁定筛选数据类型为全部数据并禁用单选框否则应该清空输入框数据
    'queryInfo.queryType': function (val) {
      if (val !== 'noSearch') {
        this.isSearchType = true
      } else {
        this.isSearchType = false
        this.queryInfo.keyWord = ''
        this.getPostData()
      }
    },
    // 城市代码数组转换为字符串
    companyAddressTemp: function (val) {
      this.editForm.postAddress = CodeToText[val[0]] + '-' + CodeToText[val[1]]
    },
    bindEnterpriseTemp: function (val) {
      this.editPostForm.bindEnterprise = val[0]
    }
  },
  /** 生命周期函数 */
  created () {
    this.getEnterpriseDataCascaderOptions()
    const enterpriseName = this.$route.query.enterpriseName
    if (enterpriseName !== undefined && enterpriseName !== '') {
      this.queryInfo.keyWord = enterpriseName
      this.queryInfo.queryType = 'enterpriseName'
    }
    this.getPostData()
  },
  /** 事件处理函数 */
  methods: {
    /** 获取企业数据 */
    async getEnterpriseDataCascaderOptions () {
      const formData = JSON.stringify({
        useraction: 'getEnterpriseDataCascaderOptions',
        username: window.sessionStorage.getItem('username')
      })
      // 提交登出请求
      const result = await this.$http.post('/data/', formData)
      if (result.data.ret === 0) {
        const cascaderOptionsData = []
        const data = result.data.data
        for (let i = 0; i < data.length; i++) {
          cascaderOptionsData.push({ label: data[i].enterpriseName, value: data[i].enterpriseCode })
        }
        this.enterpriseCascaderOptions = cascaderOptionsData
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

    /** 创建岗位 */
    addPost () {
      this.$refs.addPostFormRef.validate(async valid => {
        if (valid) {
          const formData = JSON.stringify({
            useraction: 'addPost',
            username: window.sessionStorage.getItem('username'),
            ...this.addPostForm
          })
          // 提交登出请求
          const result = await this.$http.post('/data/', formData)
          if (result.data.ret === 0) {
            this.$message({
              message: result.data.data,
              type: 'success',
              showClose: true,
              center: true
            })
            this.addPostDialogVisible = false
            this.getPostData()
          }
          if (result.data.ret === 1) {
            this.$message({
              message: result.data.data,
              type: 'error',
              showClose: true,
              center: true
            })
          }
        }
      })
    },

    editPostDialogVisible1 (postData) {
      this.editPostForm = postData
      // 自动显示单位地址
      const chinaAddress = this.postAddressCascaderOptions
      const address = postData.postAddress.split('-')
      const arr1 = []
      for (let i = 0; i < chinaAddress.length; i++) {
        // 获取省份
        if (chinaAddress[i].label === address[0]) {
          arr1.push(chinaAddress[i].value)
          for (let ii = 0; ii < chinaAddress[i].children.length; ii++) {
            // 获取市区等
            if (chinaAddress[i].children[ii].label === address[1]) {
              arr1.push(chinaAddress[i].children[ii].value)
            }
          }
        }
      }
      // 自动显示岗位绑定的企业
      const enterpriseData = this.enterpriseCascaderOptions
      const arr2 = []
      for (let i = 0; i < enterpriseData.length; i++) {
        if (enterpriseData[i].label === postData.toEnterprise) {
          arr2.push(enterpriseData[i].value)
        }
      }
      this.postAddressTemp = arr1
      this.bindEnterpriseTemp = arr2
      this.editPostDialogVisible = true
      this.editPostForm = postData
    },
    /** 编辑岗位 */
    async editPost () {
      this.$refs.editPostFormRef.validate(async valid => {
        if (valid) {
          const formData = JSON.stringify({
            useraction: 'editPost',
            username: window.sessionStorage.getItem('username'),
            ...this.editPostForm
          })
          // 提交登出请求
          const result = await this.$http.post('/data/', formData)
          if (result.data.ret === 0) {
            this.$message({
              message: result.data.data,
              type: 'success',
              showClose: true,
              center: true
            })
            this.editPostDialogVisible = false
            this.getPostData()
          }
          if (result.data.ret === 1) {
            this.$message({
              message: result.data.data,
              type: 'error',
              showClose: true,
              center: true
            })
          }
        }
      })
    },

    /** 删除岗位 */
    deletePostDialogVisible1 (postCode) {
      this.deletePostDialogVisible = true
      this.postCode = postCode
    },

    async deletePost () {
      const postCode = this.postCode
      const formData = JSON.stringify({
        useraction: 'deletePost',
        username: window.sessionStorage.getItem('username'),
        postCode: postCode
      })
      const result = await this.$http.post('/data/', formData)
      if (result.data.ret === 0) {
        this.$message({
          message: result.data.data,
          type: 'success',
          showClose: true,
          center: true
        })
        this.deletePostDialogVisible = false
        this.getPostData()
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

    /** 获取岗位数据 */
    async getPostData () {
      const formData = JSON.stringify({
        useraction: 'getPostData',
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

    /** 跳转到企业数据页面并显示本岗位对应的企业 */
    toEnterpriseDataShow (enterpriseName) {
      this.$router.push({
        path: '/admin/enterpriseManage',
        query: {
          enterpriseName: enterpriseName
        }
      })
    },

    /** 修复当用户在大于1的分页进行数据搜索没有返回值的问题 */
    setPageNum () {
      this.queryInfo.pageNum = 1
      this.getPostData()
    },
    /** 监听每页显示多少数据的改变 */
    handleSizeChange (newSize) {
      this.queryInfo.pageSize = newSize
      this.getPostData()
    },
    /** 监听页码的改变 */
    handleCurrentChange (newPage) {
      this.queryInfo.pageNum = newPage
      this.getPostData()
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
