import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/pages/home.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/pages/settings.vue'),
    },
  ],
});

export default router;
