<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="login">
      <label>Email:</label>
      <input type="email" v-model="email" required>
      <label>Password:</label>
      <input type="password" v-model="password" required>
      <button type="submit">Login</button>
    </form>
    <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
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
        // 로그인 성공 시 처리 (예: 토큰 저장 등)
        localStorage.setItem('token', response.data.token);

        // 로그인 후 페이지 이동
        window.location.href = '/dashboard'; // 페이지 이동

      } catch (error) {
        console.error('로그인 오류:', error);
        this.errorMessage = '로그인 실패. 아이디와 비밀번호를 확인하세요.';
      }
    }
  }
};
</script>
