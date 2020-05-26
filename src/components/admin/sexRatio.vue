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
        @click="changeViewData"
      />
    </el-tooltip>
    <el-cascader
      style="margin-left: 15px;width: 300px"
      ref="classesCascaderLabel"
      :placeholder="placeholder"
      v-model="cascaderValues"
      :options="cascaderOptions"
      :props="{ expandTrigger: 'hover' }"
      @change="inputChange"
      filterable
      clearable
      separator=" -> "
    />
    <v-chart
      :options="polar"
      autoresize
      ref="sexRatioRef"
      style="height: 100%;width: 100%"
    />
  </div>
</template>

<script>
export default {
  name: 'SexRatio',
  data () {
    return {
      polar: null,
      isView: true,
      placeholder: '试试搜索专业名称吧',
      tooltipContent: '切换到班级数据显示',
      cascaderOptions: [], // 专业班级联动菜单数据
      cascaderValues: '云计算技术与运用', // 专业班级联动菜单值
      type: 'getProfessionPeopleData' // 获取数据的类型
    }
  },
  mounted () {
    this.getProfessionDataCascaderOptions()
    this.getPeopleData()
  },
  methods: {
    changeViewData () {
      // true就是专业，false就是班级
      if (this.isView) {
        this.isView = false
        this.placeholder = '试试搜索班级名吧'
        this.getProfessionAndClassesDataCascaderOptions()
        this.tooltipContent = '切换到专业数据显示'
        this.type = 'getClassesPeopleData'
      } else {
        this.isView = true
        this.placeholder = '试试搜索专业名吧'
        this.getProfessionDataCascaderOptions()
        this.tooltipContent = '切换到班级数据显示'
        this.type = 'getProfessionPeopleData'
      }
    },
    /** 获取专业数据 */
    async getProfessionDataCascaderOptions () {
      let formData = JSON.stringify({
        'useraction': 'getProfessionDataCascaderOptions',
        'username': window.sessionStorage.getItem('username')
      })
      // 提交表单
      const result = await this.$http.post('/data/', formData)
      // 判断业务逻辑
      if (result.data.ret === 0) {
        this.cascaderOptions = result.data.data
        this.cascaderValues = this.cascaderOptions[0].value
        this.getPeopleData('getProfessionPeopleData', this.cascaderOptions[0].label, this.cascaderOptions[0].value)
        return
      }
      this.$message({ message: '读取数据失败！', type: 'error', showClose: true, center: true })
    },

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
        this.getPeopleData('getClassesPeopleData', this.cascaderOptions[0].children[0].label, this.cascaderOptions[0].children[0].value)
        return
      }
      this.$message({ message: '读取数据失败！', type: 'error', showClose: true, center: true })
    },

    /** 用户选择完后获取 */
    inputChange () {
      if (this.cascaderValues === '' || this.cascaderValues === undefined || this.cascaderValues === null) {
        this.$message({ message: '请写入搜索数据！', type: 'error', showClose: true, center: true })
      } else {
        if (this.type === 'getProfessionPeopleData') {
          var professionName = this.$refs['classesCascaderLabel'].getCheckedNodes()[0].label
          var professionCode = this.cascaderValues[0]
          this.getPeopleData(this.type, professionName, professionCode)
        }
        if (this.type === 'getClassesPeopleData') {
          var classesName = this.$refs['classesCascaderLabel'].getCheckedNodes()[0].label
          var classesCode = this.cascaderValues[1]
          this.getPeopleData(this.type, classesName, classesCode)
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
    /** 获取男女人数 */
    async getPeopleData (type, name = '', code) {
      var myChart = this.$refs.sexRatioRef
      myChart.showLoading()
      var formData = ''
      var bodyMax = 0 // 指定图形界限的值(总人数)
      var boyNum = 0 // 男孩数量
      var girlNum = 0 // 女孩数量
      if (type === 'getProfessionPeopleData') {
        formData = JSON.stringify({
          'useraction': 'getPeopleData',
          'type': type,
          'username': window.sessionStorage.getItem('username'),
          'professionCode': code
        })
        // 提交表单
        const result = await this.$http.post('/data/', formData)
        // 判断业务逻辑
        if (result.data.ret === 0) {
          bodyMax = result.data.bodyMax
          boyNum = result.data.boyNum
          girlNum = result.data.girlNum
        }
      }
      if (type === 'getClassesPeopleData') {
        formData = JSON.stringify({
          'useraction': 'getPeopleData',
          'type': type,
          'username': window.sessionStorage.getItem('username'),
          'classesCode': code
        })
        // 提交表单
        const result = await this.$http.post('/data/', formData)
        // 判断业务逻辑
        if (result.data.ret === 0) {
          bodyMax = result.data.bodyMax
          boyNum = result.data.boyNum
          girlNum = result.data.girlNum
        }
      }
      /**
         * echarts数据显示
         */
      var symbols = [
        'path://M18.2629891,11.7131596 L6.8091608,11.7131596 C1.6685112,11.7131596 0,13.032145 0,18.6237673 L0,34.9928467 C0,38.1719847 4.28388932,38.1719847 4.28388932,34.9928467 L4.65591984,20.0216948 L5.74941883,20.0216948 L5.74941883,61.000787 C5.74941883,65.2508314 11.5891201,65.1268798 11.5891201,61.000787 L11.9611506,37.2137775 L13.1110872,37.2137775 L13.4831177,61.000787 C13.4831177,65.1268798 19.3114787,65.2508314 19.3114787,61.000787 L19.3114787,20.0216948 L20.4162301,20.0216948 L20.7882606,34.9928467 C20.7882606,38.1719847 25.0721499,38.1719847 25.0721499,34.9928467 L25.0721499,18.6237673 C25.0721499,13.032145 23.4038145,11.7131596 18.2629891,11.7131596 M12.5361629,1.11022302e-13 C15.4784742,1.11022302e-13 17.8684539,2.38997966 17.8684539,5.33237894 C17.8684539,8.27469031 15.4784742,10.66467 12.5361629,10.66467 C9.59376358,10.66467 7.20378392,8.27469031 7.20378392,5.33237894 C7.20378392,2.38997966 9.59376358,1.11022302e-13 12.5361629,1.11022302e-13',
        'path://M28.9624207,31.5315864 L24.4142575,16.4793596 C23.5227152,13.8063773 20.8817445,11.7111088 17.0107398,11.7111088 L12.112691,11.7111088 C8.24168636,11.7111088 5.60080331,13.8064652 4.70917331,16.4793596 L0.149791395,31.5315864 C-0.786976655,34.7595013 2.9373074,35.9147532 3.9192135,32.890727 L8.72689855,19.1296485 L9.2799493,19.1296485 C9.2799493,19.1296485 2.95992025,43.7750224 2.70031069,44.6924335 C2.56498417,45.1567684 2.74553639,45.4852068 3.24205501,45.4852068 L8.704461,45.4852068 L8.704461,61.6700801 C8.704461,64.9659872 13.625035,64.9659872 13.625035,61.6700801 L13.625035,45.360657 L15.5097899,45.360657 L15.4984835,61.6700801 C15.4984835,64.9659872 20.4191451,64.9659872 20.4191451,61.6700801 L20.4191451,45.4852068 L25.8814635,45.4852068 C26.3667633,45.4852068 26.5586219,45.1567684 26.4345142,44.6924335 C26.1636859,43.7750224 19.8436568,19.1296485 19.8436568,19.1296485 L20.3966199,19.1296485 L25.2043926,32.890727 C26.1862111,35.9147532 29.9105828,34.7595013 28.9625083,31.5315864 L28.9624207,31.5315864 Z M14.5617154,0 C17.4960397,0 19.8773132,2.3898427 19.8773132,5.33453001 C19.8773132,8.27930527 17.4960397,10.66906 14.5617154,10.66906 C11.6274788,10.66906 9.24611767,8.27930527 9.24611767,5.33453001 C9.24611767,2.3898427 11.6274788,0 14.5617154,0 L14.5617154,0 Z',
        'path://M512 292.205897c80.855572 0 146.358821-65.503248 146.358821-146.358821C658.358821 65.503248 592.855572 0 512 0 431.144428 0 365.641179 65.503248 365.641179 146.358821 365.641179 227.214393 431.144428 292.205897 512 292.205897zM512 731.282359c-80.855572 0-146.358821 65.503248-146.358821 146.358821 0 80.855572 65.503248 146.358821 146.358821 146.358821 80.855572 0 146.358821-65.503248 146.358821-146.358821C658.358821 796.273863 592.855572 731.282359 512 731.282359z'
      ]
      var labelSetting = {
        normal: {
          show: true,
          position: 'bottom',
          offset: [0, 10],
          formatter: function (param) {
            return (param.value / bodyMax * 100).toFixed(0) + '%'
          },
          textStyle: {
            fontSize: 18,
            fontFamily: 'Arial',
            color: '#686868'
          }
        }
      }
      var markLineSetting = { // 设置标线
        symbol: 'none',
        lineStyle: {
          normal: {
            opacity: 0.3
          }
        },
        data: [{
          type: 'max',
          label: {
            normal: {
              formatter: 'max: {c}'
            }
          }
        }, {
          type: 'min',
          label: {
            normal: {
              formatter: 'min: {c}'
            }
          }
        }]
      }
      var option = {
        title: {
          text: `${name} 共${bodyMax}名学生 男女比例图`,
          x: 'center',
          textStyle: {
            color: '#409EFF',
            fontFamily: '等线',
            fontSize: 18
          },
          subtextStyle: {
            fontSize: 15,
            fontFamily: '等线'
          }
        },
        tooltip: {
          show: true // 鼠标放上去显示悬浮数据
        },
        grid: {
          left: '30%',
          right: '30%',
          top: '10%',
          bottom: '20%',
          containLabel: true
        },
        xAxis: {
          data: ['男生', '女生'],
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            show: false
          }
        },
        yAxis: {
          max: bodyMax,
          splitLine: {
            show: true
          },
          axisTick: {
            // 刻度线
            show: false
          },
          axisLine: {
            // 轴线
            show: false
          },
          axisLabel: {
            // 轴坐标文字
            show: true
          }
        },
        series: [{
          name: '人数',
          type: 'pictorialBar',
          symbolClip: true,
          symbolBoundingData: bodyMax,
          label: labelSetting,
          data: [{
            value: boyNum,
            symbol: symbols[0],
            itemStyle: {
              normal: {
                color: 'rgba(105,204,230)' // 单独控制颜色
              }
            }
          },
          {
            value: girlNum,
            symbol: symbols[1],
            itemStyle: {
              normal: {
                color: 'rgba(255,130,130)' // 单独控制颜色
              }
            }
          }
          ],
          markLine: markLineSetting,
          z: 10
        },
        {
          // 设置背景底色，不同的情况用这个
          type: 'pictorialBar', // 异型柱状图 图片、SVG PathData
          symbolBoundingData: bodyMax,
          animationDuration: 0,
          itemStyle: {
            normal: {
              color: '#ccc' // 设置全部颜色，统一设置
            }
          },
          z: 10,
          data: [{
            itemStyle: {
              normal: {
                color: 'rgba(105,204,230,0.40)' // 单独控制颜色
              }
            },
            value: boyNum,
            symbol: symbols[0]
          },
          {
            itemStyle: {
              normal: {
                color: 'rgba(255,130,130,0.40)' // 单独控制颜色
              }
            },
            value: girlNum,
            symbol: symbols[1]
          }
          ]
        }
        ]
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
