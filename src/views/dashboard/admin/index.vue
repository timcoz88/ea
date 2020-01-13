<template>
  <div class="dashboard-editor-container">
    <!--<github-corner class="github-corner" />-->
    <!--<panel-group @handleSetLineChartData="handleSetLineChartData" />-->
    <el-row :gutter="32" style="padding:16px 16px 0">
      <!-- 左面进度 -->
      <el-col :xs="12" :sm="12" :lg="12">
        <div style="display: flex">
          <div class="chart-wrapper left-progress">
            <el-radio-group v-model="chooseLevelIndex" style="width: 100%">
              <el-row type="flex" v-for="(item, index) in chartData1" :key="index" style="margin-bottom: 10px;margin-top: 16px">
                <el-col style="width: 100px">
                  <el-radio :label="index" class="home-progress-radio">{{item.dsn}}</el-radio>
                </el-col>
                <el-col>
                  <el-progress :percentage="item.loads * 100"/>
                </el-col>
              </el-row>
            </el-radio-group>
          </div>
          <div class="chart-wrapper right-progress">
            <echarts1 :chartData="chartDataFilter1" />
          </div>
        </div>
      </el-col>
      <!-- 仪表盘 -->
      <!-- 预警 -->
      <el-col :xs="12" :sm="12" :lg="12" class="wrap-col">
        <div class="summary">
          <el-row :gutter="20">
            <el-col :sm="8" :lg="8">
              <div class="summary-item pointer" @click="redirectToWaringByFlg(0)">
                <img src="./img/board_new.png">
                <div class="summary-txt">
                  <div class="summary-title text-red">新预警</div>
                  <div><strong>{{ summaryData.cnt0 }}</strong>件</div>
                </div>
              </div>
            </el-col>
            <el-col :sm="8" :lg="8">
              <div class="summary-item pointer" @click="redirectToWaringByFlg(1)">
                <img src="./img/board_wait.png">
                <div class="summary-txt">
                  <div class="summary-title text-yellow">待处理预警</div>
                  <div><strong>{{ summaryData.cnt1 }}</strong>件</div>
                </div>
              </div>
            </el-col>
            <el-col :sm="8" :lg="8">
              <div class="summary-item pointer" @click="redirectToWaringByAll()">
                <img src="./img/board_month.png">
                <div class="summary-txt">
                  <div class="summary-title text-green">本月预警</div>
                  <div><strong>{{ summaryData.cnt3 }}</strong>件</div>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :sm="8" :lg="8">
              <div class="summary-item pointer" @click="redirectToWaringByFlg(2)">
                <img src="./img/board_urgency.png">
                <div class="summary-txt">
                  <div class="summary-title text-red">已处理预警</div>
                  <div><strong>{{ summaryData.cnt2 }}</strong>件</div>
                </div>
              </div>
            </el-col>
            <el-col :sm="8" :lg="8">
              <div class="summary-item pointer" @click="redirectToWaringByAll()">
                <img src="./img/board_imp.png">
                <div class="summary-txt">
                  <div class="summary-title text-blue">累计预警</div>
                  <div><strong>{{ summaryData.cnt4 }}</strong>件</div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <line-chart :chart-data="lineChartData" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart height="350px" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper" >
          <bar-chart height="350px"  />
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 18}" :xl="{span: 18}" style="background: #fff;padding-right:8px;margin-bottom:30px; min-height: 480px">
        <transaction-table />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <todo-list />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import LineChart from './components/LineChart'
import RaddarChart from './components/RaddarChart'
import BarChart from './components/BarChart'
import TransactionTable from './components/TransactionTable'
import TodoList from './components/TodoList'
import BoxCard from './components/BoxCard'
import { getDashboard, getDashboard4 } from '@/api/home'
import Echarts1 from './components/echarts1'

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
  name: 'DashboardAdmin',
  components: {
    LineChart,
    RaddarChart,
    BarChart,
    TransactionTable,
    TodoList,
    BoxCard,
    Echarts1
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis,
      chooseLevelIndex: 0,
      chartData1: [],
      summaryData: {}
    }
  },
  computed: {
    chartDataFilter1() {
      if (!this.chartData1.length) return 0
      console.log(this.chartData1[this.chooseLevelIndex].loads * 100)
      return this.chartData1[this.chooseLevelIndex].loads * 100
    }
  },
  created() {
    this.getPieDashboard()
    this.getDashboard4()
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    },
    getPieDashboard() {
      getDashboard()
        .then(({ results }) => {
          this.chartData1 = results
        })
    },
    getDashboard4() {
      getDashboard4()
        .then(({ results }) => {
          this.summaryData = results
        })
    },
    handlePieChartData() {
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }

  .home-progress-box{
    display: flex;
  }
  .home-progress-radio{
    flex: 1;
    width: 100px;
  }

  .left-progress {
    width: 40%;
    height: 400px;
  }

  .right-progress {
    width: 60%;
    height: 400px;
  }

  .summary{
    padding: 60px 40px 60px;
    height: 400px;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    // background-color: #333;
    &-item{
      height: 114px;
      font-size: 14px;
      // color: #fff;
      strong{
        padding-right: 10px;
        font-size: 18px;
      }
      img{
        display: block;
        margin-right: 29px;
        float: left;
      }
    }

    &-title{
      padding: 22px 0 16px;
      font-size: 18px
    }
  }

}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
