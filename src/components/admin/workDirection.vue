<template>
  <div>
    <v-chart
      :options="polar"
      :init-options="initCharts"
      autoresize
      ref="workDirectionRef"
      style="height: 460px;width: 100%"
    />
    <!--    分页器区域-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pageNum"
      :page-sizes="[5, 8]"
      :page-size="queryInfo.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      background
    />
  </div>
</template>

<script>
export default {
  name: 'WorkDirection',
  data () {
    return {
      polar: null,
      initCharts: { renderer: 'svg' },
      /** 数据表格 */
      // 数据表格数据绑定
      queryInfo: {
        // 当前页数
        pageNum: 1,
        // 当前每页显示多少条数据
        pageSize: 5
      },
      // 总共多少条数据
      total: 0
    }
  },
  mounted () {
    this.getWOrkDirection()
  },
  methods: {
    /** 监听每页显示多少数据的改变 */
    handleSizeChange (newSize) {
      this.queryInfo.pageSize = newSize
      this.getWOrkDirection()
    },
    /** 监听页码的改变 */
    handleCurrentChange (newPage) {
      this.queryInfo.pageNum = newPage
      this.getWOrkDirection()
    },
    async getWOrkDirection () {
      // 获取图表对象并设置动画
      var charts = this.$refs.workDirectionRef
      charts.showLoading()
      const formData = JSON.stringify({
        useraction: 'getWorkDirection',
        username: window.sessionStorage.getItem('username'),
        query: this.queryInfo
      })
      // 提交表单
      const result = await this.$http.post('/data/', formData)
      // 判断业务逻辑
      var year = [] // 年份
      var post = [] // 岗位
      var postBoyCountAndClassesLevel = {} // 男生的数据
      var postGirlCountAndClassesLevel = {} // 女生数据
      if (result.data.ret === 0) {
        let data = result.data.pagination
        this.total = data.total
        year = result.data.yearData
        post = result.data.studentPost
        postBoyCountAndClassesLevel = result.data.postBoyCountAndClassesLevel
        postGirlCountAndClassesLevel = result.data.postGirlCountAndClassesLevel
      }

      /** 核心参数 */
      var yearData = year // 年份数据
      var boyData = postBoyCountAndClassesLevel

      var girlData = postGirlCountAndClassesLevel
      // 学生岗位
      var studentPost = post
      /** 核心参数 */

      const dataMap = {}

      function dataFormatter (obj) {
        let temp
        for (let year = yearData[0]; year <= yearData[yearData.length]; year++) {
          let max = 0
          let sum = 0
          temp = obj[year]
          for (var i = 0, l = temp.length; i < l; i++) {
            max = Math.max(max, temp[i])
            sum += temp[i]
            obj[year][i] = {
              value: temp[i]
            }
          }
          obj[year + 'max'] = Math.floor(max / 100) * 100
          obj[year + 'sum'] = sum
        }
        return obj
      }

      dataMap.dataBoy = dataFormatter(boyData)

      dataMap.dataGirl = dataFormatter(girlData)

      // 组装标题数据
      var titleDataMap = []
      yearData.forEach(value => {
        titleDataMap.push({
          title: { text: value + ' 级工作岗位男女人数' },
          series: [
            { data: dataMap.dataGirl[value] },
            { data: dataMap.dataBoy[value] }
          ]
        })
      })

      var options = {
        baseOption: {
          timeline: {
            axisType: 'category',
            // realtime: false,
            // loop: false,
            autoPlay: true,
            // currentIndex: 2,
            playInterval: 1000,
            data: [
              ...yearData
              // {
              //   value: '2008',
              //   tooltip: {
              //     formatter: '{b} 就业人数达到一个高度'
              //   },
              //   symbol: 'diamond',
              //   symbolSize: 16
              // },
              // {
              //   value: '2011',
              //   tooltip: {
              //     formatter: function (params) {
              //       return params.name + '就业人数达到又一个高度'
              //     }
              //   },
              //   symbol: 'diamond',
              //   symbolSize: 18
              // }
            ],
            label: {
              formatter: function (s) {
                return (new Date(s)).getFullYear()
              }
            }
          },
          title: {
            subtext: '数据来自后台统计'
          },
          tooltip: {},
          color: ['#FFCDCD', '#69CCE6'],
          legend: {
            left: 'right',
            data: ['女生', '男生'],
            selected: {
              女生: true, 男生: true
            }
          },
          calculable: true,
          grid: {
            top: 80,
            bottom: 100,
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow',
                label: {
                  show: true,
                  formatter: function (params) {
                    return params.value.replace('\n', '')
                  }
                }
              }
            }
          },
          xAxis: [
            {
              type: 'category',
              axisLabel: { interval: 0 },
              data: studentPost,
              splitLine: { show: false }
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '人数'
            }
          ],
          series: [
            { name: '女生', type: 'bar' },
            { name: '男生', type: 'bar' }
          ]
        },
        options: [...titleDataMap] // 数组展开运算符展开标题数据映射
      }
      this.polar = options
      // 隐藏加载动画
      charts.hideLoading()
    }
  }
}
</script>

<style lang="less" scoped>

</style>
