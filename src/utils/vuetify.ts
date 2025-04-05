import '@mdi/font/css/materialdesignicons.css';

import 'vuetify/lib/styles/main.sass';
import { createVuetify, type ThemeDefinition } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const lightTheme: ThemeDefinition = {
  colors: {
    primary: '#03A9F4',
    'primary-darken-1': '#0277BD',
    'surface-light': '#E1F5FE',
    'surface-dark': '#B3E5FC',
    error: '#FF1744',
  },
};

const darkTheme: ThemeDefinition = {
  colors: {
    primary: '#0277BD',
    'primary-darken-1': '#01579B',
    'surface-light': '#01579B',
    'surface-dark': '#003561',
    error: '#FF1744',
  },
};

export function getVuetify() {
  const vuetify = createVuetify({
    theme: {
      themes: {
        light: lightTheme,
        dark: darkTheme,
      },
    },
    components,
    directives,
    icons: {
      defaultSet: 'mdi',
    },
  });

  return vuetify;
}
