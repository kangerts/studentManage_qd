<template>
  <div style="width: 100%">
    <!--  头部搜索和创建按钮区域-->
    <el-row :gutter="50">
      <div>
        <!--    搜索区域列-->
        <el-col :span="6">
          <el-input
            :disabled="!isSearchType"
            placeholder="请输入关键字"
            v-model="queryInfo.keyWord"
            suffix-icon="el-icon-search"
            class="input-with-select"
            @focus="setPageNum"
            @input="getStudentData"
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
                label="学生学号"
                value="studentCode"
              />
              <el-option
                label="学生姓名"
                value="studentName"
              />
            </el-select>
          </el-input>
        </el-col>
        <!--    按钮区域列-->
        <el-col :span="2">
          <el-row>
            <el-tooltip
              effect="dark"
              content="添加学生(需要选择容器进行绑定)"
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
      </div>
      <div>
        <el-radio-group
          :disabled="isSearchType"
          @change="getStudentData"
          v-model="queryInfo.searchType"
          size="medium"
        >
          <el-radio
            label="全部"
            border
          >
            全部
          </el-radio>
          <el-radio
            label="参军"
            border
          >
            参军
          </el-radio>
          <el-radio
            label="待安置"
            border
          >
            待安置
          </el-radio>
          <el-radio
            label="已安置"
            border
          >
            已安置
          </el-radio>
          <el-radio
            label="拟升学"
            border
          >
            拟升学
          </el-radio>
        </el-radio-group>

        <!-- 导入导出表格数据 -->
        <el-tooltip
          style="margin-left: 45px"
          effect="dark"
          content="上传Excel文件数据导入到系统"
          placement="top"
        >
          <el-button
            type="primary"
            icon="el-icon-upload2"
            native-type=""
            circle
            @click="inputStudentData"
          />
        </el-tooltip>
        <input
          type="file"
          id="fileInput"
          ref="inputer"
          @change="handleFileChange"
          style="display: none"
        >
        <el-tooltip
          style="margin-left: 10px"
          effect="dark"
          content="导出当前表格数据并保存为Excel文件"
          placement="top"
        >
          <el-button
            type="primary"
            icon="el-icon-download"
            circle
            @click="exportStudentData"
          />
        </el-tooltip>
      </div>
    </el-row>

    <!--  表格数据区域-->
    <el-table
      :data="tableData"
      border
      stripe
      style="width: 100%"
    >
      <el-table-column
        type="index"
        align="center"
        label="#"
      />
      <el-table-column
        label="学生届数"
        align="center"
        prop="studentLevel"
      />
      <el-table-column
        label="所属专业"
        align="center"
        prop="toProfession"
        width="150px"
      />
      <el-table-column
        label="所属班级"
        align="center"
        prop="toClasses"
        width="100px"
      />
      <el-table-column
        label="学生学号"
        align="center"
        prop="studentCode"
        width="120px"
      />
      <el-table-column
        label="学生姓名"
        align="center"
        prop="studentName"
        width="120px"
      />
      <el-table-column
        label="学生性别"
        align="center"
        prop="studentSex"
      />
      <el-table-column
        label="学生电话"
        align="center"
        prop="studentPhone"
        width="160px"
      />
      <el-table-column
        label="就业状态"
        align="center"
        prop="employmentStatus"
        width="120px"
      />
      <el-table-column
        label="实习单位名称"
        align="center"
        prop="companyName"
        width="180px"
      />
      <el-table-column
        label="实习单位地址"
        align="center"
        prop="companyAddress"
        width="160px"
      />
      <el-table-column
        label="岗位名称"
        align="center"
        prop="postName"
      />
      <el-table-column
        label="实习薪资"
        align="center"
        prop="studentSalary"
      />
      <el-table-column
        label="实习单位电话"
        align="center"
        prop="companyPhone"
        width="160px"
      />
      <el-table-column
        label="指导老师姓名"
        align="center"
        prop="teacherName"
        width="120px"
      />
      <el-table-column
        label="指导老师电话"
        align="center"
        prop="teacherPhone"
        width="160px"
      />
      <el-table-column
        label="学生状态"
        align="center"
        prop="studentStatus"
      />
      <el-table-column
        label="创建时间"
        align="center"
        prop="addTime"
        width="120px"
      />
      <el-table-column
        label="操作"
        align="center"
        fixed="right"
        width="180px"
      >
        <!-- 操作按钮区域的作用域插槽-->
        <template slot-scope="scope">
          <el-tooltip
            effect="dark"
            content="回访信息(可查看学生每个月的信息变更动态)"
            placement="top"
          >
            <el-button
              type="primary"
              icon="el-icon-s-order"
              circle
              @click="returnVisitDialogVisible1(scope.row)"
            />
          </el-tooltip>
          <el-tooltip
            effect="dark"
            content="编辑学生(可编辑学生所有信息)"
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
            content="删除学生(可删除学生全部数据)"
            placement="top"
          >
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              @click="deleteDialogVisible1(scope.row.studentCode)"
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

    <!--    添加学生对话框区域-->
    <el-dialog
      title="添加学生"
      :visible.sync="addDialogVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <!--      对话框主体区域-->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item
          label="学生学号"
          prop="studentCode"
        >
          <el-input v-model="addForm.studentCode" />
        </el-form-item>
        <el-form-item
          label="学生名称"
          prop="studentName"
        >
          <el-input v-model="addForm.studentName" />
        </el-form-item>
        <el-form-item
          label="学生性别"
          prop="studentSex"
        >
          <el-radio-group
            v-model="addForm.studentSex"
            size="medium"
          >
            <el-radio
              label="男生"
              border
            >
              男生
            </el-radio>
            <el-radio
              label="女生"
              border
            >
              女生
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <!--        联动菜单-->
        <el-form-item
          label="专业班级"
          prop="classesAndProfesion"
          width="200px"
        >
          <el-cascader
            placeholder="试试搜索专业或班级名"
            v-model="addForm.classesAndProfesion"
            :options="cascaderOptions"
            :props="{ expandTrigger: 'hover' }"
            filterable
            clearable
            separator=" -> "
          />
        </el-form-item>
        <el-form-item
          label="学生电话"
          prop="studentPhone"
        >
          <el-input v-model="addForm.studentPhone" />
        </el-form-item>
        <el-form-item
          label="学生状态"
          prop="studentStatus"
        >
          <el-radio-group
            v-model="addForm.studentStatus"
            size="medium"
          >
            <el-radio
              label="良好"
              border
            >
              良好
            </el-radio>
            <el-radio
              label="一般"
              border
            >
              一般
            </el-radio>
            <el-radio
              label="其他"
              border
            >
              其他
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="指导老师姓名"
          prop="teacherName"
        >
          <el-input v-model="addForm.teacherName" />
        </el-form-item>
        <el-form-item
          label="指导老师电话"
          prop="teacherPhone"
        >
          <el-input v-model="addForm.teacherPhone" />
        </el-form-item>
        <el-form-item
          label="就业状态"
          prop="employmentStatus"
        >
          <el-radio-group
            v-model="addForm.employmentStatus"
            size="medium"
          >
            <el-radio
              label="参军"
              border
            >
              参军
            </el-radio>
            <el-radio
              label="待安置"
              border
            >
              待安置
            </el-radio>
            <el-radio
              label="已安置"
              border
            >
              已安置
            </el-radio>
            <el-radio
              label="拟升学"
              border
            >
              拟升学
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="addForm.employmentStatus === '已安置'"
          label="实习单位名称"
          prop="companyName"
        >
          <el-input v-model="addForm.companyName" />
        </el-form-item>
        <el-form-item
          v-if="addForm.employmentStatus === '已安置'"
          label="岗位名称"
          prop="postName"
        >
          <el-input v-model="addForm.postName" />
        </el-form-item>
        <el-form-item
          v-if="addForm.employmentStatus === '已安置'"
          label="实习薪资"
          prop="studentSalary"
        >
          <el-input v-model="addForm.studentSalary" />
        </el-form-item>
        <el-form-item
          v-if="addForm.employmentStatus === '已安置'"
          label="实习单位电话"
          prop="companyPhone"
        >
          <el-input v-model="addForm.companyPhone" />
        </el-form-item>
        <el-form-item
          v-if="addForm.employmentStatus === '已安置'"
          label="企业地址"
          prop="companyAddress"
          width="200px"
        >
          <el-cascader
            size="large"
            :options="chinaAddress"
            v-model="companyAddressTemp"
            :props="{ expandTrigger: 'hover' }"
            filterable
            clearable
            separator=" -> "
            placeholder="试试搜索省或城市"
          />
        </el-form-item>
        <el-form-item
          label="回访情况"
          prop="returnVisit"
        >
          <el-input v-model="addForm.returnVisit" />
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
          @click="addstudent"
        >添加学生</el-button>
      </span>
    </el-dialog>

    <!--    修改学生信息对话框-->
    <el-dialog
      title="修改信息"
      :visible.sync="editDialogVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <!--      对话框主体区域-->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item
          label="学生学号"
          prop="studentCode"
        >
          <el-input v-model="editForm.studentCode" />
        </el-form-item>
        <el-form-item
          label="学生名称"
          prop="studentName"
        >
          <el-input v-model="editForm.studentName" />
        </el-form-item>
        <el-form-item
          label="学生性别"
          prop="studentSex"
        >
          <el-radio-group
            v-model="editForm.studentSex"
            size="medium"
          >
            <el-radio
              label="男生"
              border
            >
              男生
            </el-radio>
            <el-radio
              label="女生"
              border
            >
              女生
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <!--        联动菜单-->
        <el-form-item
          label="专业班级"
          prop="classesAndProfesion"
          width="200px"
        >
          <el-cascader
            placeholder="试试搜索专业或班级名"
            v-model="editForm.classesAndProfesion"
            :options="cascaderOptions"
            :props="{ expandTrigger: 'hover' }"
            filterable
            clearable
            separator=" -> "
          />
        </el-form-item>
        <el-form-item
          label="学生电话"
          prop="studentPhone"
        >
          <el-input v-model="editForm.studentPhone" />
        </el-form-item>
        <el-form-item
          label="学生状态"
          prop="studentStatus"
        >
          <el-radio-group
            v-model="editForm.studentStatus"
            size="medium"
          >
            <el-radio
              label="良好"
              border
            >
              良好
            </el-radio>
            <el-radio
              label="一般"
              border
            >
              一般
            </el-radio>
            <el-radio
              label="其他"
              border
            >
              其他
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="指导老师姓名"
          prop="teacherName"
        >
          <el-input v-model="editForm.teacherName" />
        </el-form-item>
        <el-form-item
          label="指导老师电话"
          prop="teacherPhone"
        >
          <el-input v-model="editForm.teacherPhone" />
        </el-form-item>
        <el-form-item
          label="就业状态"
          prop="employmentStatus"
        >
          <el-radio-group
            v-model="editForm.employmentStatus"
            size="medium"
          >
            <el-radio
              label="参军"
              border
            >
              参军
            </el-radio>
            <el-radio
              label="待安置"
              border
            >
              待安置
            </el-radio>
            <el-radio
              label="已安置"
              border
            >
              已安置
            </el-radio>
            <el-radio
              label="拟升学"
              border
            >
              拟升学
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="editForm.employmentStatus === '已安置'"
          label="实习单位名称"
          prop="companyName"
        >
          <el-input v-model="editForm.companyName" />
        </el-form-item>
        <el-form-item
          v-if="editForm.employmentStatus === '已安置'"
          label="岗位名称"
          prop="postName"
        >
          <el-input v-model="editForm.postName" />
        </el-form-item>
        <el-form-item
          v-if="editForm.employmentStatus === '已安置'"
          label="实习薪资"
          prop="studentSalary"
        >
          <el-input v-model="editForm.studentSalary" />
        </el-form-item>
        <el-form-item
          v-if="editForm.employmentStatus === '已安置'"
          label="实习单位电话"
          prop="companyPhone"
        >
          <el-input v-model="editForm.companyPhone" />
        </el-form-item>
        <el-form-item
          v-if="editForm.employmentStatus === '已安置'"
          label="企业地址"
          prop="companyAddress"
          width="200px"
        >
          <el-cascader
            size="large"
            :options="chinaAddress"
            v-model="companyAddressTemp"
            :props="{ expandTrigger: 'hover' }"
            filterable
            clearable
            separator=" -> "
            placeholder="试试搜索省或城市"
          />
        </el-form-item>
        <el-form-item
          label="回访情况"
          prop="returnVisit"
        >
          <el-input v-model="editForm.returnVisit" />
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
          @click="editstudent"
        >修改信息</el-button>
      </span>
    </el-dialog>

    <!-- 学生回访信息对话框 -->
    <el-dialog
      title="学生回访信息"
      :visible.sync="returnVisitDialogVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <!--      对话框主体区域-->
      <el-form
        label-width="100px"
      >
        <el-form-item
          label="学生学号"
        >
          <el-input
            v-model="returnVisitForm.studentCode"
            disabled
          />
        </el-form-item>
        <el-form-item
          label="学生名称"
        >
          <el-input
            v-model="returnVisitForm.studentName"
            disabled
          />
        </el-form-item>
        <el-form-item
          v-for="(item, index) in returnVisitForm.monthData"
          :label="`${index+1}月回访情况`"
          :key="index"
        >
          <el-input
            v-model="item[index+1]"
            disabled
            :class="[item[index+1]!=='本月无变动'?'my-input':'']"
          />
        </el-form-item>
      </el-form>
      <!--      对话框底部区域-->
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="returnVisitDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <!--    删除学生对话框-->
    <el-dialog
      title="删除学生"
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
          @click="deletestudent"
        >删除学生</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 导入省市数据及解释器
import { provinceAndCityData, CodeToText } from 'element-china-area-data'

export default {
  name: 'StudentData',
  data () {
    return {
      c: CodeToText,
      // 企业地址数据
      chinaAddress: provinceAndCityData,
      noEmployment: [
        { value: '参军', label: '参军' },
        { value: '待就业', label: '待就业' },
        { value: '拟升学', label: '拟升学' },
        { value: '已安置', label: '已安置' }
      ],
      // 联动菜单数据
      cascaderOptions: [],
      /** 数据表格 */
      // 数据表格数据绑定
      queryInfo: {
        // 当前搜索关键字
        keyWord: '',
        // 当前搜索类型(按照学号或者名称)
        queryType: 'noSearch',
        // 数据展示类型(默认显示所有数据)
        searchType: '全部',
        // 当前页数
        pageNum: 1,
        // 当前每页显示多少条数据
        pageSize: 5
      },
      // 显示学生数据是否附带显示类型
      isSearchType: false,
      // 数据表格数据
      tableData: [],
      // 总共多少条数据
      total: 0,
      /** 控制添加学生对话框的显示与隐藏 */
      addDialogVisible: false,
      /** 控制修改学生对话框的显示与隐藏 */
      editDialogVisible: false,
      /** 控制删除学生对话框的显示与隐藏 */
      deleteDialogVisible: false,
      /** 控制学生回访信息对话框的显示与隐藏 */
      returnVisitDialogVisible: false,
      /** 控制文件上传对话框的显示与隐藏 */
      uploadDialogVisible: true,
      /** 公共的单位地址临时属性 */
      companyAddressTemp: '',
      /** 新增学生表单数据 */
      addForm: {
        studentCode: '',
        studentName: '',
        studentSex: '',
        studentPhone: '',
        employmentStatus: '',
        companyName: '',
        postName: '',
        studentSalary: 0,
        companyPhone: '',
        companyAddress: '',
        teacherName: '',
        teacherPhone: '',
        studentStatus: '',
        classesAndProfesion: [],
        // 回访情况
        returnVisit: '本月无变动'
      },
      /** 表单验证相关配置 */
      addFormRules: {
        studentCode: [
          {
            required: true,
            message: '请输入学生学号',
            trigger: 'blur'
          },
          {
            min: 4,
            max: 21,
            message: '长度在 4 到 21 个字符',
            trigger: 'blur'
          }
        ],
        studentName: [
          {
            required: true,
            message: '请输入学生名称',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 5,
            message: '长度在 2 到 5 个字符',
            trigger: 'blur'
          }
        ],
        studentSex: [
          {
            required: true,
            message: '请选择学生性别',
            trigger: 'blur'
          }
        ],
        classesAndProfesion: [
          {
            required: true,
            message: '请选择专业班级绑定',
            trigger: 'blur'
          }
        ],
        studentPhone: [
          {
            required: true,
            message: '请输入学生电话',
            trigger: 'blur'
          },
          {
            min: 11,
            max: 11,
            message: '长度 11 个字符',
            trigger: 'blur'
          }
        ],
        studentStatus: [
          {
            required: true,
            message: '请选择学生状态'
          }
        ],
        teacherName: [
          {
            required: true,
            message: '请输入指导老师姓名',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 5,
            message: '长度在 2 到 5 个字符',
            trigger: 'blur'
          }
        ],
        teacherPhone: [
          {
            required: true,
            message: '请输入指导老师电话',
            trigger: 'blur'
          },
          {
            min: 11,
            max: 11,
            message: '长度 11 个字符',
            trigger: 'blur'
          }
        ],
        employmentStatus: [
          {
            required: true,
            message: '请选择学生就业状态'
          }
        ],
        companyName: [
          {
            required: true,
            message: '请输入实习单位名称',
            trigger: 'blur'
          },
          {
            min: 2,
            message: '长度在至少 2 个字符',
            trigger: 'blur'
          }
        ],
        postName: [
          {
            required: true,
            message: '请输入实习岗位名称',
            trigger: 'blur'
          },
          {
            min: 2,
            message: '长度在至少 2 个字符',
            trigger: 'blur'
          }
        ],
        studentSalary: [
          {
            required: true,
            message: '请输入实习薪资',
            trigger: 'blur'
          }
        ],
        companyPhone: [
          {
            required: true,
            message: '请输入实习单位电话',
            trigger: 'blur'
          },
          {
            min: 11,
            max: 11,
            message: '长度 11 个字符',
            trigger: 'blur'
          }
        ],
        companyAddress: [
          {
            required: true,
            message: '请选择实习单位地址',
            trigger: 'blur'
          }
        ],
        returnVisit: [
          {
            required: true,
            message: '请输入本月回访情况',
            trigger: 'blur'
          },
          {
            min: 4,
            message: '长度在至少 4 个字符',
            trigger: 'blur'
          }
        ]
      },
      /** 修改学生表单数据 */
      editForm: {
        studentCode: '',
        studentName: '',
        studentSex: '',
        studentPhone: '',
        employmentStatus: '',
        companyName: '',
        postName: '',
        studentSalary: 0,
        companyPhone: '',
        companyAddress: '',
        teacherName: '',
        teacherPhone: '',
        studentStatus: '',
        classesAndProfesion: [],
        // 回访情况
        returnVisit: '本月无变动'
      },
      /** 编辑表单验证相关配置 */
      editFormRules: {
        studentCode: [
          {
            required: true,
            message: '请输入学生学号',
            trigger: 'blur'
          },
          {
            min: 4,
            max: 21,
            message: '长度在 4 到 21 个字符',
            trigger: 'blur'
          }
        ],
        studentName: [
          {
            required: true,
            message: '请输入学生名称',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 5,
            message: '长度在 2 到 5 个字符',
            trigger: 'blur'
          }
        ],
        studentSex: [
          {
            required: true,
            message: '请选择学生性别',
            trigger: 'blur'
          }
        ],
        classesAndProfesion: [
          {
            required: true,
            message: '请选择专业班级绑定',
            trigger: 'blur'
          }
        ],
        studentPhone: [
          {
            required: true,
            message: '请输入学生电话',
            trigger: 'blur'
          },
          {
            min: 11,
            max: 11,
            message: '长度 11 个字符',
            trigger: 'blur'
          }
        ],
        studentStatus: [
          {
            required: true,
            message: '请选择学生状态'
          }
        ],
        teacherName: [
          {
            required: true,
            message: '请输入指导老师姓名',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 5,
            message: '长度在 2 到 5 个字符',
            trigger: 'blur'
          }
        ],
        teacherPhone: [
          {
            required: true,
            message: '请输入指导老师电话',
            trigger: 'blur'
          },
          {
            min: 11,
            max: 11,
            message: '长度 11 个字符',
            trigger: 'blur'
          }
        ],
        employmentStatus: [
          {
            required: true,
            message: '请选择学生就业状态'
          }
        ],
        companyName: [
          {
            required: true,
            message: '请输入实习单位名称',
            trigger: 'blur'
          },
          {
            min: 2,
            message: '长度在至少 2 个字符',
            trigger: 'blur'
          }
        ],
        postName: [
          {
            required: true,
            message: '请输入实习岗位名称',
            trigger: 'blur'
          },
          {
            min: 2,
            message: '长度在至少 2 个字符',
            trigger: 'blur'
          }
        ],
        studentSalary: [
          {
            required: true,
            message: '请输入实习薪资',
            trigger: 'blur'
          }
        ],
        companyPhone: [
          {
            required: true,
            message: '请输入实习单位电话',
            trigger: 'blur'
          },
          {
            min: 11,
            max: 11,
            message: '长度 11 个字符',
            trigger: 'blur'
          }
        ],
        companyAddress: [
          {
            required: true,
            message: '请选择实习单位地址',
            trigger: 'blur'
          }
        ],
        returnVisit: [
          {
            required: true,
            message: '请输入本月回访情况',
            trigger: 'blur'
          },
          {
            min: 4,
            message: '长度在至少 4 个字符',
            trigger: 'blur'
          }
        ]
      },
      /** 回访信息表单数据 */
      returnVisitForm: {
        studentCode: '',
        studentName: ''
      }
    }
  },
  // 监控数据改变
  watch: {
    // 当用户选择搜索学生的前置条件则锁定筛选数据类型为全部数据并禁用单选框否则应该清空输入框数据
    'queryInfo.queryType': function (val) {
      if (val !== 'noSearch') {
        this.queryInfo.searchType = '全部'
        this.isSearchType = true
      } else {
        this.isSearchType = false
        this.queryInfo.keyWord = ''
        this.getStudentData()
      }
    },
    // 当用户点击创建学生按钮addDialogVisible为true就可以获取相应数据了
    addDialogVisible: function (val) {
      if (val) {
        this.getProfessionAndClassesDataCascaderOptions()
      }
    },
    editDialogVisible: function (val) {
      if (val) {
        this.getProfessionAndClassesDataCascaderOptions()
      }
    },
    // 当添加学生对话框选择未就业则设置与就业有关的字段为待安置
    'addForm.employmentStatus': function (val) {
      if (val !== '已安置') {
        this.addForm.companyPhone = '待安置'
        this.addForm.companyName = '待安置'
        this.addForm.postName = '待安置'
        this.addForm.companyAddress = '待安置'
      } else {
        this.addForm.companyPhone = ''
        this.addForm.companyName = ''
        this.addForm.postName = ''
        this.companyAddressTemp = ''
      }
    },
    // 城市代码数组转换为字符串
    'companyAddressTemp': function (val) {
      this.addForm.companyAddress = CodeToText[val[0]] + '-' + CodeToText[val[1]]
      this.editForm.companyAddress = CodeToText[val[0]] + '-' + CodeToText[val[1]]
    }
  },
  /** 生命周期函数 */
  created () {
    // 这里是发起表格数据请求的位置
    this.getstudentData()
    this.getProfessionAndClassesDataCascaderOptions()
  },
  /** 事件处理函数 */
  methods: {
    /** 修复当用户在大于1的分页进行数据搜索没有返回值的问题 */
    setPageNum () {
      this.queryInfo.pageNum = 1
      this.getStudentData()
    },
    // 清除修改学生就业状态表单的验证结果
    clearFrom () {
      this.$refs.employmentStatusFormRef.clearValidate()
    },
    /** 获取专业及班级数据 */
    async getProfessionAndClassesDataCascaderOptions () {
      let formData = JSON.stringify({
        useraction: 'getProfessionAndClassesDataCascaderOptions',
        username: window.sessionStorage.getItem('username')
      })
      // 提交表单
      const result = await this.$http.post('/data/', formData)
      // 判断业务逻辑
      if (result.data.ret === 0) {
        this.cascaderOptions = result.data.data
        return
      }
      this.$message({
        message: '读取数据失败！',
        type: 'error',
        showClose: true,
        center: true
      })
    },

    /** 获取学生信息 */
    async getStudentData () {
      this.queryInfo.pageNum = 1
      let formData = JSON.stringify({
        useraction: 'getStudentData',
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

    /** 添加学生操作 */
    addstudent () {
      this.$refs.addFormRef.validate(async valid => {
        if (valid) {
          let formData = JSON.stringify({
            useraction: 'addstudent',
            username: window.sessionStorage.getItem('username'),
            ...this.addForm
          })
          console.log(formData)
          // 提交登出请求
          const result = await this.$http.post('/data/', formData)
          if (result.data.ret === 0) {
            this.$message({
              message: result.data.data,
              type: 'success',
              showClose: true,
              center: true
            })
            this.addDialogVisible = false
            this.getstudentData()
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

    /** 修改学生操作 */
    editDialogVisible1 (studentData) {
      // 对象复制
      for (let key in studentData) {
        // 防止待安置地学生数据污染已安置选项中的输入框
        if (studentData[key] !== '待安置') {
          this.editForm[key] = studentData[key]
        } else {
          this.editForm[key] = ''
        }
      }
      // 遍历处理班级专业自动显示
      let cascaderOptions = this.cascaderOptions
      let arr = []
      for (let i = 0; i < cascaderOptions.length; i++) {
        // 获取专业代号
        if (studentData.toProfession === cascaderOptions[i].label) {
          arr.push(cascaderOptions[i].value)
          for (let ii = 0; ii < cascaderOptions[i].children.length; ii++) {
            // 获取班级代号
            if (studentData.toClasses === cascaderOptions[i].children[ii].label) {
              arr.push(cascaderOptions[i].children[ii].value)
            }
          }
        }
      }
      this.editForm.classesAndProfesion = arr

      // 自动显示单位地址
      let chinaAddress = this.chinaAddress
      let address = studentData.companyAddress.split('-')
      let arr1 = []
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
      this.companyAddressTemp = arr1
      this.editDialogVisible = true
    },
    editstudent () {
      this.$refs.editFormRef.validate(async valid => {
        if (valid) {
          // 学生信息修改页面当学生未就业设置有关字段为待安置
          if (this.editForm.employmentStatus !== '已安置') {
            this.editForm.companyPhone = '待安置'
            this.editForm.companyName = '待安置'
            this.editForm.postName = '待安置'
            this.editForm.companyAddress = '待安置'
            this.editForm.studentSalary = 0
          }
          let formData = JSON.stringify({
            useraction: 'editStudent',
            username: window.sessionStorage.getItem('username'),
            ...this.editForm
          })
          const result = await this.$http.post('/data/', formData)
          if (result.data.ret === 0) {
            this.$message({
              message: result.data.data,
              type: 'success',
              showClose: true,
              center: true
            })
            this.editDialogVisible = false
            this.getstudentData()
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

    /** 查看学生回访信息 */
    async returnVisitDialogVisible1 (studentData) {
      let formData = JSON.stringify({
        useraction: 'returnVisitData',
        username: window.sessionStorage.getItem('username'),
        studentCode: studentData.studentCode
      })
      // 提交表单
      const result = await this.$http.post('/data/', formData)
      // 判断业务逻辑
      if (result.data.ret === 0) {
        this.returnVisitForm = result.data.data[0]
        // 组装月份资料
        let monthData = []
        let index = 0
        for (let i in result.data.data[0]) {
          if (i !== 'statusID' && i !== 'addTime' && i !== 'studentCode') {
            ++index
            monthData.push({ [index]: result.data.data[0][i] })
          }
        }
        this.returnVisitForm.monthData = monthData
        this.returnVisitForm.studentName = studentData.studentName
        this.returnVisitDialogVisible = true
        return
      }
      this.$message({
        message: '读取数据失败！',
        type: 'error',
        showClose: true,
        center: true
      })
    },

    /** 删除学生操作 */
    deleteDialogVisible1 (studentCode) {
      this.studentCode = studentCode
      this.deleteDialogVisible = true
    },
    async deletestudent () {
      var deletestudentCode = this.studentCode
      let formData = JSON.stringify({
        useraction: 'deleteStudent',
        username: window.sessionStorage.getItem('username'),
        studentCode: deletestudentCode
      })
      const result = await this.$http.post('/data/', formData)
      if (result.data.ret === 0) {
        this.$message({
          message: result.data.data,
          type: 'success',
          showClose: true,
          center: true
        })
        this.deleteDialogVisible = false
        this.getstudentData()
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

    /** 获取学生管理页面的学生列表数据 */
    async getstudentData () {
      let formData = JSON.stringify({
        useraction: 'getStudentData',
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

    /** 监听每页显示多少数据的改变 */
    handleSizeChange (newSize) {
      this.queryInfo.pageSize = newSize
      this.getstudentData()
    },

    /** 监听页码的改变 */
    handleCurrentChange (newPage) {
      this.queryInfo.pageNum = newPage
      this.getstudentData()
    },

    /** 导出学生数据为Excel文件 */
    async exportStudentData () {
      let message = this.$message
      let formData = JSON.stringify({
        useraction: 'exportStudentData',
        username: window.sessionStorage.getItem('username'),
        getDataType: this.queryInfo.searchType
      })
      // 提交表单
      this.$http({
        method: 'post',
        url: '/data/',
        data: formData,
        responseType: 'blob'
      }).then(res => {
        console.log()
        if (res.data.size <= 106) {
          return message({ message: '此类型数据为空，不提供下载！', type: 'warning', showClose: true, center: true })
        }
        let blod = new Blob([res.data], { type: '' })
        let url = URL.createObjectURL(blod)
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url.toString() // 将buffer转为文本
        link.setAttribute('download', '学生就业管理系统学生数据.xlsx')
        document.body.appendChild(link)
        link.click()
      })
    },

    /** 导入学生数据Excel文件 */
    inputStudentData () {
      let input = document.getElementById('fileInput')
      document.body.appendChild(input)
      input.click()
    },
    handleFileChange (e) {
      let inputDOM = this.$refs.inputer
      let fileobj = inputDOM.files[0]// 通过DOM取文件数据
      let fileType = fileobj.type.split('.')[1]
      if (fileType === 'xls' || fileType === 'xlsx') {
        let formData = new FormData()// new一个formData事件
        formData.append('useraction', 'inputStudentData')
        formData.append('username', window.sessionStorage.getItem('username'))
        formData.append('file', fileobj) // 将file属性添加到formData里
        // 此时formData就是我们要向后台传的参数了
        this.$http({
          url: '/data/',
          data: formData, // 在此处上传文件
          method: 'post',
          headers: {
            'Content-Type': 'multipart/form-data' // 值得注意的是，这个地方一定要把请求头更改一下
          }
        }).then(function (res) {
          console.log(res, '此处应该是请求成功的回调')
        }.catch(function (req) {
          console.log(req, '请求失败的回调，自己看看为啥失败')
        }))
      } else {
        this.$message({ message: '请上传以xls或xlsx为后缀的文件！', type: 'warning', showClose: true, center: true })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.input-select {
width: 50px;
}

.el-table {
align-items: center;
margin-top: 25px;
}

.el-pagination {
margin-top: 25px;
}

.el-cascader {
width: 280px;
}

.el-select {
width: 120px;
}

/** 自定义有具体内容的输入框显示特定样式 */
.my-input {
/deep/.el-input__inner {
  color: #409EFF !important;
  font-size: 15px;
  font-weight: bold;
}
}
</style>
