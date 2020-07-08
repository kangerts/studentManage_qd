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
                v-for="(item, index) in selectOption"
                :key="index"
                :label="item.label"
                :value="item.value"
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
                @click="addDialogVisible = true, studentNativePlaceTemp = ''"
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
          ref="fileInputRef"
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
      highlight-current-row
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
        :fixed="table.fixed"
      />
      <el-table-column
        width="168"
        :formatter="dateFormatter"
        label="修改时间"
        prop="addTime"
        align="center"
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
            content="查看企业(可查看本学生所在的企业)"
            placement="top"
          >
            <el-button
              type="info"
              icon="el-icon-view"
              circle
              @click="toEnterpriseShow(scope.row.enterpriseName)"
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
      <el-form
        v-if="addDialogVisible"
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item
          label="学生学号"
          prop="studentCode"
        >
          <el-input
            v-model="addForm.studentCode"
            onkeyup="value=value.replace(/[^\d]/g,'')"
          />
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
        <el-form-item
          label="学生籍贯"
          prop="studentNativePlace"
        >
          <el-cascader
            style="width: 360px"
            placeholder="试试搜索城市名称吧~"
            v-model="studentNativePlaceTemp"
            :options="studentNativePlaceCascaderOptions"
            :props="{ expandTrigger: 'hover' }"
            filterable
            clearable
            separator=" -> "
          />
        </el-form-item>
        <el-form-item
          label="专业班级"
          prop="classesAndProfesion"
          width="200px"
        >
          <el-cascader
            style="width: 360px"
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
          <el-input
            v-model="addForm.studentPhone"
            onkeyup="value=value.replace(/[^\d]/g,'')"
          />
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
          label="直属主管"
          prop="teacherName"
        >
          <el-input v-model="addForm.teacherName" />
        </el-form-item>
        <el-form-item
          label="主管电话"
          prop="teacherPhone"
        >
          <el-input
            v-model="addForm.teacherPhone"
            onkeyup="value=value.replace(/[^\d]/g,'')"
          />
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
          label="实习薪资"
          prop="studentSalary"
        >
          <el-input v-model="addForm.studentSalary" />
        </el-form-item>
        <el-form-item
          v-if="addForm.employmentStatus === '已安置'"
          label="企业岗位"
          prop="enterpriseAndPostData"
          width="200px"
        >
          <el-cascader
            style="width: 360px"
            size="large"
            :options="postDataCascaderOptions"
            v-model="addForm.enterpriseAndPostData"
            :props="{ expandTrigger: 'hover' }"
            filterable
            clearable
            separator=" -> "
            placeholder="试试搜索企业名称或岗位"
          />
        </el-form-item>
        <el-form-item
          v-if="addForm.employmentStatus === '已安置'"
          label="岗位职责"
          prop="postDuty"
        >
          <el-input
            autosize
            type="textarea"
            v-model="addForm.postDuty"
          />
        </el-form-item>
        <el-form-item
          label="备注"
          prop="remarks"
        >
          <el-input
            autosize
            type="textarea"
            v-model="addForm.remarks"
          />
        </el-form-item>
      </el-form>
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
      <el-form
        v-if="editDialogVisible"
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item
          label="学生学号"
          prop="studentCode"
        >
          <el-input
            v-model="editForm.studentCode"
            onkeyup="value=value.replace(/[^\d]/g,'')"
          />
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
        <el-form-item
          label="学生籍贯"
          prop="studentNativePlace"
        >
          <el-cascader
            style="width: 360px"
            placeholder="试试搜索城市名称吧~"
            v-model="studentNativePlaceTemp"
            :options="studentNativePlaceCascaderOptions"
            :props="{ expandTrigger: 'hover' }"
            filterable
            clearable
            separator=" -> "
          />
        </el-form-item>
        <el-form-item
          label="专业班级"
          prop="classesAndProfesion"
          width="200px"
        >
          <el-cascader
            style="width: 360px"
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
          <el-input
            v-model="editForm.studentPhone"
            onkeyup="value=value.replace(/[^\d]/g,'')"
          />
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
          label="直属主管"
          prop="teacherName"
        >
          <el-input v-model="editForm.teacherName" />
        </el-form-item>
        <el-form-item
          label="主管电话"
          prop="teacherPhone"
        >
          <el-input
            v-model="editForm.teacherPhone"
            onkeyup="value=value.replace(/[^\d]/g,'')"
          />
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
          label="实习薪资"
          prop="studentSalary"
        >
          <el-input v-model="editForm.studentSalary" />
        </el-form-item>
        <el-form-item
          v-if="editForm.employmentStatus === '已安置'"
          label="企业岗位"
          prop="enterpriseAndPostData"
          width="200px"
        >
          <el-cascader
            style="width: 360px"
            size="large"
            :options="postDataCascaderOptions"
            v-model="editForm.enterpriseAndPostData"
            :props="{ expandTrigger: 'hover' }"
            filterable
            clearable
            separator=" -> "
            placeholder="试试搜索企业名称或岗位"
          />
        </el-form-item>
        <el-form-item
          v-if="editForm.employmentStatus === '已安置'"
          label="岗位职责"
          prop="postDuty"
        >
          <el-input
            autosize
            type="textarea"
            v-model="editForm.postDuty"
          />
        </el-form-item>
        <el-form-item
          label="备注"
          prop="remarks"
        >
          <el-input
            autosize
            type="textarea"
            v-model="editForm.remarks"
          />
        </el-form-item>
      </el-form>
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

    <!--    删除学生对话框-->
    <el-dialog
      title="删除学生"
      :visible.sync="deleteDialogVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <span>确认删除吗?</span>
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
import moment from 'moment'

export default {
  name: 'StudentData',
  data () {
    return {
      selectOption: [
        { value: 'noSearch', label: '暂无搜索' },
        { value: 'studentCode', label: '学生学号' },
        { value: 'studentName', label: '学生姓名' },
        { value: 'studentSex', label: '学生性别' },
        { value: 'employmentStatus', label: '就业状态' },
        { value: 'studentNativePlace', label: '学生籍贯' },
        { value: 'classesName', label: '班级名称' }
      ],
      tableHeader: [
        { label: '学生学号', prop: 'studentCode', width: 150, fixed: 'left' },
        { label: '学生姓名', prop: 'studentName', width: 150, fixed: 'left' },
        { label: '学生性别', prop: 'studentSex', width: 100 },
        { label: '学生届数', prop: 'studentLevel', width: 100 },
        { label: '所属专业', prop: 'toProfession', width: 150 },
        { label: '所属班级', prop: 'toClasses', width: 150 },
        { label: '学生籍贯', prop: 'studentNativePlace', width: 120 },
        { label: '学生电话', prop: 'studentPhone', width: 180 },
        { label: '就业状态', prop: 'employmentStatus', width: 100 },
        { label: '企业名称', prop: 'enterpriseName', width: 200 },
        { label: '企业地址', prop: 'enterpriseAddress', width: 300 },
        { label: '联系企业', prop: 'enterprisePhone', width: 180 },
        { label: '岗位名称', prop: 'postName', width: 300 },
        { label: '工作地址', prop: 'postAddress', width: 200 },
        { label: '最新薪资', prop: 'studentSalary', width: 150 },
        { label: '直属主管', prop: 'teacherName', width: 150 },
        { label: '主管电话', prop: 'teacherPhone', width: 180 },
        { label: '更新教师', prop: 'updateTeacherName', width: 120 },
        { label: '学生状态', prop: 'studentStatus', width: 120 }
      ],
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
      /** 企业岗位联级菜单数据 */
      postDataCascaderOptions: '',
      /** 学生籍贯地址联级菜单数据 */
      studentNativePlaceCascaderOptions: provinceAndCityData,
      /** 学生籍贯地址临时属性 */
      studentNativePlaceTemp: '',
      /** 新增学生表单数据 */
      addForm: {
        studentCode: '',
        studentName: '',
        studentSex: '',
        studentNativePlace: '',
        classesAndProfesion: [],
        studentPhone: '',
        studentStatus: '',
        teacherName: '',
        teacherPhone: '',
        employmentStatus: '',
        studentSalary: 0,
        enterpriseAndPostData: [],
        postDuty: '',
        remarks: ''
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
        studentNativePlace: [
          {
            required: true,
            message: '请选择学生籍贯',
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
            message: '请输入直属主管老师姓名',
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
            message: '请输入直属主管老师电话',
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
        studentSalary: [
          {
            required: true,
            message: '请输入实习薪资',
            trigger: 'blur'
          }
        ],
        enterpriseAndPostData: [
          {
            required: true,
            message: '请选择企业岗位绑定',
            trigger: 'blur'
          }
        ],
        postDuty: [
          {
            required: true,
            message: '请输入岗位职责',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 400,
            message: '长度在 2 到 400 个字符',
            trigger: 'blur'
          }
        ]
      },
      /** 修改学生表单数据 */
      editForm: {
        studentCode: '',
        studentName: '',
        studentSex: '',
        studentNativePlace: '',
        classesAndProfesion: [],
        studentPhone: '',
        studentStatus: '',
        teacherName: '',
        teacherPhone: '',
        employmentStatus: '',
        studentSalary: 0,
        enterpriseAndPostData: [],
        postDuty: '',
        remarks: ''
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
        studentNativePlace: [
          {
            required: true,
            message: '请选择学生籍贯',
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
            message: '请输入直属主管老师姓名',
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
            message: '请输入直属主管老师电话',
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
        studentSalary: [
          {
            required: true,
            message: '请输入实习薪资',
            trigger: 'blur'
          }
        ],
        enterpriseAndPostData: [
          {
            required: true,
            message: '请选择企业岗位绑定',
            trigger: 'blur'
          }
        ],
        postDuty: [
          {
            required: true,
            message: '请输入岗位职责',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 400,
            message: '长度在 2 到 400 个字符',
            trigger: 'blur'
          }
        ]
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
    studentNativePlaceTemp: function (val) {
      if (val.length !== 0) {
        const data = CodeToText[val[0]] + '-' + CodeToText[val[1]]
        this.editForm.studentNativePlace = data
        this.addForm.studentNativePlace = data
      } else {
        this.editForm.studentNativePlace = ''
        this.addForm.studentNativePlace = ''
      }
    }
  },
  /** 生命周期函数 */
  created () {
    // 这里是发起表格数据请求的位置
    this.getProfessionAndClassesDataCascaderOptions()
    this.getPostDataCascaderOptions()

    // 自动识别请求类型及其数据
    const query = this.$route.query
    for (const key in query) {
      if (key !== undefined && key !== '') {
        this.queryInfo.keyWord = query[key]
        this.queryInfo.queryType = key
      }
    }

    this.getStudentData()
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
      const formData = JSON.stringify({
        useraction: 'getProfessionAndClassesCascaderOptions',
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
      const formData = JSON.stringify({
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
          // 修复 多次添加学生信息，已安置学生表单会污染其他表单
          if (this.addForm.employmentStatus !== '已安置') {
            this.addForm.studentSalary = 0
            this.addForm.enterpriseAndPostData = []
            this.addForm.postDuty = ''
          }
          const formData = JSON.stringify({
            useraction: 'addstudent',
            username: window.sessionStorage.getItem('username'),
            ...this.addForm
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
            this.addDialogVisible = false
            this.getStudentData()
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
    async editDialogVisible1 (studentData) {
      // 开启编辑锁
      const formData = JSON.stringify({
        useraction: 'systemEditLocked',
        type: 'editStudent',
        username: window.sessionStorage.getItem('username'),
        code: studentData.studentCode
      })
      const result = await this.$http.post('/data/', formData)
      if (result.data.ret === 0) {
        for (const key in studentData) {
          this.editForm[key] = studentData[key]
        }

        // 自动显示学生籍贯
        const data = studentData.studentNativePlace.split('-')
        const studentNativePlaceCascaderOptions = this.studentNativePlaceCascaderOptions
        const arr0 = []
        for (let k = 0; k < studentNativePlaceCascaderOptions.length; k++) {
          // 获取省份代号
          if (data[0] === studentNativePlaceCascaderOptions[k].label) {
            arr0.push(studentNativePlaceCascaderOptions[k].value)
            for (let j = 0; j < studentNativePlaceCascaderOptions[k].children.length; j++) {
              // 获取城市代号
              if (data[1] === studentNativePlaceCascaderOptions[k].children[j].label) {
                arr0.push(studentNativePlaceCascaderOptions[k].children[j].value)
              }
            }
          }
        }
        this.studentNativePlaceTemp = arr0

        // 遍历处理班级专业自动显示
        const cascaderOptions = this.cascaderOptions
        const arr = []
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

        // 自动显示企业岗位
        const postDataCascaderOptions = this.postDataCascaderOptions
        const enterprisePost = [this.editForm.enterpriseName, this.editForm.postName]
        const arr1 = []
        for (let i = 0; i < postDataCascaderOptions.length; i++) {
          // 获取公司
          if (postDataCascaderOptions[i].label === enterprisePost[0]) {
            arr1.push(postDataCascaderOptions[i].value)
            for (let ii = 0; ii < postDataCascaderOptions[i].children.length; ii++) {
              // 获取岗位
              if (postDataCascaderOptions[i].children[ii].label === enterprisePost[1]) {
                arr1.push(postDataCascaderOptions[i].children[ii].value)
              }
            }
          }
        }
        this.editForm.enterpriseAndPostData = arr1
        this.editDialogVisible = true
      } else {
        this.$message({
          message: result.data.data,
          type: 'error',
          showClose: true,
          center: true
        })
      }
    },
    editstudent () {
      this.$refs.editFormRef.validate(async valid => {
        if (valid) {
          // 修复 多次修改学生信息，已安置学生表单会污染其他表单
          if (this.editForm.employmentStatus !== '已安置') {
            this.editForm.studentSalary = 0
            this.editForm.enterpriseAndPostData = []
            this.editForm.postDuty = ''
          }
          const formData = JSON.stringify({
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
            this.getStudentData()
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

    /** 删除学生操作 */
    deleteDialogVisible1 (studentCode) {
      this.studentCode = studentCode
      this.deleteDialogVisible = true
    },
    async deletestudent () {
      var deletestudentCode = this.studentCode
      const formData = JSON.stringify({
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
        this.getStudentData()
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

    /** 获取企业岗位联级菜单数据 */
    async getPostDataCascaderOptions () {
      const formData = JSON.stringify({
        useraction: 'getPostDataCascaderOptions',
        username: window.sessionStorage.getItem('username')
      })
      // 提交表单
      const result = await this.$http.post('/data/', formData)
      // 判断业务逻辑
      if (result.data.ret === 0) {
        this.postDataCascaderOptions = result.data.data
        return
      }
      this.$message({
        message: '读取数据失败！',
        type: 'error',
        showClose: true,
        center: true
      })
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
      this.getStudentData()
    },

    /** 监听页码的改变 */
    handleCurrentChange (newPage) {
      this.queryInfo.pageNum = newPage
      this.getStudentData()
    },

    /** 导出学生数据为Excel文件 */
    async exportStudentData () {
      const message = this.$message
      const formData = JSON.stringify({
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
        if (res.data.size <= 106) {
          return message({ message: '此类型数据为空，不提供下载！', type: 'warning', showClose: true, center: true })
        }
        const blod = new Blob([res.data], { type: '' })
        const url = URL.createObjectURL(blod)
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = url.toString() // 将buffer转为文本
        link.setAttribute('download', '学生就业管理系统学生数据.xlsx')
        document.body.appendChild(link)
        link.click()
      })
    },

    /** 导入学生数据Excel文件 */
    inputStudentData () {
      const input = document.getElementById('fileInput')
      document.body.appendChild(input)
      input.click()
      // this.$message({ message: '此功能暂未开放，敬请期待！', type: 'warning', showClose: true, center: true })
    },
    async handleFileChange (e) {
      const inputDOM = this.$refs.fileInputRef
      const fileobj = inputDOM.files[0]// 通过DOM取文件数据
      const endFile = fileobj.type.split('.')
      const fileType = endFile[endFile.length - 1]
      if (fileType === 'xls' || fileType === 'xlsx') {
        const formData = new FormData()// new一个formData事件
        formData.append('useraction', 'inputStudentData')
        formData.append('username', window.sessionStorage.getItem('username'))
        formData.append('file', fileobj) // 将file属性添加到formData里
        formData.append('headers', "Content-Type': 'multipart/form-data")
        const result = await this.$http.post('/data/', formData)
        // 判断业务逻辑
        if (result.data.ret === 0) {
          this.$message({ message: result.data.data, type: 'success', showClose: true, center: true })
        } else {
          this.$message({ message: result.data.data, type: 'error', showClose: true, center: true })
        }
      } else {
        this.$message({ message: '请上传以xls或xlsx为后缀的文件！', type: 'warning', showClose: true, center: true })
      }
    },

    /** 跳转到企业数据页面并显示本学生对应的企业 */
    toEnterpriseShow (enterpriseName) {
      if (enterpriseName === '未绑定') {
        return this.$message({
          message: '此学生未绑定企业岗位，暂不支持查看企业！',
          type: 'warning',
          showClose: true,
          center: true
        })
      }
      this.$router.push({
        path: '/admin/enterpriseManage',
        query: {
          enterpriseName: enterpriseName
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
    .el-table {
        align-items: center;
        margin-top: 25px;
    }

    /deep/ .el-col {
        padding-right: 0 !important;
    }

    .el-pagination {
        margin-top: 25px;
    }

    .el-cascader {
        width: 280px;
    }

    .el-select {
        width: 105px;
        height: 100%;
    }

</style>
