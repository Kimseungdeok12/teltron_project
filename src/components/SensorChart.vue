<!-- src/components/SensorChart.vue -->
<template>
    <div class="chart-wrapper">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </template>
  
  <script>
  import { Line } from 'vue-chartjs';
  import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js';
  
  ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale);
  
  export default {
    name: 'SensorChart',
    components: {
      Line
    },
    props: {
      data: {
        type: Array,
        required: true
      },
      labelX: {
        type: String,
        default: 'Time'
      },
      labelY: {
        type: String,
        default: 'Value'
      }
    },
    computed: {
      chartData() {
        return {
          labels: this.data.map(item => item.timestamp),
          datasets: [
            {
              label: this.labelY,
              data: this.data.map(item => item.value),
              borderColor: '#42A5F5',
              backgroundColor: 'rgba(66, 165, 245, 0.2)',
              borderWidth: 2,
              fill: true
            }
          ]
        };
      },
      chartOptions() {
        return {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                color: '#333',
                font: {
                  size: 14
                }
              }
            },
            tooltip: {
              callbacks: {
                label: function(tooltipItem) {
                  return tooltipItem.raw;
                }
              },
              backgroundColor: '#333',
              titleColor: '#fff',
              bodyColor: '#fff'
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: this.labelX,
                color: '#333',
                font: {
                  size: 14
                }
              },
              ticks: {
                color: '#333'
              }
            },
            y: {
              title: {
                display: true,
                text: this.labelY,
                color: '#333',
                font: {
                  size: 14
                }
              },
              ticks: {
                color: '#333'
              }
            }
          }
        };
      }
    }
  };
  </script>
  
  <style scoped>
  .chart-wrapper {
    width: 100%;
    height: 400px; /* 기본 높이 설정 */
    max-width: 100%;
  }
  
  @media (max-width: 768px) {
    .chart-wrapper {
      height: 300px; /* 모바일에서는 더 작은 높이 */
    }
  }
  
  @media (max-width: 480px) {
    .chart-wrapper {
      height: 200px; /* 매우 작은 화면에서는 더 작은 높이 */
    }
  }
  
  canvas {
    width: 100% !important;
    height: 100% !important;
  }
  </style>
  