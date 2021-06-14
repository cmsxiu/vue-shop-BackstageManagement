<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计 </el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
      <div
        id="myChart"
        :style="{width: '100%', height: '400px'}"
      ></div>
    </el-card>
  </div>
</template>
<script>
// 1. 导入 echarts
import echarts from 'echarts'
import _ from 'lodash'
export default {
  data () {
    return {
      // 需要合并的数据
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  methods: {
    async getCharts () {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('myChart'))
      const { data: res } = await this.$http.get('reports/type/1')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      const result = _.merge(res.data, this.options)
      // // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(result)
    }
  },
  mounted () {
    this.getCharts()
  }
}
</script>
<style lang="less" scoped>
.box-card {
  width: 100%;
  height: 100%;
  min-width: 100%;
  margin-top: 20px;
  transition: all 0.5s;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}
</style>