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
      clearable
      separator=" -> "
    />
    <v-chart
      :options="polar"
      ref="unemployedRateRef"
      autoresize
      style="width: 100%;height: 460px"
    />
  </div>
</template>

<script>
export default {
  name: 'UnemployedRate',
  data () {
    return {
      polar: null,
      isView: true,
      tooltipContent: '切换到班级数据显示',
      placeholder: '试试搜索专业名称吧',
      cascaderOptions: [], // 专业班级联动菜单数据
      cascaderValues: '', // 专业班级联动菜单值
      queryType: 'getProfessionunemployedData' // 查询类型
    }
  },
  mounted () {
    this.getProfessionAndClassesDataCascaderOptions()
  },
  methods: {
    async getUnemployedRateData () {
      // 数据加载完之前先显示一段简单的loading动画
      var myChart = this.$refs.unemployedRateRef
      myChart.showLoading()
      // 创建获取数据的请求表单
      let formData = JSON.stringify({
        'useraction': 'getUnemployedRateData',
        'username': window.sessionStorage.getItem('username'),
        'queryType': this.queryType === 'getProfessionunemployedData' ? 'getProfessionunemployedData' : 'getProfessioAndClassesnunemployedData',
        'queryInfo': this.cascaderValues
      })
      // 提交表单
      const result = await this.$http.post('/data/', formData)
      // 判断业务逻辑
      if (result.data.ret === 0) {
        let data = result.data.data
        let endData = [] // 最终数据列表
        let reasonList = [] // 最终原因列表
        data.forEach(value => {
          if (value.value !== 0) {
            endData.push(value)
            reasonList.push(value.name)
          }
        })
        let peopleCount = result.data.peopleCount
        var option = {
          title: {
            text: peopleCount + '名学生就业与未就业原因占比',
            left: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter (data) {
              var classesData = data.data.classesData
              var html1 = ''
              for (let i = 0; i < classesData.length; i++) {
                html1 += classesData[i].classesName + '：' + classesData[i].num + ' 人<br/>'
              }
              return data.seriesName + '<br/>' + data.name + ': ' + data.value + ' 人 (' + data.percent + '%) <br/>班级数据： <br/>' + html1
            }
          },
          legend: {
            orient: 'vertical',
            left: 10,
            data: reasonList
          },
          series: [
            {
              name: '数据统计',
              type: 'pie',
              selectedMode: 'single',
              radius: [0, '50%'],
              label: {
                formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c} 人 {per|{d}%}  ',
                backgroundColor: '#eee',
                borderColor: '#aaa',
                borderWidth: 1,
                borderRadius: 4,
                rich: {
                  a: {
                    color: '#999',
                    lineHeight: 22,
                    align: 'center'
                  },
                  hr: {
                    borderColor: '#aaa',
                    width: '100%',
                    borderWidth: 0.5,
                    height: 0
                  },
                  b: {
                    fontSize: 16,
                    lineHeight: 33
                  },
                  per: {
                    color: '#eee',
                    backgroundColor: '#334455',
                    padding: [2, 4],
                    borderRadius: 2
                  },
                  e: {
                    fontSize: 16,
                    lineHeight: 33
                  }
                }
              },
              data: endData
            }
          ]
        }
        // 加载数据图表
        this.polar = option
        // 隐藏加载动画
        myChart.hideLoading()
      }
    },
    changeViewData () {
      // true就是专业，false就是班级
      if (this.isView) {
        this.isView = false
        this.placeholder = '试试搜索班级名吧'
        this.getProfessionAndClassesLevelDataCascaderOptions()
        this.tooltipContent = '切换到专业数据显示'
        this.queryType = 'getProfessioAndClassesnunemployedData'
      } else {
        this.isView = true
        this.placeholder = '试试搜索专业名吧'
        this.getProfessionAndClassesDataCascaderOptions()
        this.tooltipContent = '切换到班级数据显示'
        this.queryType = 'getProfessionunemployedData'
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
        this.getUnemployedRateData(this.cascaderValues)
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
        this.getUnemployedRateData(this.cascaderValues)
        return
      }
      this.$message({ message: '读取数据失败！', type: 'error', showClose: true, center: true })
    },

    /** 用户选择完后获取 */
    inputChange () {
      if (this.cascaderValues === '' || this.cascaderValues === undefined || this.cascaderValues === null) {
        this.$message({ message: '请写入搜索数据！', type: 'error', showClose: true, center: true })
      } else {
        if (this.queryType === 'getProfessionunemployedData') {
          this.queryType = 'getProfessionunemployedData'
          this.getUnemployedRateData()
        }
        if (this.queryType === 'getProfessioAndClassesnunemployedData') {
          this.queryType = 'getProfessioAndClassesnunemployedData'
          this.getUnemployedRateData()
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
