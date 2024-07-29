<template>
    <div class="dashboard">
      <header class="header">
        <h1>TELTRON SENSOR DATA</h1>
        <button @click="fetchData" class="fetch-button">실시간 데이터 갱신</button>
      </header>
  
      <main class="main-content">
        <DefaultView v-if="viewMode === 'default'" :formattedData="formattedData" :loading="loading" :error="error" />
      </main>
  
      <footer class="footer">
        <button @click="logout" class="logout-button">Logout</button>
      </footer>
    </div>
  </template>
  
  <script>
  import DefaultView from './DefaultView.vue';
  import axios from 'axios';
  
  export default {
    name: 'DashBoard',
    components: {
      DefaultView
    },
    data() {
      return {
        viewMode: 'default', // 초기값은 'default'
        formattedData: null,
        loading: true,
        error: null
      };
    },
    methods: {
      async fetchData() {
        this.loading = true;
        try {
          const response = await axios.get('/api/sensors');
          const latestData = response.data.slice(-1)[0];
          this.formattedData = {
            activityLevel: latestData.activityLevel,
            breathLevel: latestData.breathLevel,
            temperature: latestData.temperature,
            lightLevel: latestData.lightLevel
          };
          this.error = null;
        } catch (error) {
          this.error = error.response?.data || error.message;
          this.formattedData = null;
        } finally {
          this.loading = false;
        }
      },
      setViewMode(mode) {
        console.log(`Setting viewMode to ${mode}`);
        this.viewMode = mode;
      },
      logout() {
        localStorage.removeItem('token');
        this.$router.push({ name: 'Login' });
      }
    },
    created() {
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
  
  .view-mode-toggle {
    display: none; /* Remove the view mode toggle section */
  }
  
  .main-content {
    flex: 1;
    padding: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
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
  </style>
  