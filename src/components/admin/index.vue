<template>
  <el-row
    :gutter="10"
    style="text-align: center"
    class="dashboard"
  >
    <!--    第一行数据显示-->
    <div
      style="cursor:pointer;color: white;border-radius: 15px;height: 100px;width: 200px;margin: 25px;display: inline-block;background-color: #03B8CF"
      class="box-card"
      @click="$router.push('/admin/postManage')"
    >
      <div style="height: 40px;line-height: 40px">
        {{ this.indexData.indexList[0] }}
      </div>
      <div style="height: 60px;line-height: 60px;font-weight: bold;font-size: 35px">
        {{ this.indexData.postCount }}
      </div>
    </div>
    <div
      style="cursor:pointer;color: white;border-radius: 15px;height: 100px;width: 200px;margin: 25px;display: inline-block;background-color: #039BE5"
      class="box-card"
      @click="$router.push('/admin/unemployedRate')"
    >
      <div style="height: 40px;line-height: 40px">
        {{ this.indexData.indexList[1] }}
      </div>
      <div style="height: 60px;line-height: 60px;font-weight: bold;font-size: 35px">
        {{ this.indexData.unemployedCount }}
      </div>
    </div>
    <div
      style="color: white;border-radius: 15px;height: 100px;width: 200px;margin: 25px;display: inline-block;background-color: #F1A325"
      class="box-card"
    >
      <div style="height: 40px;line-height: 40px">
        {{ this.indexData.indexList[2] }}
      </div>
      <div style="height: 60px;line-height: 60px;font-weight: bold;font-size: 35px">
        {{ this.indexData.employmentCount }}
      </div>
    </div>
    <div
      style="cursor:pointer;color: white;border-radius: 15px;height: 100px;width: 200px;margin: 25px;display: inline-block;background-color: #294D99"
      class="box-card"
      @click="$router.push('/admin/studentData')"
    >
      <div style="height: 40px;line-height: 40px">
        {{ this.indexData.indexList[3] }}
      </div>
      <div style="height: 60px;line-height: 60px;font-weight: bold;font-size: 35px">
        {{ this.indexData.studentSumCount }}
      </div>
    </div>
    <!--    第二行数据显示-->
    <div
      style="cursor:pointer;color: white;border-radius: 15px;height: 100px;width: 200px;margin: 25px;display: inline-block;background-color: #6144D4"
      class="box-card"
      @click="$router.push('/admin/professionManage')"
    >
      <div style="height: 40px;line-height: 40px">
        {{ this.indexData.indexList[4] }}
      </div>
      <div style="height: 60px;line-height: 60px;font-weight: bold;font-size: 35px">
        {{ this.indexData.professionSumCount }}
      </div>
    </div>
    <div
      style="cursor:pointer;color: white;border-radius: 15px;height: 100px;width: 200px;margin: 25px;display: inline-block;background-color: #3C3C3C"
      class="box-card"
      @click="$router.push('/admin/classesManage')"
    >
      <div style="height: 40px;line-height: 40px">
        {{ this.indexData.indexList[5] }}
      </div>
      <div style="height: 60px;line-height: 60px;font-weight: bold;font-size: 35px">
        {{ this.indexData.classesSumCount }}
      </div>
    </div>
    <div
      style="color: white;border-radius: 15px;height: 100px;width: 200px;margin: 25px;display: inline-block;background-color: #00C397"
      class="box-card"
    >
      <div style="height: 40px;line-height: 40px">
        {{ this.indexData.indexList[6] }}
      </div>
      <div style="height: 60px;line-height: 60px;font-weight: bold;font-size: 35px">
        {{ this.indexData.boySumCount }}
      </div>
    </div>
    <div
      style="color: white;border-radius: 15px;height: 100px;width: 200px;margin: 25px;display: inline-block;background-color: #EA644A"
      class="box-card"
    >
      <div style="height: 40px;line-height: 40px">
        {{ this.indexData.indexList[7] }}
      </div>
      <div style="height: 60px;line-height: 60px;font-weight: bold;font-size: 35px">
        {{ this.indexData.girlSumCount }}
      </div>
    </div>
  </el-row>
</template>
<script>
export default {
  data () {
    return {
      // 首页数据
      indexData: {
        postCount: 0,
        unemployedCount: 0,
        employmentCount: 0,
        studentSumCount: 0,
        professionSumCount: 0,
        classesSumCount: 0,
        boySumCount: 0,
        girlSumCount: 0,
        indexList: ['企业岗位数', '未就业人数', '已就业人数', '学生总人数', '专业总个数', '班级总个数', '男生总人数', '女生总人数']
      }
    }
  },
  mounted () {
    this.getIndexData()
  },
  methods: {
    async getIndexData () {
      let formData = JSON.stringify({
        'useraction': 'getIndexData',
        'username': window.sessionStorage.getItem('username')
      })
      // 提交表单
      const result = await this.$http.post('/data/', formData)
      // 判断业务逻辑
      if (result.data.ret === 0) {
        for (let key in result.data) {
          this.indexData[key] = result.data[key]
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
</style>
