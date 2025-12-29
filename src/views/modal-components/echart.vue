<template>
  <div class="page-content">
    <div id="eventechart" class="echart"></div>
    <div class="legend">
      <div class="legend_center" v-for="(item,index) in echartTitle">
        <span class="legend_center_block" ref="blabla"></span>
        <span class="legend_center_title">{{item.name}}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default { 
  props: {
    xData: {
      default: '["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]'
    },
    yData: {
      default: "[820, 932, 901, 934, 1290, 1330, 13120]"
    },
    isShow: {
      type: Boolean,
      default: false
    },
    echartTitle: {
      default: []
    }
  },
  data() {
    return {};
  },
  mounted() {},
  watch: {
    isShow(_value) {
      if (_value) {        
       //引入eharts主模块
        const echarts = require("echarts/lib/echarts");
        //引入eharts折线图模块
        require("echarts/lib/chart/line");
        var myChart = echarts.init(document.getElementById("eventechart"));
        let obj = {
          title: {
            text: ""
          },
          tooltip: {trigger: 'axis'},
          legend: {
            // data:['会员总数'],
            // selectedMode: 'single'
          },
          xAxis: {
            type: "category",
            boundaryGap: false, //控制xz轴边界
            data: JSON.parse(this.xData),
            axisLabel: {
              color: "#495060"
            },
            axisLine: {
              //轴线颜色
              lineStyle: {
                width: 2,
                color: "#e3e3e3"
              }
            }
          },
          yAxis: {
            // axisTick: {
            //   show: false //隐藏y轴线分割线
            // },
            // axisLine: {
            //   show: false //隐藏y轴线
            // },
            splitLine: {
              lineStyle: {
                type: "dashed",
                color: "#eff0ef"
              },
              show: true //隐藏分割线
            }
          },
          series: []
        }
        /*
        * anthor jiayin
        * time 19.2.1
        * this.echartTitle中存着对应元素的颜色和名字
        * 设置对应名字和颜色和曲线的数量
        */
        let c = 0;
        obj.series = []
        for (let i in JSON.parse(this.yData)) {
          obj.series.push({
            name: i,
            data: JSON.parse(this.yData)[i],
            type: "line",
            color: this.echartTitle[c].color
          })
          c++;
        }
        for (let i = 0;i < c;i++) {
          this.$nextTick(function() {
          // 你的设置背景色代码
            document.getElementsByClassName('legend_center_block')[i].style.background = this.echartTitle[i].color
          })
        }
        myChart.setOption(obj,true);   //  第二参数是不合并
      }
    }
  },
  methods: {}
};
</script>
<style lang="less" scoped>
.echart {
  width: 100%;
  height: 400px;
}
.legend {
  margin-top: -20px;
}
.legend_center {
  width: 100px;
  margin: 0 auto;
  height: 20px;
}
.legend_center_block {
  width: 20px;
  height: 6px;
  background: #68bbe2;
  display: block;
  float: left;
  margin-top: 5px;
  margin-right: 8px;
}
.legend_center_title {
  display: block;
  margin-left: 30px;
}
</style>
