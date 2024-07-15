import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../views/Dashboard.vue'; // 대시보드 컴포넌트 경로에 맞게 수정

const routes = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true } // 인증이 필요한 페이지라면 추가
  },
  // 다른 라우트들을 필요에 따라 추가
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;