import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'status',
      component: () => import('@/ui/components/debug.vue'),
    },
  ],
});

export default router;
