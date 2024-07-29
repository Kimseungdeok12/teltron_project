<template>
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
          <p>{{ value }}{{ getUnit(key) }}</p>
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
    }
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
        lightLevel: '빛 수준'
      };
      return titles[key] || key;
    },
    getUnit(key) {
      const units = {
        temperature: ' °C',
        lightLevel: ' lux'
      };
      return units[key] || '';
    }
  }
};
</script>

<style scoped>
.default-view .data-display {
  width: 100%;
  margin-bottom: 40px;
}

.data-cards-container {
  display: flex; /* 카드들을 가로로 나열 */
  flex-wrap: nowrap; /* 카드들이 한 줄에 나열되도록 설정 */
  overflow-x: auto; /* 카드들이 넘칠 때 스크롤 가능하게 설정 */
  gap: 30px; /* 카드 간의 간격 설정 */
}

.data-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  flex: 0 0 auto; /* 카드가 크기에 맞게 고정 */
  width: 250px; /* 카드의 고정 너비 설정 */
}

.data-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.2);
}

.data-card h2 {
  font-size: 1.3rem;
  color: #000000;
  margin-bottom: 10px;
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
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.skeleton-title,
.skeleton-value {
  background: #ccc;
  height: 20px;
  margin: 10px 0;
  border-radius: 4px;
}

.status-buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
  margin-top: 40px; /* 카드와 버튼 사이의 간격을 늘리기 위해 추가 */
}

.status-button-container {
  width: 100%;
  max-width: 320px;
  display: flex;
  justify-content: center;
}

.status-button {
  border: none;
  padding: 14px 28px;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;
  color: #fff;
  font-weight: 600;
  width: 100%;
}

.status-button.alert {
  background: #ff4d4d; /* Red for alert */
}

.status-button.caution {
  background: #ffcc00; /* Orange for caution */
}

.status-button.safe {
  background: #4caf50; /* Green for safe */
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
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}
</style>
