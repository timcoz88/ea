<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '380px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },

  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    },
    setOptions(data) {
      const option = {
        title: {
          text: '数据库实时负载',
          textStyle: {
            color: '#333'
          }
        },
        // backgroundColor: '#333',
        tooltip: {
          formatter: '{a} <br/>{b} : {c}%'
        },
        series: [
          {
            name: '业务指标',
            type: 'gauge',
            detail: { formatter: '{value}%' },
            data: [{ value: data }],
            axisLine: { // 坐标轴线
              lineStyle: { // 属性lineStyle控制线条样式
                color: [[0.2, '#00d374'], [0.8, '#3470ec'], [1, '#E55541']],
                width: 16,
                shadowColor: 'transparent'
              }
            },
            axisTick: { // 坐标轴小标记
              show: false
            },
            splitLine: { // 分隔线
              length: 16, // 属性length控制线长
              lineStyle: {
                width: 2
              }
            },
            pointer: {
              length: 80,
              width: 2,
              shadowColor: '#fff', // 默认透明
              shadowBlur: 5
            }
          }
        ]
      }

      this.chart.setOption(option)
    }
  }

}
</script>
