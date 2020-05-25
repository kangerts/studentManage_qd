<template>
  <v-chart
    :options="polar"
    ref="unemployedRateRef"
    autoresize
    style="width: 100%;height: 460px"
  />
</template>

<script>
export default {
  name: 'UnemployedRate',
  data () {
    return {
      polar: null
    }
  },
  mounted () {
    this.getUnemployedRateData()
  },
  methods: {
    async getUnemployedRateData () {
      // 数据加载完之前先显示一段简单的loading动画
      var myChart = this.$refs.unemployedRateRef
      // console.log(myChart)
      myChart.showLoading()
      // 创建获取数据的请求表单
      let formData = JSON.stringify({
        'useraction': 'getUnemployedRateData',
        'username': window.sessionStorage.getItem('username')
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
    }
  }
}
</script>

<style lang="less" scoped>
</style>
