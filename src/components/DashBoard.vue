<template>
  <div class="dashboard">
    <header class="header">
      <h1>TELTRON SENSOR DATA</h1>
      <button @click="fetchData" class="fetch-button">실시간 데이터 갱신</button>
    </header>
    
    <main class="main-content">
      <DefaultView v-if="viewMode === 'default'" :formattedData="formattedData" :loading="loading" :error="error" />
      
      <!-- Temperature Chart -->
      <div v-if="temperatureData.length" class="chart-container">
        <h2>Temperature Data</h2>
        <SensorChart :data="temperatureData" labelX="Time" labelY="Temperature" />
      </div>
      
      <!-- Breath Level Chart -->
      <div v-if="breathData.length" class="chart-container">
        <h2>Breath Level Data</h2>
        <SensorChart :data="breathData" labelX="Time" labelY="Breath Level" />
      </div>
      
    </main>
    
    <footer class="footer">
      <div><button @click="downloadData" class="download-button">데이터 다운로드</button></div>
      <button @click="logout" class="logout-button">Logout</button>
    </footer>
  </div>
</template>

<script>
import DefaultView from './DefaultView.vue';
import SensorChart from './SensorChart.vue';
import axios from 'axios';

export default {
  name: 'DashBoard',
  components: {
    DefaultView,
    SensorChart
  },
  data() {
    return {
      viewMode: 'default',
      formattedData: null,
      loading: true,
      error: null,
      allData: [],
      temperatureData: [],
      breathData: []
    };
  },
  methods: {
    formatTimestampForDisplay(timestamp) {
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    },
    async fetchData() {
      this.loading = true;
      try {
        const response = await axios.get('/api/sensors');
        const latestData = response.data.slice(-1)[0];
        this.formattedData = {
          activityLevel: latestData.activityLevel,
          breathLevel: latestData.breathLevel,
          temperature: latestData.temperature,
          lightLevel: latestData.lightLevel,
          timestamp: latestData.time// 원본 타임스탬프는 그대로 사용
        };
        this.error = null;
        
        // Add new data to the list
        this.allData.push(this.formattedData);

        // Limit the number of data items to 600
        if (this.allData.length > 600) {
          this.allData.shift(); // Remove the oldest data
        }

        // Display the latest 100 data points for the chart
        const latest100Data = this.allData.slice(-100);
        
        this.temperatureData = latest100Data.map(data => ({
          timestamp: this.formatTimestampForDisplay(data.timestamp),
          value: data.temperature
        }));

        this.breathData = latest100Data.map(data => ({
          timestamp: this.formatTimestampForDisplay(data.timestamp),
          value: data.breathLevel
        }));
        
        localStorage.setItem('sensorData', JSON.stringify(this.allData));
        
      } catch (error) {
        this.error = error.response?.data || error.message;
        this.formattedData = null;
      } finally {
        this.loading = false;
      }
    },
    downloadData() {
      const data = localStorage.getItem('sensorData');
      if (data) {
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sensor_data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        alert('저장된 데이터가 없습니다.');
      }
    },
    clearData() {
      localStorage.removeItem('sensorData');
      this.allData = [];
      console.log('Sensor data has been cleared');
    },
    logout() {
      this.clearData(); // 로그아웃 시 데이터 삭제
      localStorage.removeItem('token');
      this.$router.push({ name: 'Login' });
    },
    setViewMode(mode) {
      console.log(`Setting viewMode to ${mode}`);
      this.viewMode = mode;
    }
  },
  created() {
    const savedData = localStorage.getItem('sensorData');
    if (savedData) {
      this.allData = JSON.parse(savedData);
      if (this.allData.length > 600) {
        this.allData = this.allData.slice(-600); // 데이터가 600개를 초과하면 최신 600개만 유지
      }
      const latest100Data = this.allData.slice(-100);
      this.temperatureData = latest100Data.map(data => ({
        timestamp: this.formatTimestampForDisplay(data.timestamp),
        value: data.temperature
      }));
      this.breathData = latest100Data.map(data => ({
        timestamp: this.formatTimestampForDisplay(data.timestamp),
        value: data.breathLevel
      }));
      console.log('저장된 데이터:', this.allData);
    }
    
    this.fetchData();
    this.intervalId = setInterval(this.fetchData, 10000);
  },
  beforeUnmount() {
    clearInterval(this.intervalId);
  }
};
</script>

<style scoped>
.dashboard {
  font-family: 'Inter', sans-serif;
  color: #2c3e50;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f0f4f8;
}

.header {
  background: linear-gradient(135deg, #0033cc 0%, #3399ff 100%);
  color: #fff;
  padding: 40px 20px;
  text-align: center;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.header h1 {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: 1px;
}

.fetch-button {
  background: #1e90ff;
  color: #fff;
  border: none;
  padding: 14px 28px;
  font-size: 1.1rem;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;
  margin-top: 20px;
  font-weight: 600;
}

.fetch-button:hover {
  background: #074e96;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.main-content {
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.chart-container {
  margin-bottom: 40px;
  width: 100%;
  max-width: 800px; /* 최대 너비 설정 */
}

.chart-container h2 {
  font-size: 1.5rem;
  margin-bottom: 20px;
}

.footer {
  background: #ffffff;
  text-align: center;
  padding: 20px;
  border-top: 1px solid #ddd;
}

.logout-button {
  background: #ff4d4d;
  color: #fff;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.logout-button:hover {
  background: #cc0000;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.download-button {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.download-button:hover {
  background: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>
