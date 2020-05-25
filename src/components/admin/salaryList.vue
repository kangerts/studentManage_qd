<template>
  <div style="width: 100%;height: 460px">
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
        @click="changeDataView"
      />
    </el-tooltip>
    <el-cascader
      style="margin-left: 15px;width: 300px"
      v-show="isView===false"
      ref="classesCascaderLabel"
      placeholder="试试搜索专业或班级名"
      @input="inputClasses"
      v-model="cascaderValues"
      :options="cascaderOptions"
      :props="{ expandTrigger: 'hover' }"
      filterable
      clearable
      separator=" -> "
    />
    <v-chart
      :options="polar"
      :init-options="initCharts"
      autoresize
      ref="salaryListRef"
      style="height: 100%;width: 100%;border-radius: 25px"
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
      cascaderOptions: [],
      cascaderValues: ''
    }
  },
  mounted () {
    this.getSalaryData('getProfessionSalaryData', '专业')
    this.getProfessionAndClassesDataCascaderOptions()
  },
  methods: {
    /** 获取专业及班级的联级菜单数据 */
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
        return
      }
      this.$message({ message: '读取数据失败！', type: 'error', showClose: true, center: true })
    },
    /** 用户选择完后获取 */
    inputClasses () {
      var classesName = this.$refs['classesCascaderLabel'].getCheckedNodes()[0].label
      this.getSalaryData('getClassesSalaryData', classesName)
    },
    /** 用户选择班级后获取数据 */
    changeDataView () {
      // false显示专业数据  true显示班级数据
      if (this.isView) {
        this.isView = false
        this.tooltipContent = '切换到专业数据显示'
        this.inputClasses()
      } else {
        this.isView = true
        this.tooltipContent = '切换到班级数据显示'
        this.getSalaryData('getProfessionSalaryData', '专业')
      }
    },
    /** 获取工资数据 */
    async getSalaryData (type, name) {
      var myChart = this.$refs.salaryListRef
      myChart.showLoading()
      var formData = ''
      var nameList = ''
      var valueList = ''
      if (type === 'getProfessionSalaryData') {
        formData = JSON.stringify({
          'useraction': 'getSalaryData',
          'type': type,
          'username': window.sessionStorage.getItem('username')
        })
        // 提交表单
        const result = await this.$http.post('/data/', formData)
        // 判断业务逻辑
        if (result.data.ret === 0) {
          nameList = result.data.nameList
          valueList = result.data.valueList
        }
      }
      if (type === 'getClassesSalaryData') {
        nameList = [name]
        formData = JSON.stringify({
          'useraction': 'getSalaryData',
          'type': type,
          'username': window.sessionStorage.getItem('username'),
          'classesCode': this.cascaderValues[1]
        })
        // 提交表单
        const result = await this.$http.post('/data/', formData)
        // 判断业务逻辑
        if (result.data.ret === 0) {
          nameList = [name]
          valueList = result.data.data
        }
      }
      /**
       * 专业数据显示
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
          text: name + '  平均工资',
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
          formatter: '{b}:{c}'
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

<style scoped>

</style>
