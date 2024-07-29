<template>
  <div class="login-container">
    <div class="login-card">
      <h2>Teltron</h2>
      <form @submit.prevent="login">
        <div class="form-group">
          <input type="email" id="email" v-model="email" required placeholder="Email">
        </div>
        <div class="form-group">
          <input type="password" id="password" v-model="password" required placeholder="Password">
        </div>
        <button type="submit" class="login-button">Login</button>
      </form>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'LoginPage',
  data() {
    return {
      email: '',
      password: '',
      errorMessage: ''
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('http://localhost:8080/api/auth/login', {
          email: this.email,
          password: this.password
        });
        
        console.log('로그인 성공:', response.data);
        localStorage.setItem('token', response.data.accessToken);
        this.$router.push({ name: 'DashBoard' });
      } catch (error) {
        console.error('로그인 오류:', error.response ? error.response.data : error.message);
        this.errorMessage = '로그인 실패. 아이디와 비밀번호를 확인하세요.';
      }
    }
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
}

.login-card {
  background-color: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h2 {
  color: #1a73e8;
  margin-bottom: 30px;
  font-size: 28px;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
}

input[type="email"], input[type="password"] {
  width: 100%;
  padding: 12px;
  border: 1px solid #dddfe2;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

input[type="email"]:focus, input[type="password"]:focus {
  border-color: #1a73e8;
  outline: none;
}

.login-button {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 4px;
  background-color: #1a73e8;
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.login-button:hover {
  background-color: #1557b0;
}

.error-message {
  color: #d93025;
  font-size: 14px;
  margin-top: 15px;
  text-align: center;
}
</style>