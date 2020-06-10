<template>
  <el-row
    :gutter="100"
    style="height: 500px;overflow: auto;"
  >
    <el-col :span="10">
      <el-timeline>
        <el-timeline-item
          v-for="(item, index) in timeline"
          :key="index"
          :icon="item.icon"
          :type="item.type"
          :color="item.color"
          :size="item.size"
          :timestamp="item.timestamp"
        >
          {{ item.content }}
        </el-timeline-item>
      </el-timeline>
    </el-col>
    <el-col
      :span="10"
      class="right-col"
    >
      <el-row style="height: 50px;color: #409EFF;position: fixed">
        <i class="el-icon-s-promotion" />当前版本：V1.5.0
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'UpdateLogs',
  data () {
    return {
      // 时间线列表数据
      timeline: [
        {
          content: '新增 学生信息编辑锁(防止多人操作冲突)',
          timestamp: '2020-06-09 12:31',
          size: 'large',
          type: 'success',
          icon: 'el-icon-more',
          color: '#409EFF'
        },
        {
          content: '新增 数据统计部分子功能支持查看某届学生数据',
          timestamp: '2020-06-05 13:34',
          size: 'normal',
          type: 'success',
          icon: 'el-icon-more',
          color: '#0bbd87'
        },
        {
          content: '新增 教师名称修改',
          timestamp: '2020-06-04 21:34',
          size: 'normal',
          type: 'success',
          icon: 'el-icon-more',
          color: '#0bbd87'
        },
        {
          content: '新增 学生岗位追踪',
          timestamp: '2020-06-04 20:01',
          size: 'normal',
          type: 'success',
          icon: 'el-icon-more',
          color: '#0bbd87'
        },
        {
          content: '新增 工资榜显示专业或班级最高最低工资及平均工资',
          timestamp: '2020-05-30 13:21',
          size: 'normal',
          type: 'success',
          icon: 'el-icon-more',
          color: '#0bbd87'
        },
        {
          content: '新增 企业、岗位管理 优化 学生信息显示',
          timestamp: '2020-05-29 11:45',
          size: 'normal',
          type: 'success',
          icon: 'el-icon-more',
          color: '#0bbd87'
        },
        {
          content: '更新 项目依赖版本',
          timestamp: '2020-04-02 22:45',
          size: 'normal',
          type: 'success',
          icon: 'el-icon-more',
          color: '#0bbd87'
        },
        {
          content: '优化 系统整体运行速度',
          timestamp: '2020-04-02 22:26',
          size: 'normal',
          type: 'success',
          icon: 'el-icon-more',
          color: '#0bbd87'
        },
        {
          content: '优化 未就业原因只显示有具体数据的标签',
          timestamp: '2020-03-27 13:45',
          size: 'normal',
          type: 'success',
          icon: 'el-icon-more',
          color: '#0bbd87'
        },
        {
          content: '新增 就业方向展示历年数据(所占男生女生人数)',
          timestamp: '2020-03-11 11:09',
          size: 'normal',
          type: 'success',
          icon: 'el-icon-more',
          color: '#0bbd87'
        },
        {
          content: '新增 未就业原因显示具体班级及其所占人数',
          timestamp: '2020-03-10 14:29',
          size: 'normal',
          type: 'success',
          icon: 'el-icon-more',
          color: '#0bbd87'
        },
        {
          content: '新增 学生信息按需导出Excel',
          timestamp: '2020-03-10 10:46',
          size: 'normal',
          type: 'success',
          icon: 'el-icon-more',
          color: '#0bbd87'
        },
        {
          content: '新增 学生信息-->信息录入 (就业状态筛选)',
          timestamp: '2020-03-09 20:46',
          size: 'normal',
          type: 'success',
          icon: 'el-icon-more',
          color: '#0bbd87'
        },
        {
          content: '新增 首页数据展示可部分跳转',
          timestamp: '2020-03-05 19:01',
          size: 'normal',
          type: 'success',
          icon: 'el-icon-more',
          color: '#0bbd87'
        },
        {
          content: '优化 修改信息显示原始数据',
          timestamp: '2020-03-05 18:14',
          size: 'normal',
          type: 'success',
          icon: 'el-icon-more',
          color: '#0bbd87'
        },
        {
          content: '新增 教师账号修改',
          timestamp: '2020-03-04 08:25',
          size: 'normal',
          type: 'success',
          icon: 'el-icon-more',
          color: '#0bbd87'
        },
        {
          content: '修复 学生男女比在未选择对象时"undefined"',
          timestamp: '2020-03-03 19:35',
          size: 'normal',
          type: 'success',
          icon: 'el-icon-more',
          color: '#0bbd87'
        },
        {
          content: '完成开发计划',
          timestamp: '2020-01-29 15:25',
          size: 'normal',
          type: 'success',
          icon: 'el-icon-more',
          color: '#0bbd87'
        },
        {
          content: '新增 学生未就业原因及占比图',
          timestamp: '2020-01-27 15:10',
          size: 'normal',
          type: 'success',
          icon: 'el-icon-more',
          color: '#0bbd87'
        },
        {
          content: '新增 学生就业地区分布图',
          timestamp: '2020-01-23 12:10',
          size: 'normal',
          type: 'success',
          icon: 'el-icon-more',
          color: '#0bbd87'
        },
        {
          content: '完善学生信息系统',
          timestamp: '2020-01-21 16:10',
          size: 'normal',
          type: 'success',
          icon: 'el-icon-more',
          color: '#0bbd87'
        },
        {
          content: '完成创建容器页开发',
          timestamp: '2020-01-17 19:43',
          size: 'normal',
          type: 'success',
          icon: 'el-icon-more',
          color: '#0bbd87'
        },
        {
          content: '完善专业管理页面',
          timestamp: '2020-01-17 16:16',
          size: 'normal',
          type: 'success',
          icon: 'el-icon-more',
          color: '#0bbd87'
        },
        {
          content: '新增 检查更新',
          timestamp: '2020-01-16 15:46',
          size: 'normal', // normal,large
          type: 'success', // primary / success / warning / danger / info
          icon: 'el-icon-more',
          color: '#0bbd87' // hsl / hsv / hex / rgb
        },
        {
          content: '前端部分页面完毕',
          timestamp: '2020-01-16 15:46',
          size: 'normal',
          type: 'success',
          icon: 'el-icon-more',
          color: '#0bbd87'
        },
        {
          content: '项目正式启动',
          timestamp: '2020-01-11 10:26',
          size: 'normal',
          type: 'success',
          icon: 'el-icon-more',
          color: '#0bbd87'
        }
      ]
    }
  }
}
</script>

<style scoped>

  .right-col > .el-row:nth-child(1) {
    text-align: center;
  }

  .right-col > .el-row:nth-child(3) {
    text-align: center;
  }
</style>
