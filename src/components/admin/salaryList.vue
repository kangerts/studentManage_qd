<template>
  <div style="width: 100%;height: 500px">
    <el-tooltip
      effect="dark"
      :content="tooltipContent"
      placement="top"
    >
      <el-button
        style="margin-bottom: 15px"
        type="primary"
        icon="el-icon-picture-outline-round"
        circle
        @click="changeViewData"
      />
    </el-tooltip>
    <el-cascader
      style="margin-left: 15px;width: 350px"
      ref="classesCascaderLabel"
      :placeholder="placeholder"
      v-model="cascaderValues"
      :options="cascaderOptions"
      :props="{ expandTrigger: 'hover' }"
      @change="inputChange"
      filterable
      separator=" -> "
    />
    <v-chart
      :options="polar"
      :init-options="initCharts"
      autoresize
      ref="salaryListRef"
      style="width: 100%;margin-top: 25px"
    />
  </div>
</template>

<script>
export default {
  name: 'SalaryList',
  data () {
    return {
      polar: null,
      isView: true,
      tooltipContent: '切换到班级数据显示',
      initCharts: { renderer: 'svg' },
      placeholder: '试试搜索专业名称吧',
      cascaderOptions: [], // 专业班级联动菜单数据
      cascaderValues: '', // 专业班级联动菜单值
      type: 'getProfessionSalaryData' // 获取数据的类型
    }
  },
  mounted () {
    this.getProfessionAndClassesDataCascaderOptions()
  },
  methods: {
    changeViewData () {
      // true就是专业，false就是班级
      if (this.isView) {
        this.isView = false
        this.placeholder = '试试搜索班级名吧'
        this.getProfessionAndClassesLevelDataCascaderOptions()
        this.tooltipContent = '切换到专业数据显示'
        this.type = 'getClassesSalaryData'
      } else {
        this.isView = true
        this.placeholder = '试试搜索专业名吧'
        this.getProfessionAndClassesDataCascaderOptions()
        this.tooltipContent = '切换到班级数据显示'
        this.type = 'getProfessionSalaryData'
      }
    },
    /** 获取专业及届数数据 */
    async getProfessionAndClassesDataCascaderOptions () {
      let formData = JSON.stringify({
        'useraction': 'getProfessionAndClassesDataCascaderOptions',
        'username': window.sessionStorage.getItem('username')
      })
      // 提交表单
      const result = await this.$http.post('/data/', formData)
      // 判断业务逻辑
      if (result.data.ret === 0) {
        this.cascaderOptions = result.data.data
        this.cascaderValues = [this.cascaderOptions[0].value, this.cascaderOptions[0].children[0].value]
        this.getSalaryData()
        return
      }
      this.$message({ message: '读取数据失败！', type: 'error', showClose: true, center: true })
    },

    /** 获取专业及班级及届数的联级菜单数据 */
    async getProfessionAndClassesLevelDataCascaderOptions () {
      let formData = JSON.stringify({
        'useraction': 'getProfessionAndClassesLevelDataCascaderOptions',
        'username': window.sessionStorage.getItem('username')
      })
      // 提交表单
      const result = await this.$http.post('/data/', formData)
      // 判断业务逻辑
      if (result.data.ret === 0) {
        this.cascaderOptions = result.data.data
        this.cascaderValues = [this.cascaderOptions[0].value, this.cascaderOptions[0].children[0].value, this.cascaderOptions[0].children[0].children[0].value]
        this.getSalaryData()
        return
      }
      this.$message({ message: '读取数据失败！', type: 'error', showClose: true, center: true })
    },

    /** 用户选择完后获取 */
    inputChange () {
      if (this.cascaderValues === '' || this.cascaderValues === undefined || this.cascaderValues === null) {
        this.$message({ message: '请写入搜索数据！', type: 'error', showClose: true, center: true })
      } else {
        if (this.type === 'getProfessionSalaryData') {
          this.type = 'getProfessionSalaryData'
          this.getSalaryData()
        }
        if (this.type === 'getClassesSalaryData') {
          this.type = 'getClassesSalaryData'
          this.getSalaryData()
        }
      }
    },
    /** 用户选择班级后获取数据 */
    changeDataView () {
      // false显示专业数据  true显示班级数据
      if (this.isView) {
        this.isView = false
        this.tooltipContent = '切换到专业数据显示'
      } else {
        this.isView = true
        this.tooltipContent = '切换到班级数据显示'
      }
    },
    /** 获取工资数据 */
    async getSalaryData () {
      var myChart = this.$refs.salaryListRef
      myChart.showLoading()
      var formData = ''
      // 名称列表
      var nameList = ''
      // 对应值列表
      var valueList = ''

      formData = JSON.stringify({
        'useraction': 'getSalaryData',
        'username': window.sessionStorage.getItem('username'),
        'queryType': this.type === 'getProfessionSalaryData' ? 'getProfessionSalaryData' : 'getClassesSalaryData',
        'queryInfo': this.cascaderValues
      })
      // 提交表单
      const result = await this.$http.post('/data/', formData)
      // 判断业务逻辑
      if (result.data.ret === 0) {
        nameList = result.data.nameList
        valueList = result.data.valueList
      }

      /**
       * 数据显示
       */
      var colorArray = [
        { top: '#ffa800', bottom: 'rgba(11,42,84,.3)' },
        { top: '#1ace4a', bottom: 'rgba(11,42,84, 0.3)' },
        { top: '#4bf3ff', bottom: 'rgba(11,42,84,.3)' },
        { top: '#4f9aff', bottom: 'rgba(11,42,84,.3)' },
        { top: '#b250ff', bottom: 'rgba(11,42,84,.3)' }
      ]
      var option = {
        title: {
          text: '工资情况条形图',
          x: 'center',
          textStyle: {
            color: 'rgb(255,255,255)',
            fontFamily: '等线',
            fontSize: 18
          },
          subtextStyle: {
            fontSize: 15,
            fontFamily: '等线'
          }
        },
        backgroundColor: '#0E2A43',
        tooltip: {
          show: true,
          formatter (data) {
            return `${nameList[0]}<br/>平均工资：${valueList[0]}<br/>最高工资：${valueList[1]}<br/>最低工资：${valueList[2]}`
          }
        },
        grid: {
          left: '5%',
          top: '12%',
          // right: '1%',
          bottom: '8%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          show: false,
          position: 'top',
          axisTick: {
            show: false
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: '#fff'
            }
          },
          splitLine: {
            show: false
          }
        },
        yAxis: [{
          type: 'category',
          axisTick: {
            show: false,
            alignWithLabel: false,
            length: 5
          },
          'splitLine': { // 网格线
            'show': false
          },
          inverse: 'true', // 排序
          axisLine: {
            show: false,
            lineStyle: {
              color: '#fff'
            }
          },
          data: nameList
        }
        ],
        series: [{
          name: '能耗值',
          type: 'bar',
          label: {
            normal: {
              show: true,
              position: 'right',
              formatter: '{c}',
              textStyle: {
                color: 'white' // color of value
              }
            }
          },
          itemStyle: {
            normal: {
              show: true,
              color: function (params) {
                let num = colorArray.length
                return {
                  type: 'linear',
                  colorStops: [{
                    offset: 0,
                    color: colorArray[params.dataIndex % num].bottom
                  }, {
                    offset: 1,
                    color: colorArray[params.dataIndex % num].top
                  }, {
                    offset: 0,
                    color: colorArray[params.dataIndex % num].bottom
                  }, {
                    offset: 1,
                    color: colorArray[params.dataIndex % num].top
                  }, {
                    offset: 0,
                    color: colorArray[params.dataIndex % num].bottom
                  }, {
                    offset: 1,
                    color: colorArray[params.dataIndex % num].top
                  }, {
                    offset: 0,
                    color: colorArray[params.dataIndex % num].bottom
                  }, {
                    offset: 1,
                    color: colorArray[params.dataIndex % num].top
                  }, {
                    offset: 0,
                    color: colorArray[params.dataIndex % num].bottom
                  }, {
                    offset: 1,
                    color: colorArray[params.dataIndex % num].top
                  }, {
                    offset: 0,
                    color: colorArray[params.dataIndex % num].bottom
                  }, {
                    offset: 1,
                    color: colorArray[params.dataIndex % num].top
                  }]
                  // globalCoord: false
                }
              },
              barBorderRadius: 70,
              borderWidth: 0,
              borderColor: '#333'
            }
          },
          barGap: '0%',
          barCategoryGap: '50%',
          data: valueList
        }]
      }
      // 清除上一次的数据重新绘制(避免造成绘制错误)
      myChart.clear()
      this.polar = option
      myChart.hideLoading()
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.echarts {
  > div {
    border-radius: 25px;
  }
}
</style>
