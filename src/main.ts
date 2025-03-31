import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from '@/router';
import { getVuetify } from '@/utils/vuetify';

function bootstrap() {
  const app = createApp(App);

  app.use(createPinia());

  app.use(router);
  app.use(getVuetify());

  app.mount('#app');
}

bootstrap();
