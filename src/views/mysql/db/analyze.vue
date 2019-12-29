<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="8">
        <LineChartCpu height="350px" width="100%" />
      </el-col>
      <el-col :span="8">
        <LineChartLogin height="350px" width="100%" />
      </el-col>
      <el-col :span="8">
        <el-row :gutter="20">
          <el-col :span="12">
            <LineChartCpu height="160px" width="100%" />
          </el-col>
          <el-col :span="12">
            <LineChartCpu height="160px" width="100%" />
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <LineChartCpu height="160px" width="100%" />
          </el-col>
          <el-col :span="12">
            <LineChartCpu height="160px" width="100%" />
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="16">
        <LineChartCpu height="350px" width="100%" />

      </el-col>
      <el-col :span="8">
        <LineChartCpu height="350px" width="100%" />
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col>
        <LineChartCpu height="350px" width="100%" />
      </el-col>
    </el-row>
  </div>
</template>
<script>
import LineChart from './components/LineChart'
import LineChartCpu from './components/LineChartCpu'
import LineChartLogin from './components/LineChartLogin'

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

export default {
  components: {
    LineChart,
    LineChartCpu,
    LineChartLogin
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis
    }
  }
}
</script>
<style scoped lang="scss">
  .el-row{
    margin-bottom: 20px;
  }
</style>
