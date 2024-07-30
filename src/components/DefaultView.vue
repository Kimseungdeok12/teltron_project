<template>
  <div class="default-view-container">
    <div class="default-view">
      <div v-if="initialLoading" class="data-display">
        <div class="data-card skeleton" v-for="i in 4" :key="'skeleton-'+i">
          <div class="skeleton-title"></div>
          <div class="skeleton-value"></div>
        </div>
      </div>
      <div v-else-if="formattedData" class="data-display">
        <div class="data-cards-container">
          <div class="data-card" v-for="(value, key) in formattedData" :key="key">
            <h2>{{ getTitle(key) }}</h2>
            <p>{{ key === 'timestamp' ? formatTime(value) : value }}{{ getUnit(key) }}</p>
          </div>
        </div>
        <div class="status-buttons">
          <div class="status-button-container">
            <button :class="temperatureButtonClass">{{ temperatureAlertMessage }}</button>
          </div>
          <div class="status-button-container">
            <button :class="breathButtonClass">{{ breathAlertMessage }}</button>
          </div>
          <div class="status-button-container">
            <p class="activity-status">{{ activityStatus }}</p>
          </div>
        </div>
      </div>
      <p v-if="error" class="error-message">에러 발생: {{ error }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DefaultView',
  props: {
    formattedData: Object,
    loading: Boolean,
    error: String
  },
  data() {
    return {
      initialLoading: true
    };
  },
  watch: {
    loading(newValue) {
      if (!newValue && this.initialLoading) {
        this.initialLoading = false;
      }
    }
  },
  computed: {
    temperatureAlertMessage() {
      if (this.formattedData && this.formattedData.temperature >= 30) {
        return '위험: 온도가 높습니다!';
      } else {
        return '안전: 온도가 정상입니다.';
      }
    },
    temperatureButtonClass() {
      if (this.formattedData && this.formattedData.temperature >= 30) {
        return 'status-button alert';
      } else {
        return 'status-button safe';
      }
    },
    breathAlertMessage() {
      if (this.formattedData && this.formattedData.breathLevel >= 50) {
        return '안전: 호흡 수준이 정상입니다.';
      } else if (this.formattedData.breathLevel >= 30) {
        return '주의: 호흡 수준이 낮습니다. 주의가 필요합니다.';
      } else {
        return '위험: 호흡 수준이 매우 낮습니다.';
      }
    },
    breathButtonClass() {
      if (this.formattedData && this.formattedData.breathLevel >= 50) {
        return 'status-button safe';
      } else if (this.formattedData.breathLevel >= 30) {
        return 'status-button caution';
      } else {
        return 'status-button alert';
      }
    },
    activityStatus() {
      if (this.formattedData && this.formattedData.activityLevel >= 50) {
        return '활동적입니다.';
      } else {
        return '비활동적입니다.';
      }
    }
  },
  methods: {
    getTitle(key) {
      const titles = {
        activityLevel: '활동 수준',
        breathLevel: '호흡 수준',
        temperature: '온도',
        lightLevel: '빛 수준',
        timestamp: '시간' 
      };
      return titles[key] || key;
    },
    getUnit(key) {
      const units = {
        temperature: ' °C',
        lightLevel: ' lux'
      };
      return units[key] || '';
    },
    formatTime(value) {
      const date = new Date(value);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      
      return `${year}-${month}-${day} ${hours}시 ${minutes}분`;
    }
  }
};
</script>


<style scoped>
.default-view-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.default-view .data-display {
  width: 100%;
  margin-bottom: 2.5rem;
}

.data-cards-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.875rem;
}

.data-card {
  background: #ffffff;
  border-radius: 0.75rem;
  padding: 1.25rem;
  text-align: center;
  box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  flex: 1 1 250px;
  max-width: 250px;
}

.data-card:hover {
  transform: translateY(-0.3125rem);
  box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.2);
}

.data-card h2 {
  font-size: 1.3rem;
  color: #000000;
  margin-bottom: 0.625rem;
  font-weight: 600;
}

.data-card p {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  color: #000000;
}

.skeleton {
  background: #e0e0e0;
  border-radius: 0.75rem;
  padding: 1.25rem;
  text-align: center;
  box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.1);
}

.skeleton-title,
.skeleton-value {
  background: #ccc;
  height: 1.25rem;
  margin: 0.625rem 0;
  border-radius: 0.25rem;
}

.status-buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  width: 100%;
  margin-top: 2.5rem;
}

.status-button-container {
  width: 100%;
  max-width: 320px;
  display: flex;
  justify-content: center;
}

.status-button {
  border: none;
  padding: 0.875rem 1.75rem;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  color: #fff;
  font-weight: 600;
  width: 100%;
}

.status-button.alert {
  background: #ff4d4d;
}

.status-button.caution {
  background: #ffcc00;
}

.status-button.safe {
  background: #4caf50;
}

.status-button:hover {
  opacity: 0.9;
}

.activity-status {
  font-size: 1.5rem;
  font-weight: 700;
}

.error-message {
  color: #ff4d4d;
  font-size: 1.2rem;
  text-align: center;
  background: #fdecea;
  padding: 1.25rem;
  border-radius: 0.5rem;
  box-shadow: 0 0.375rem 0.75rem rgba(0, 0, 0, 0.1);
  margin-top: 1.25rem;
}

@media (max-width: 768px) {
  .data-card {
    flex: 1 1 100%;
    max-width: 100%;
  }

  .data-card h2 {
    font-size: 1.1rem;
  }

  .data-card p {
    font-size: 1.6rem;
  }

  .status-button {
    font-size: 0.9rem;
    padding: 0.75rem 1.5rem;
  }

  .activity-status {
    font-size: 1.3rem;
  }

  .error-message {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .data-cards-container {
    gap: 1rem;
  }

  .status-buttons {
    gap: 1rem;
  }

  .data-card h2 {
    font-size: 1rem;
  }

  .data-card p {
    font-size: 1.4rem;
  }

  .status-button {
    font-size: 0.8rem;
    padding: 0.625rem 1.25rem;
  }

  .activity-status {
    font-size: 1.1rem;
  }
}
</style>
