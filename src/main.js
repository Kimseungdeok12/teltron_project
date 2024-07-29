import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import router from './router';

const app = createApp(App)
app.config.globalProperties.$axios = axios;
app.use(router);
app.mount('#app');
