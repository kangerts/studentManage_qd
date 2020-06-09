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
      ref="workAreaMapRef"
      autoresize
      style="height: 460px;width: 100%"
    />
  </div>
</template>

<script>
import chinaMap from '../../assets/js/china'
export default {
  name: 'WorkArea',
  data () {
    return {
      initCharts: { renderer: 'svg' },
      polar: null,
      isView: true,
      tooltipContent: '切换到班级数据显示',
      placeholder: '试试搜索专业名称吧',
      cascaderOptions: [], // 专业班级联动菜单数据
      cascaderValues: '', // 专业班级联动菜单值
      type: 'getProfessionData' // 获取数据的类型
    }
  },
  mounted () {
    this.getProfessionAndClassesDataCascaderOptions()
  },
  methods: {
    /** 获取学生工作区域数据 */
    async getWorkAreaData () {
      var charts = this.$refs.workAreaMapRef
      charts.showLoading()
      /** 加载echarts组件等 */
      var mapName = 'china'
      var geoCoordMap = {}
      /* 获取地图数据 */
      const formData = JSON.stringify({
        useraction: 'getWorkAreaData',
        username: window.sessionStorage.getItem('username'),
        queryType: this.type === 'getProfessionData' ? 'getProfessionData' : 'getClassesData',
        queryInfo: this.cascaderValues
      })
      // 提交表单
      const result = await this.$http.post('/data/', formData)
      // 判断业务逻辑
      if (result.data.ret === 0) {
        var data = result.data.data
        var toolTipData = result.data.toolTipData
        /** 加载echarts绘制 */
        // var mapFeatures = this.$echarts.getMap(mapName).geoJson.features
        var mapFeatures = chinaMap.features
        mapFeatures.forEach(function (v) {
          // 地区名称
          var name = v.properties.name
          // 地区经纬度
          geoCoordMap[name] = v.properties.cp
        })
        var max = 300
        var min = 9
        var maxSize4Pin = 100
        var minSize4Pin = 20

        var convertData = function (data) {
          var res = []
          for (var i = 0; i < data.length; i++) {
            var geoCoord = geoCoordMap[data[i].name]
            if (geoCoord) {
              res.push({
                name: data[i].name,
                value: geoCoord.concat(data[i].value)
              })
            }
          }
          return res
        }
        // echarts重要配置项
        var option = {
          title: {
            text: '学生就业地区分布图',
            x: 'center',
            textStyle: {
              color: 'rgb(55, 75, 113)',
              fontFamily: '等线',
              fontSize: 18
            },
            subtextStyle: {
              fontSize: 15,
              fontFamily: '等线'
            }
          },
          tooltip: {
            trigger: 'item',
            formatter: function (params) {
              if (typeof params.value[2] === 'undefined') {
                var toolTiphtml = ''
                for (var i = 0; i < toolTipData.length; i++) {
                  if (params.name === toolTipData[i].name) {
                    toolTiphtml += toolTipData[i].name + ':<br>'
                    for (var j = 0; j < toolTipData[i].value.length; j++) {
                      toolTiphtml +=
                        toolTipData[i].value[j].name +
                        ':' +
                        toolTipData[i].value[j].value +
                        '<br>'
                    }
                  }
                }
                // console.log(toolTiphtml)
                // console.log(convertData(data))
                return toolTiphtml
              } else {
                let toolTiphtml = ''
                for (let i = 0; i < toolTipData.length; i++) {
                  if (params.name === toolTipData[i].name) {
                    toolTiphtml += toolTipData[i].name + ':<br>'
                    for (let j = 0; j < toolTipData[i].value.length; j++) {
                      toolTiphtml +=
                        toolTipData[i].value[j].name +
                        ':' +
                        toolTipData[i].value[j].value +
                        '<br>'
                    }
                  }
                }
                // console.log(toolTiphtml)
                // console.log(convertData(data))
                return toolTiphtml
              }
            }
          },
          // legend: {
          //   orient: 'vertical',
          //   y: 'bottom',
          //   x: 'right',
          //   data: ['credit_pm2.5'],
          //   textStyle: {
          //     color: '#fff'
          //   }
          // },
          visualMap: {
            show: true,
            min: 0,
            max: 100,
            left: 100,
            bottom: 200,
            text: ['多', '少'], // 文本，默认为数值文本
            calculable: true,
            seriesIndex: [1],
            inRange: {
              // color: ['#3B5077', '#031525'] // 蓝黑
              // color: ['#ffc0cb', '#800080'] // 红紫
              // color: ['#3C3B3F', '#605C3C'] // 黑绿
              // color: ['#0f0c29', '#302b63', '#24243e'] // 黑紫黑
              // color: ['#23074d', '#cc5333'] // 紫红
              color: ['#00467F', '#A5CC82'] // 蓝绿
              // color: ['#1488CC', '#2B32B2'] // 浅蓝
              // color: ['#00467F', '#A5CC82'] // 蓝绿
              // color: ['#00467F', '#A5CC82'] // 蓝绿
              // color: ['#00467F', '#A5CC82'] // 蓝绿
              // color: ['#00467F', '#A5CC82'] // 蓝绿
            }
          },
          /* 工具按钮组 */
          // toolbox: {
          //     show: true,
          //     orient: 'vertical',
          //     left: 'right',
          //     top: 'center',
          //     feature: {
          //         dataView: {
          //             readOnly: false
          //         },
          //         restore: {},
          //         saveAsImage: {}
          //     }
          // },
          geo: {
            show: true,
            map: mapName,
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false
              }
            },
            roam: true,
            itemStyle: {
              normal: {
                areaColor: '#031525',
                borderColor: '#3B5077'
              },
              emphasis: {
                areaColor: '#2B91B7'
              }
            }
          },
          series: [
            {
              name: '散点',
              type: 'scatter',
              coordinateSystem: 'geo',
              data: convertData(data),
              symbolSize: function (val) {
                return val[2] / 10
              },
              label: {
                normal: {
                  formatter: '{b}',
                  position: 'right',
                  show: true
                },
                emphasis: {
                  show: true
                }
              },
              itemStyle: {
                normal: {
                  color: '#05C3F9'
                }
              }
            },
            {
              type: 'map',
              map: mapName,
              geoIndex: 0,
              aspectScale: 0.75, // 长宽比
              showLegendSymbol: false, // 存在legend时显示
              label: {
                normal: {
                  show: true
                },
                emphasis: {
                  show: false,
                  textStyle: {
                    color: '#fff'
                  }
                }
              },
              roam: true,
              itemStyle: {
                normal: {
                  areaColor: '#031525',
                  borderColor: '#3B5077'
                },
                emphasis: {
                  areaColor: '#2B91B7'
                }
              },
              animation: false,
              data: data
            },
            {
              name: '点',
              type: 'scatter',
              coordinateSystem: 'geo',
              symbol: 'pin', // 气泡
              symbolSize: function (val) {
                var a = (maxSize4Pin - minSize4Pin) / (max - min)
                var b = minSize4Pin - a * min
                b = maxSize4Pin - a * max
                return a * val[2] + b
              },
              label: {
                normal: {
                  show: true,
                  textStyle: {
                    color: '#fff',
                    fontSize: 9
                  }
                }
              },
              itemStyle: {
                normal: {
                  color: '#F62157' // 标志颜色
                }
              },
              zlevel: 6,
              data: convertData(data)
            },
            {
              name: 'Top 5',
              type: 'effectScatter',
              coordinateSystem: 'geo',
              data: convertData(
                data
                  .sort(function (a, b) {
                    return b.value - a.value
                  })
                  .slice(0, 5)
              ),
              symbolSize: function (val) {
                return val[2] / 10
              },
              showEffectOn: 'render',
              rippleEffect: {
                brushType: 'stroke'
              },
              hoverAnimation: true,
              label: {
                normal: {
                  formatter: '{b}',
                  position: 'right',
                  show: true
                }
              },
              itemStyle: {
                normal: {
                  color: 'yellow',
                  shadowBlur: 10,
                  shadowColor: 'yellow'
                }
              },
              zlevel: 1
            }
          ]
        }
        // 加载数据图表
        this.polar = option
        // // 隐藏加载动画
        charts.hideLoading()
      } else {
        this.$message({ message: '读取数据失败！', type: 'error', showClose: true, center: true })
      }
    },

    changeViewData () {
      // true就是专业，false就是班级
      if (this.isView) {
        this.isView = false
        this.placeholder = '试试搜索班级名吧'
        this.getProfessionAndClassesLevelDataCascaderOptions()
        this.tooltipContent = '切换到专业数据显示'
        this.type = 'getClassesData'
      } else {
        this.isView = true
        this.placeholder = '试试搜索专业名吧'
        this.getProfessionAndClassesDataCascaderOptions()
        this.tooltipContent = '切换到班级数据显示'
        this.type = 'getProfessionData'
      }
    },
    /** 获取专业及届数数据 */
    async getProfessionAndClassesDataCascaderOptions () {
      const formData = JSON.stringify({
        useraction: 'getProfessionAndClassesDataCascaderOptions',
        username: window.sessionStorage.getItem('username')
      })
      // 提交表单
      const result = await this.$http.post('/data/', formData)
      // 判断业务逻辑
      if (result.data.ret === 0) {
        this.cascaderOptions = result.data.data
        this.cascaderValues = [this.cascaderOptions[0].value, this.cascaderOptions[0].children[0].value]
        this.getWorkAreaData()
        return
      }
      this.$message({ message: '读取数据失败！', type: 'error', showClose: true, center: true })
    },

    /** 获取专业及班级及届数的联级菜单数据 */
    async getProfessionAndClassesLevelDataCascaderOptions () {
      const formData = JSON.stringify({
        useraction: 'getProfessionAndClassesLevelDataCascaderOptions',
        username: window.sessionStorage.getItem('username')
      })
      // 提交表单
      const result = await this.$http.post('/data/', formData)
      // 判断业务逻辑
      if (result.data.ret === 0) {
        this.cascaderOptions = result.data.data
        this.cascaderValues = [this.cascaderOptions[0].value, this.cascaderOptions[0].children[0].value, this.cascaderOptions[0].children[0].children[0].value]
        this.getWorkAreaData()
        return
      }
      this.$message({ message: '读取数据失败！', type: 'error', showClose: true, center: true })
    },
    /** 用户选择完后获取 */
    inputChange () {
      if (this.cascaderValues === '' || this.cascaderValues === undefined || this.cascaderValues === null) {
        this.$message({ message: '请写入搜索数据！', type: 'error', showClose: true, center: true })
      } else {
        if (this.type === 'getProfessionData') {
          this.type = 'getProfessionData'
          this.getWorkAreaData()
        }
        if (this.type === 'getClassesData') {
          this.type = 'getClassesData'
          this.getWorkAreaData()
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
    }
  }
}
</script>

<style lang="less" scoped>
</style>
