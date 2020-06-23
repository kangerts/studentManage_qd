<template>
  <div style="width: 100%">
    <!--  头部搜索和创建按钮区域-->
    <el-row :gutter="50">
      <!--    搜索区域列-->
      <el-col :span="7">
        <el-input
          clearable
          @clear="getEnterpriseData"
          @input="getEnterpriseData"
          @focus="setPageNum"
          placeholder="请输入企业名称"
          v-model="queryInfo.keyWord"
          prefix-icon="el-icon-search"
        />
      </el-col>
      <!--    按钮区域列-->
      <el-col :span="4">
        <el-row>
          <el-tooltip
            effect="dark"
            content="创建企业(岗位可以绑定))"
            placement="top"
          >
            <el-button
              type="primary"
              icon="el-icon-plus"
              circle
              @click="addEnterpriseDialogVisible = true"
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
        fixed="right"
        width="180"
      >
        <!--        操作按钮区域的作用域插槽-->
        <template slot-scope="scope">
          <el-tooltip
            effect="dark"
            content="企业岗位(可查看本企业所有岗位)"
            placement="top"
          >
            <el-button
              type="info"
              icon="el-icon-view"
              circle
              @click="toPostDataShow(scope.row.enterpriseName)"
            />
          </el-tooltip>
          <el-tooltip
            effect="dark"
            content="编辑企业(可编辑企业信息)"
            placement="top"
          >
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              @click="editDialogVisible1(scope.row)"
            />
          </el-tooltip>
          <el-tooltip
            effect="dark"
            content="删除企业(会删除本企业所有岗位)"
            placement="top"
          >
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              @click="deleteEnterpriseDialogVisible1(scope.row.enterpriseCode)"
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
    <!--    添加企业对话框区域-->
    <el-dialog
      title="添加企业"
      :visible.sync="addEnterpriseDialogVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <el-form
        v-if="addEnterpriseDialogVisible"
        :model="addEnterpriseForm"
        :rules="addEnterpriseFormRules"
        ref="addEnterpriseFormRef"
        label-width="100px"
      >
        <el-form-item
          label="企业名称"
          prop="enterpriseName"
        >
          <el-input v-model="addEnterpriseForm.enterpriseName" />
        </el-form-item>
        <el-form-item
          label="企业规模"
          prop="enterpriseScale"
        >
          <el-radio-group
            v-model="addEnterpriseForm.enterpriseScale"
            size="medium"
          >
            <el-radio
              label="大型"
              border
            >
              大型
            </el-radio>
            <el-radio
              label="中型"
              border
            >
              中型
            </el-radio>
            <el-radio
              label="小型"
              border
            >
              小型
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="优质等级"
          prop="goodGrade"
        >
          <el-radio-group
            size="medium"
            v-model="addEnterpriseForm.goodGrade"
          >
            <el-radio
              label="优"
              border
            >
              优
            </el-radio>
            <el-radio
              label="良"
              border
            >
              良
            </el-radio>
            <el-radio
              label="中"
              border
            >
              中
            </el-radio>
            <el-radio
              label="差"
              border
            >
              差
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="企业联系人"
          prop="enterpriseContacts"
        >
          <el-input v-model="addEnterpriseForm.enterpriseContacts" />
        </el-form-item>
        <el-form-item
          label="联系方式"
          prop="enterprisePhone"
        >
          <el-input
            type="textarea"
            v-model="addEnterpriseForm.enterprisePhone"
          />
        </el-form-item>
        <el-form-item
          label="企业地址"
          prop="enterpriseAddress"
        >
          <el-input v-model="addEnterpriseForm.enterpriseAddress" />
        </el-form-item>
        <el-form-item
          label="天眼查分值"
          prop="skyEyeScore"
        >
          <el-input
            v-model="addEnterpriseForm.skyEyeScore"
            onkeyup="value=value.replace(/[^\d]/g,'')"
          />
        </el-form-item>
        <el-form-item
          label="备注"
          prop="remarks"
        >
          <el-input
            type="textarea"
            v-model="addEnterpriseForm.remarks"
          />
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="addEnterpriseDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addEnterprise"
        >添加企业</el-button>
      </span>
    </el-dialog>

    <!--    编辑企业对话框区域-->
    <el-dialog
      title="编辑企业"
      :visible.sync="editEnterpriseDialogVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <el-form
        v-if="editEnterpriseDialogVisible"
        :model="editEnterpriseForm"
        :rules="editEnterpriseFormRules"
        ref="editEnterpriseFormRef"
        label-width="100px"
      >
        <el-form-item
          label="企业名称"
          prop="enterpriseName"
        >
          <el-input v-model="editEnterpriseForm.enterpriseName" />
        </el-form-item>
        <el-form-item
          label="企业规模"
          prop="enterpriseScale"
        >
          <el-radio-group
            v-model="editEnterpriseForm.enterpriseScale"
            size="medium"
          >
            <el-radio
              label="大型"
              border
            >
              大型
            </el-radio>
            <el-radio
              label="中型"
              border
            >
              中型
            </el-radio>
            <el-radio
              label="小型"
              border
            >
              小型
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="优质等级"
          prop="goodGrade"
        >
          <el-radio-group
            size="medium"
            v-model="editEnterpriseForm.goodGrade"
          >
            <el-radio
              label="优"
              border
            >
              优
            </el-radio>
            <el-radio
              label="良"
              border
            >
              良
            </el-radio>
            <el-radio
              label="中"
              border
            >
              中
            </el-radio>
            <el-radio
              label="差"
              border
            >
              差
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="企业联系人"
          prop="enterpriseContacts"
        >
          <el-input v-model="editEnterpriseForm.enterpriseContacts" />
        </el-form-item>
        <el-form-item
          label="联系方式"
          prop="enterprisePhone"
        >
          <el-input
            type="textarea"
            v-model="editEnterpriseForm.enterprisePhone"
          />
        </el-form-item>
        <el-form-item
          label="企业地址"
          prop="enterpriseAddress"
        >
          <el-input v-model="editEnterpriseForm.enterpriseAddress" />
        </el-form-item>
        <el-form-item
          label="天眼查分值"
          prop="skyEyeScore"
        >
          <el-input
            v-model="editEnterpriseForm.skyEyeScore"
            onkeyup="value=value.replace(/[^\d]/g,'')"
          />
        </el-form-item>
        <el-form-item
          label="备注"
          prop="remarks"
        >
          <el-input
            type="textarea"
            v-model="editEnterpriseForm.remarks"
          />
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="editEnterpriseDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="editEnterprise"
        >编辑企业</el-button>
      </span>
    </el-dialog>

    <!--    删除企业对话框-->
    <el-dialog
      title="删除企业"
      :visible.sync="deleteEnterpriseDialogVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <span>确认删除吗?</span>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="deleteEnterpriseDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="deleteEnterprise"
        >删除企业</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'EnterpriseManage',
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
        { label: '企业编号', prop: 'enterpriseCode', width: 100 },
        { label: '企业名称', prop: 'enterpriseName', width: 200 },
        { label: '企业规模', prop: 'enterpriseScale', width: 100 },
        { label: '优质等级', prop: 'goodGrade', width: 120 },
        { label: '联系人姓名', prop: 'enterpriseContacts', width: 100 },
        { label: '联系方式', prop: 'enterprisePhone', width: 200 },
        { label: '企业地址', prop: 'enterpriseAddress', width: 300 },
        { label: '天眼查分数', prop: 'skyEyeScore', width: 100 },
        { label: '备注', prop: 'remarks', width: 300 },
        { label: '岗位数量', prop: 'postCount' },
        { label: '添加日期', prop: 'addTime', width: 150 }
      ],
      // 添加企业表单是否显示
      addEnterpriseDialogVisible: false,
      // 添加企业表单
      addEnterpriseForm: {
        enterpriseName: '',
        enterpriseScale: '',
        goodGrade: '',
        enterpriseContacts: '',
        enterprisePhone: '',
        enterpriseAddress: '',
        skyEyeScore: '',
        remarks: ''
      },
      /** 添加企业表单验证相关配置 */
      addEnterpriseFormRules: {
        enterpriseName: [
          {
            required: true,
            message: '请输入企业名称',
            trigger: 'blur'
          },
          {
            min: 4,
            max: 30,
            message: '长度在 4 到 30 个字符',
            trigger: 'blur'
          }
        ],
        enterpriseScale: [
          {
            required: true,
            message: '请选择企业规模',
            trigger: 'blur'
          }
        ],
        goodGrade: [
          {
            required: true,
            message: '请选择企业优质等级',
            trigger: 'blur'
          }
        ],
        enterpriseContacts: [
          {
            required: true,
            message: '请输入企业联系人姓名',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 8,
            message: '长度在 2 到 8 个字符',
            trigger: 'blur'
          }
        ],
        enterprisePhone: [
          {
            required: true,
            message: '请输入联系方式信息',
            trigger: 'blur'
          },
          {
            min: 4,
            max: 100,
            message: '长度在 4 到 100 个字符',
            trigger: 'blur'
          }
        ],
        enterpriseAddress: [
          {
            required: true,
            message: '请输入企业地址',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 400,
            message: '长度在 2 到 400 个字符',
            trigger: 'blur'
          }
        ],
        skyEyeScore: [
          {
            required: true,
            message: '请输入企业天眼查分数',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 10,
            message: '长度在 2 到 10 个字符',
            trigger: 'blur'
          }
        ]
      },
      // 编辑企业表单是否显示
      editEnterpriseDialogVisible: false,
      // 编辑企业表单
      editEnterpriseForm: {
        enterpriseName: '',
        enterpriseScale: '',
        goodGrade: '',
        enterpriseContacts: '',
        enterprisePhone: '',
        enterpriseAddress: '',
        skyEyeScore: '',
        remarks: ''
      },
      /** 编辑企业表单验证相关配置 */
      editEnterpriseFormRules: {
        enterpriseName: [
          {
            required: true,
            message: '请输入企业名称',
            trigger: 'blur'
          },
          {
            min: 4,
            max: 30,
            message: '长度在 4 到 30 个字符',
            trigger: 'blur'
          }
        ],
        enterpriseScale: [
          {
            required: true,
            message: '请选择企业规模',
            trigger: 'blur'
          }
        ],
        goodGrade: [
          {
            required: true,
            message: '请选择企业优质等级',
            trigger: 'blur'
          }
        ],
        enterpriseContacts: [
          {
            required: true,
            message: '请输入企业联系人姓名',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 8,
            message: '长度在 2 到 8 个字符',
            trigger: 'blur'
          }
        ],
        enterprisePhone: [
          {
            required: true,
            message: '请输入联系方式信息',
            trigger: 'blur'
          },
          {
            min: 4,
            max: 100,
            message: '长度在 4 到 100 个字符',
            trigger: 'blur'
          }
        ],
        enterpriseAddress: [
          {
            required: true,
            message: '请输入企业地址',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 400,
            message: '长度在 2 到 400 个字符',
            trigger: 'blur'
          }
        ],
        skyEyeScore: [
          {
            required: true,
            message: '请输入企业天眼查分数',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 10,
            message: '长度在 2 到 10 个字符',
            trigger: 'blur'
          }
        ]
      },
      // 删除企业对话框是否显示
      deleteEnterpriseDialogVisible: false
    }
  },
  /** 生命周期函数 */
  created () {
    const enterpriseName = this.$route.query.enterpriseName
    if (enterpriseName !== undefined && enterpriseName !== '') {
      this.queryInfo.keyWord = enterpriseName
    }
    this.getEnterpriseData()
  },
  /** 事件处理函数 */
  methods: {
    /** 添加企业 */
    addEnterprise () {
      this.$refs.addEnterpriseFormRef.validate(async valid => {
        if (valid) {
          const formData = JSON.stringify({
            useraction: 'addEnterprise',
            username: window.sessionStorage.getItem('username'),
            ...this.addEnterpriseForm
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
            this.addEnterpriseDialogVisible = false
            this.getEnterpriseData()
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

    /** 编辑企业对话框 */
    editDialogVisible1 (enterpriseData) {
      for (const key in enterpriseData) {
        this.editEnterpriseForm[key] = enterpriseData[key]
      }
      this.editEnterpriseDialogVisible = true
    },
    /** 编辑企业 */
    editEnterprise () {
      this.$refs.editEnterpriseFormRef.validate(async valid => {
        if (valid) {
          const formData = JSON.stringify({
            useraction: 'editEnterprise',
            username: window.sessionStorage.getItem('username'),
            ...this.editEnterpriseForm
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
            this.editEnterpriseDialogVisible = false
            this.getEnterpriseData()
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

    /** 删除企业对话框 */
    deleteEnterpriseDialogVisible1 (enterpriseCode) {
      this.deleteEnterpriseDialogVisible = true
      this.deleteEnterpriseCode = enterpriseCode
    },
    /** 删除企业 */
    async deleteEnterprise () {
      const enterpriseCode = this.deleteEnterpriseCode
      const formData = JSON.stringify({
        useraction: 'deleteEnterprise',
        username: window.sessionStorage.getItem('username'),
        enterpriseCode: enterpriseCode
      })
      const result = await this.$http.post('/data/', formData)
      if (result.data.ret === 0) {
        this.$message({
          message: result.data.data,
          type: 'success',
          showClose: true,
          center: true
        })
        this.deleteEnterpriseDialogVisible = false
        this.getEnterpriseData()
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

    /** 获取企业数据 */
    async getEnterpriseData () {
      const formData = JSON.stringify({
        useraction: 'getEnterpriseData',
        username: window.sessionStorage.getItem('username'),
        ...this.queryInfo
      })
      // 提交登出请求
      const result = await this.$http.post('/data/', formData)
      if (result.data.ret === 0) {
        this.queryInfo.pageNum = result.data.pageNum
        this.total = result.data.total
        this.tableData = result.data.data
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

    /** 跳转到岗位数据页面并显示本企业对应的岗位 */
    toPostDataShow (enterpriseName) {
      this.$router.push({
        path: '/admin/postManage',
        query: {
          enterpriseName: enterpriseName
        }
      })
    },

    /** 修复当用户在大于1的分页进行数据搜索没有返回值的问题 */
    setPageNum () {
      this.queryInfo.pageNum = 1
      this.getEnterpriseData()
    },
    /** 监听每页显示多少数据的改变 */
    handleSizeChange (newSize) {
      this.queryInfo.pageSize = newSize
      this.getEnterpriseData()
    },
    /** 监听页码的改变 */
    handleCurrentChange (newPage) {
      this.queryInfo.pageNum = newPage
      this.getEnterpriseData()
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
