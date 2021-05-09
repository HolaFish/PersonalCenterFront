<template>
  <v-app class="ma-2">
    <v-row>
      <v-col cols="12" md="3">
        <v-card>
          <v-card-title>资产</v-card-title>
          <v-card-text> 10000W </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card>
          <v-card-title>负债</v-card-title>
          <v-card-text> 0W </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card>
          <v-card-title>收入</v-card-title>
          <v-card-text> 10000W </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card>
          <v-card-title>支出</v-card-title>
          <v-card-text> 100W </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
          <div id="chart1" class="charts"></div>
      </v-col>
      <v-col cols="12" md="6"> 
          <div id="chart2" class="charts"></div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
          <div id="chart3" class="charts"></div>
      </v-col>
      <v-col cols="12" md="6"> 
          <div id="chart4" class="charts"></div>
      </v-col>
    </v-row>
  </v-app>
</template>

<script>
import * as echarts from "echarts";

export default {
  data() {
    return {
        chart1:null,
        chart2:null,
        chart3:null,
        chart4:null,
      option1: {
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [150, 230, 224, 218, 135, 147, 260],
            type: "line",
          },
        ],
      },
      option2: {
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [150, 230, 224, 218, 135, 147, 260],
            type: "line",
          },
        ],
      },
      option3: {
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [150, 230, 224, 218, 135, 147, 260],
            type: "line",
          },
        ],
      },
      option4: {
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [150, 230, 224, 218, 135, 147, 260],
            type: "line",
          },
        ],
      },
    };
  },
  mounted(){
      this.chart1 = echarts.init(document.getElementById('chart1'));
      this.chart1.setOption(this.option1);

      this.chart2 = echarts.init(document.getElementById('chart2'));
      this.chart2.setOption(this.option2);

      this.chart3 = echarts.init(document.getElementById('chart3'));
      this.chart3.setOption(this.option3);

      this.chart4 = echarts.init(document.getElementById('chart4'));
      this.chart4.setOption(this.option4);
  }
};
</script>

<style>
.charts{
    min-height: 300px;
}
</style>